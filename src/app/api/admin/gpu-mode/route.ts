import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// GPU Mode configuration
const GPU_MODES = {
  bella: {
    name: 'Bella Mode (Default)',
    description: 'All containers running normally',
    containers: {
      start: [
        'chanceapp-ollama',
        'chanceapp-embeddings',
        'chanceapp-qwen2-vl',
        'chanceapp-bark-tts',
        'plex'
      ],
      stop: []
    }
  },
  training: {
    name: 'Image Training Mode',
    description: 'Only ComfyUI for image training',
    containers: {
      start: ['chanceapp-comfyui'],
      stop: [
        'chanceapp-ollama',
        'chanceapp-embeddings',
        'chanceapp-qwen2-vl',
        'chanceapp-bark-tts',
        'plex'
      ]
    }
  },
  gaming: {
    name: 'Gaming Mode',
    description: 'All GPU containers stopped',
    containers: {
      start: [],
      stop: [
        'chanceapp-comfyui',
        'chanceapp-ollama',
        'chanceapp-embeddings',
        'chanceapp-qwen2-vl',
        'chanceapp-bark-tts',
        'plex'
      ]
    }
  }
};

type GPUMode = keyof typeof GPU_MODES;

interface ContainerState {
  name: string;
  running: boolean;
  hasGPU: boolean;
  status: string;
}

// Validate GPU access for a container
async function validateGPUAccess(container: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync(
      `docker inspect ${container} --format '{{json .HostConfig.DeviceRequests}}'`
    );
    const deviceRequests = JSON.parse(stdout.trim());
    return deviceRequests && deviceRequests.length > 0 &&
           deviceRequests[0].Driver === 'nvidia';
  } catch (error) {
    console.error(`Failed to validate GPU for ${container}:`, error);
    return false;
  }
}

// Get detailed container state
async function getContainerState(container: string): Promise<ContainerState> {
  try {
    const { stdout: statusOut } = await execAsync(
      `docker inspect ${container} --format '{{.State.Running}}\t{{.State.Status}}'`
    );
    const [running, status] = statusOut.trim().split('\t');
    const hasGPU = await validateGPUAccess(container);

    return {
      name: container,
      running: running === 'true',
      hasGPU,
      status
    };
  } catch (error) {
    return {
      name: container,
      running: false,
      hasGPU: false,
      status: 'not found'
    };
  }
}

// Pre-flight checks before switching modes
async function preFlightChecks(mode: GPUMode): Promise<{ ok: boolean; issues: string[] }> {
  const issues: string[] = [];
  const config = GPU_MODES[mode];

  // Check all containers exist and have GPU access
  const allContainers = [...config.containers.start, ...config.containers.stop];

  for (const container of allContainers) {
    try {
      // Check container exists
      await execAsync(`docker inspect ${container}`);

      // Validate GPU access for GPU containers
      const hasGPU = await validateGPUAccess(container);
      if (!hasGPU) {
        issues.push(`${container} is missing GPU access configuration`);
      }
    } catch (error) {
      issues.push(`${container} not found or inaccessible`);
    }
  }

  // Check nvidia-smi is accessible
  try {
    await execAsync('nvidia-smi');
  } catch (error) {
    issues.push('GPU not accessible (nvidia-smi failed)');
  }

  return {
    ok: issues.length === 0,
    issues
  };
}

