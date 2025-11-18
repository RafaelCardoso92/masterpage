import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DiskInfo {
  filesystem: string;
  size: string;
  used: string;
  available: string;
  usePercent: string;
  mountpoint: string;
}

interface SystemStats {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: string;
    used: string;
    free: string;
    usedPercent: number;
  };
  gpu: {
    name: string;
    memoryUsed: string;
    memoryTotal: string;
    memoryPercent: number;
    temperature: string;
    utilization: string;
  } | null;
  disks: DiskInfo[];
  warnings: string[];
}

// Get CPU usage
async function getCPUUsage(): Promise<{ usage: number; cores: number; model: string }> {
  try {
    // Get CPU model
    const { stdout: cpuInfo } = await execAsync("cat /proc/cpuinfo | grep 'model name' | head -1 | cut -d ':' -f2 | xargs");

    // Get number of cores
    const { stdout: coreCount } = await execAsync("nproc");

    // Get CPU usage (1 - idle percentage)
    const { stdout: cpuUsage } = await execAsync(
      "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'"
    );

    return {
      usage: parseFloat(cpuUsage.trim()) || 0,
      cores: parseInt(coreCount.trim()) || 0,
      model: cpuInfo.trim() || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting CPU usage:', error);
    return { usage: 0, cores: 0, model: 'Unknown' };
  }
}

// Get memory usage
async function getMemoryUsage(): Promise<{
  total: string;
  used: string;
  free: string;
  usedPercent: number;
}> {
  try {
    const { stdout } = await execAsync("free -h | grep Mem:");
    const parts = stdout.trim().split(/\s+/);

    const total = parts[1];
    const used = parts[2];
    const free = parts[3];

    // Get numeric values for percentage
    const { stdout: totalBytes } = await execAsync("free -b | grep Mem: | awk '{print $2}'");
    const { stdout: usedBytes } = await execAsync("free -b | grep Mem: | awk '{print $3}'");

    const usedPercent = (parseInt(usedBytes) / parseInt(totalBytes)) * 100;

    return {
      total,
      used,
      free,
      usedPercent: Math.round(usedPercent)
    };
  } catch (error) {
    console.error('Error getting memory usage:', error);
    return { total: '0', used: '0', free: '0', usedPercent: 0 };
  }
}

// Get GPU usage
async function getGPUUsage(): Promise<{
  name: string;
  memoryUsed: string;
  memoryTotal: string;
  memoryPercent: number;
  temperature: string;
  utilization: string;
} | null> {
  try {
    // Check if nvidia-smi is available
    await execAsync('which nvidia-smi');

    // Get GPU info
    const { stdout: gpuName } = await execAsync("nvidia-smi --query-gpu=name --format=csv,noheader");
    const { stdout: memUsed } = await execAsync("nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits");
    const { stdout: memTotal } = await execAsync("nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits");
    const { stdout: temp } = await execAsync("nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader");
    const { stdout: util } = await execAsync("nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits");

    const memUsedNum = parseInt(memUsed.trim());
    const memTotalNum = parseInt(memTotal.trim());
    const memoryPercent = Math.round((memUsedNum / memTotalNum) * 100);

    return {
      name: gpuName.trim(),
      memoryUsed: `${memUsedNum} MB`,
      memoryTotal: `${memTotalNum} MB`,
      memoryPercent,
      temperature: `${temp.trim()}°C`,
      utilization: `${util.trim()}%`
    };
  } catch (error) {
    // GPU not available or nvidia-smi not installed
    return null;
  }
}

// Get disk usage - reads from host filesystem
async function getDiskUsage(): Promise<DiskInfo[]> {
  try {
    // Query host filesystem mounted at /hostfs
    const { stdout } = await execAsync("df -h /hostfs /mnt/backup/root /mnt/ssd /mnt/wdssd /hostfs/boot /hostfs/boot/efi | tail -n +2");
    const lines = stdout.trim().split('\n');

    const disks: DiskInfo[] = [];
    const seen = new Set<string>(); // Track unique filesystems

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 6) {
        const filesystem = parts[0];
        const mountpoint = parts.slice(5).join(' ');

        // Skip tmpfs, devtmpfs, overlay, and duplicates
        if (filesystem.includes('tmpfs') ||
            filesystem.includes('devtmpfs') ||
            filesystem.includes('overlay') ||
            filesystem.includes('shm') ||
            seen.has(filesystem)) {
          continue;
        }

        // Normalize mountpoint display
        let displayMount = mountpoint;
        if (mountpoint === '/hostfs') {
          displayMount = '/ (System Root)';
        } else if (mountpoint.startsWith('/hostfs/')) {
          displayMount = mountpoint.replace('/hostfs', '');
        }

        seen.add(filesystem);
        disks.push({
          filesystem: parts[0],
          size: parts[1],
          used: parts[2],
          available: parts[3],
          usePercent: parts[4],
          mountpoint: displayMount
        });
      }
    }

    // Sort disks: main system first, then by mountpoint
    disks.sort((a, b) => {
      if (a.mountpoint.includes('System Root')) return -1;
      if (b.mountpoint.includes('System Root')) return 1;
      return a.mountpoint.localeCompare(b.mountpoint);
    });

    return disks;
  } catch (error) {
    console.error('Error getting disk usage:', error);
    return [];
  }
}

// Generate warnings
function generateWarnings(stats: Omit<SystemStats, 'warnings'>): string[] {
  const warnings: string[] = [];

  // CPU warnings
  if (stats.cpu.usage > 90) {
    warnings.push(`High CPU usage: ${stats.cpu.usage.toFixed(1)}%`);
  }

  // Memory warnings
  if (stats.memory.usedPercent > 90) {
    warnings.push(`High memory usage: ${stats.memory.usedPercent}%`);
  } else if (stats.memory.usedPercent > 80) {
    warnings.push(`Elevated memory usage: ${stats.memory.usedPercent}%`);
  }

  // Disk warnings
  for (const disk of stats.disks) {
    const percent = parseInt(disk.usePercent);
    if (percent > 95) {
      warnings.push(`Critical disk space on ${disk.mountpoint}: ${disk.usePercent} full`);
    } else if (percent > 85) {
      warnings.push(`Low disk space on ${disk.mountpoint}: ${disk.usePercent} full`);
    }
  }

  // GPU warnings
  if (stats.gpu) {
    if (stats.gpu.memoryPercent > 95) {
      warnings.push(`GPU memory critically high: ${stats.gpu.memoryPercent}%`);
    }

    const tempNum = parseInt(stats.gpu.temperature);
    if (tempNum > 85) {
      warnings.push(`GPU temperature high: ${stats.gpu.temperature}`);
    }
  }

  return warnings;
}

// GET - Get system statistics
export async function GET(request: NextRequest) {
  try {
    const [cpu, memory, gpu, disks] = await Promise.all([
      getCPUUsage(),
      getMemoryUsage(),
      getGPUUsage(),
      getDiskUsage()
    ]);

    const stats: Omit<SystemStats, 'warnings'> = {
      cpu,
      memory,
      gpu,
      disks
    };

    const warnings = generateWarnings(stats);

    const response: SystemStats = {
      ...stats,
      warnings
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching system stats:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
