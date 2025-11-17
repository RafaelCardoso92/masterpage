import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Serve uploaded files from the uploads directory
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');
    const fullPath = path.join(process.cwd(), 'public/uploads', filePath);

    // Security check - prevent directory traversal
    if (!fullPath.startsWith(path.join(process.cwd(), 'public/uploads'))) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Read file
    const fileBuffer = await readFile(fullPath);

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving uploaded file:', error);

    if (error.code === 'ENOENT') {
      return new NextResponse('File not found', { status: 404 });
    }

    return new NextResponse('Internal server error', { status: 500 });
  }
}