// Helper to execute docker commands with retry
async function dockerCommandWithRetry(
  command: string,
  container: string,
  maxRetries: number = 3
): Promise<void> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const { stdout, stderr } = await execAsync(`docker ${command} ${container}`);

      // Success cases
      if (!stderr ||
          stderr.includes('is already') ||
          stderr.includes('is not running') ||
          stderr.includes('No such container')) {
        return;
      }

      console.log(`Docker ${command} ${container}: ${stdout || 'success'}`);
      return;
    } catch (error: any) {
      lastError = error;

      // Don't retry on these errors
      if (error.message.includes('No such container')) {
        throw new Error(`Container ${container} does not exist`);
      }
      if (error.message.includes('is already')) {
        return; // Already in desired state
      }

      // Wait before retry
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} retries: ${lastError?.message}`);
}

// Verify container is in expected state
async function verifyContainerState(
  container: string,
  expectedRunning: boolean,
  timeout: number = 10000
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const { stdout } = await execAsync(
        `docker inspect ${container} --format '{{.State.Running}}'`
      );
      const isRunning = stdout.trim() === 'true';

      if (isRunning === expectedRunning) {
        return true;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      // Container might not exist
      return false;
    }
  }

  return false;
}

// Get current GPU mode
async function getCurrentMode(): Promise<GPUMode> {
  try {
    const { stdout } = await execAsync('docker ps --format "{{.Names}}"');
    const runningContainers = new Set(stdout.trim().split('\n').filter(Boolean));

    const comfyuiRunning = runningContainers.has('chanceapp-comfyui');
    const ollamaRunning = runningContainers.has('chanceapp-ollama');
    const embeddingsRunning = runningContainers.has('chanceapp-embeddings');

    if (comfyuiRunning && !ollamaRunning && !embeddingsRunning) {
      return 'training';
    } else if (!comfyuiRunning && !ollamaRunning && !embeddingsRunning) {
      return 'gaming';
    }
    return 'bella';
  } catch (error) {
    console.error('Error detecting current mode:', error);
    return 'bella';
  }
}

// Switch GPU mode with rollback capability
async function switchMode(mode: GPUMode): Promise<{
  success: boolean;
  message: string;
  warnings?: string[];
}> {
  const config = GPU_MODES[mode];

  if (!config) {
    return { success: false, message: 'Invalid mode' };
  }

  // Pre-flight checks
  const preCheck = await preFlightChecks(mode);
  if (!preCheck.ok) {
    return {
      success: false,
      message: `Pre-flight checks failed: ${preCheck.issues.join(', ')}`
    };
  }

  // Store current state for rollback
  const previousMode = await getCurrentMode();
  const warnings: string[] = [];

  try {
    // Stop containers
    console.log(`Stopping containers: ${config.containers.stop.join(', ')}`);
    for (const container of config.containers.stop) {
      try {
        await dockerCommandWithRetry('stop', container);

        // Verify stopped
        const stopped = await verifyContainerState(container, false, 15000);
        if (!stopped) {
          warnings.push(`${container} may not have stopped properly`);
        }
      } catch (error: any) {
        warnings.push(`Failed to stop ${container}: ${error.message}`);
      }
    }

    // Wait for GPU to be released
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Start containers
    console.log(`Starting containers: ${config.containers.start.join(', ')}`);
    for (const container of config.containers.start) {
      try {
        await dockerCommandWithRetry('start', container);

        // Verify started
        const started = await verifyContainerState(container, true, 30000);
        if (!started) {
          warnings.push(`${container} may not have started properly`);
        }

        // Verify GPU access after starting
        const hasGPU = await validateGPUAccess(container);
        if (!hasGPU) {
          warnings.push(`${container} started but GPU access not confirmed`);
        }
      } catch (error: any) {
        // Critical failure - attempt rollback
        console.error(`Critical failure starting ${container}:`, error);
        await rollbackToMode(previousMode);
        return {
          success: false,
          message: `Failed to start ${container}, rolled back to ${GPU_MODES[previousMode].name}`
        };
      }
    }

    // Start monitor for training mode
    if (mode === 'training') {
      exec('nohup /home/rafael/gpu-mode-monitor.sh > /dev/null 2>&1 &', (error) => {
        if (error) {
          console.error('Failed to start GPU mode monitor:', error);
          warnings.push('Auto-switch monitor failed to start');
        } else {
          console.log('GPU mode monitor started for training mode');
        }
      });
    }

    // Apply performance optimizations for gaming mode
    if (mode === 'gaming') {
      console.log('Applying gaming performance optimizations...');
      exec('/home/rafael/gaming-optimize.sh', (error, stdout, stderr) => {
        if (error) {
          console.error('Failed to apply gaming optimizations:', error);
          warnings.push('Gaming optimizations failed to apply');
        } else {
          console.log('Gaming optimizations applied successfully');
        }
      });
    }

    // Restore normal settings when exiting gaming mode
    if (mode === 'bella' && previousMode === 'gaming') {
      console.log('Restoring normal performance settings...');
      exec('/home/rafael/gaming-restore.sh', (error, stdout, stderr) => {
        if (error) {
          console.error('Failed to restore normal settings:', error);
        } else {
          console.log('Normal performance settings restored');
        }
      });
    }

    // Final verification
    const newMode = await getCurrentMode();
    if (newMode !== mode) {
      warnings.push(`Mode verification mismatch: expected ${mode}, got ${newMode}`);
    }

    return {
      success: true,
      message: `Switched to ${config.name}${mode === 'training' ? ' (auto-switch enabled)' : ''}`,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  } catch (error: any) {
    // Attempt rollback on critical failure
    console.error('Critical error during mode switch:', error);
    await rollbackToMode(previousMode);
    return {
      success: false,
      message: `Failed to switch mode: ${error.message}. Rolled back to ${GPU_MODES[previousMode].name}`
    };
  }
}

// Rollback to a previous mode
async function rollbackToMode(mode: GPUMode): Promise<void> {
  console.log(`Rolling back to ${mode} mode...`);
  const config = GPU_MODES[mode];

  // Best effort rollback - don't throw errors
  for (const container of config.containers.stop) {
    try {
      await dockerCommandWithRetry('stop', container, 2);
    } catch (error) {
      console.error(`Rollback: Failed to stop ${container}`, error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  for (const container of config.containers.start) {
    try {
      await dockerCommandWithRetry('start', container, 2);
    } catch (error) {
      console.error(`Rollback: Failed to start ${container}`, error);
    }
  }
}

// Check if ComfyUI training is complete
async function checkTrainingStatus(): Promise<{
  isTraining: boolean;
  queueSize: number;
  gpuMemory?: string;
}> {
  try {
    const { stdout } = await execAsync('docker ps --filter "name=chanceapp-comfyui" --format "{{.Names}}"');
    if (!stdout.trim()) {
      return { isTraining: false, queueSize: 0 };
    }

    // Get GPU memory usage
    try {
      const { stdout: gpuOut } = await execAsync(
        'nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits'
      );
      const gpuMemory = `${gpuOut.trim()} MB`;
      return { isTraining: true, queueSize: 0, gpuMemory };
    } catch {
      return { isTraining: true, queueSize: 0 };
    }
  } catch (error) {
    return { isTraining: false, queueSize: 0 };
  }
}

// GET - Get current mode and status
export async function GET(request: NextRequest) {
  try {
    const currentMode = await getCurrentMode();
    const trainingStatus = await checkTrainingStatus();

    // Get detailed container states
    const allContainers = [
      'chanceapp-comfyui',
      'chanceapp-ollama',
      'chanceapp-embeddings',
      'chanceapp-qwen2-vl',
      'chanceapp-bark-tts',
      'plex'
    ];

    const containerStates: Record<string, ContainerState> = {};
    for (const container of allContainers) {
      containerStates[container] = await getContainerState(container);
    }

    // Check for any GPU access issues
    const gpuIssues = Object.values(containerStates)
      .filter(state => state.running && !state.hasGPU)
      .map(state => state.name);

    return NextResponse.json({
      currentMode,
      modes: GPU_MODES,
      trainingStatus,
      containerStates,
      health: {
        gpuAccessible: gpuIssues.length === 0,
        issues: gpuIssues.length > 0 ? [`Containers missing GPU: ${gpuIssues.join(', ')}`] : []
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST - Switch GPU mode
export async function POST(request: NextRequest) {
  try {
    const { mode } = await request.json();

    if (!mode || !GPU_MODES[mode as GPUMode]) {
      return NextResponse.json(
        { error: 'Invalid mode specified' },
        { status: 400 }
      );
    }

    const result = await switchMode(mode as GPUMode);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        warnings: result.warnings,
        newMode: mode
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Force fix GPU access for a container
export async function PUT(request: NextRequest) {
  try {
    const { container } = await request.json();

    if (!container) {
      return NextResponse.json(
        { error: 'Container name required' },
        { status: 400 }
      );
    }

    // Restart container to restore GPU access
    await dockerCommandWithRetry('restart', container);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const hasGPU = await validateGPUAccess(container);

    return NextResponse.json({
      success: hasGPU,
      message: hasGPU
        ? `${container} restarted with GPU access`
        : `${container} restarted but GPU access not confirmed`
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
