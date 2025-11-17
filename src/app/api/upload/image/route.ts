import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Supported formats: JPG, PNG, GIF, WebP, HEIC, HEIF, AVIF'
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${random}.webp`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`Processing image: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Optimize image with sharp
    let optimizedBuffer: Buffer;
    try {
      optimizedBuffer = await sharp(buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer();

      console.log(`Image optimized: ${optimizedBuffer.length} bytes (${((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(2)}% saved)`);
    } catch (sharpError: any) {
      console.error('Sharp processing error:', sharpError);
      throw new Error(`Image processing failed: ${sharpError.message}`);
    }

    // Save to public/uploads/images
    const uploadDir = path.join(process.cwd(), 'public/uploads/images');
    const filepath = path.join(uploadDir, filename);

    console.log(`Saving to: ${filepath}`);

    try {
      await writeFile(filepath, optimizedBuffer);
      console.log(`File saved successfully: ${filename}`);
    } catch (writeError: any) {
      console.error('File write error:', writeError);
      throw new Error(`Failed to save file: ${writeError.message}`);
    }

    // Return public URL
    const url = `/uploads/images/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: optimizedBuffer.length,
      originalSize: buffer.length,
      compressionRatio: ((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(2) + '%',
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
