import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const BLOG_FILE = path.join(process.cwd(), 'src/data/bella-blog.json');

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  isPublished: boolean;
}

interface BlogData {
  posts: BlogPost[];
}

// GET /api/bella/blog - Fetch all posts (or filter by published)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';

    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    const blogData: BlogData = JSON.parse(data);

    let posts = blogData.posts;

    // Filter by published status if requested
    if (publishedOnly) {
      posts = posts.filter(post => post.isPublished);
    }

    // Sort by published date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST /api/bella/blog - Create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin session
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || sessionCookie.value.length !== 64) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newPost = await request.json();

    // Validate required fields
    if (!newPost.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!newPost.content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Read existing posts
    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    const blogData: BlogData = JSON.parse(data);

    // Generate slug from title if not provided
    if (!newPost.slug) {
      newPost.slug = newPost.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if slug already exists
    if (blogData.posts.some(p => p.slug === newPost.slug)) {
      newPost.slug = `${newPost.slug}-${Date.now()}`;
    }

    // Generate ID
    const maxId = blogData.posts.reduce((max, post) =>
      Math.max(max, parseInt(post.id) || 0), 0);
    newPost.id = String(maxId + 1);

    // Set timestamps
    const now = new Date().toISOString();
    newPost.publishedAt = now;
    newPost.updatedAt = now;

    // Add post
    blogData.posts.push(newPost);

    // Write back to file
    await fs.writeFile(BLOG_FILE, JSON.stringify(blogData, null, 2));

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({
      error: 'Failed to create post',
      details: error.message
    }, { status: 500 });
  }
}

// PUT /api/bella/blog - Update post (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check admin session
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || sessionCookie.value.length !== 64) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedPost = await request.json();

    if (!updatedPost.id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    // Read existing posts
    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    const blogData: BlogData = JSON.parse(data);

    // Find post
    const index = blogData.posts.findIndex(p => p.id === updatedPost.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update timestamp
    updatedPost.updatedAt = new Date().toISOString();

    // Update post
    blogData.posts[index] = updatedPost;

    // Write back to file
    await fs.writeFile(BLOG_FILE, JSON.stringify(blogData, null, 2));

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/bella/blog?id=123 - Delete post (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check admin session
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || sessionCookie.value.length !== 64) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    // Read existing posts
    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    const blogData: BlogData = JSON.parse(data);

    // Filter out the post
    const filteredPosts = blogData.posts.filter(p => p.id !== id);

    if (filteredPosts.length === blogData.posts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    blogData.posts = filteredPosts;

    // Write back to file
    await fs.writeFile(BLOG_FILE, JSON.stringify(blogData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
