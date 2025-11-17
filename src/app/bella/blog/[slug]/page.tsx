"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Navbar,
  Footer,
  CustomCursor,
  ScrollProgress,
  AnimatedGradient,
  GridBackground,
  PageTransition,
} from "../../../../components";

interface BlogPost {
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch("/api/bella/blog?published=true");
        const posts: BlogPost[] = await res.json();
        const foundPost = posts.find((p) => p.slug === slug);

        if (foundPost) {
          setPost(foundPost);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  // Simple markdown-to-HTML converter (basic)
  const renderMarkdown = (markdown: string) => {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-white mt-8 mb-4">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-white mt-10 mb-6">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-white mt-12 mb-6">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Code blocks
    html = html.replace(/```([^`]+)```/gim, '<pre class="bg-dark-300 border border-dark-400 rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm font-mono text-light-100">$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm font-mono">$1</code>');

    // Paragraphs (split by double newlines)
    html = html.split('\n\n').map(para => {
      if (para.startsWith('<h') || para.startsWith('<pre') || para.startsWith('<ul') || para.startsWith('<ol')) {
        return para;
      }
      return `<p class="text-lg text-light-100 leading-relaxed mb-6">${para}</p>`;
    }).join('\n');

    return html;
  };

  if (loading) {
    return (
      <>
        <PageTransition />
        <CustomCursor />
        <ScrollProgress />
        <AnimatedGradient />
        <GridBackground />

        <main className="min-h-screen relative">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-spin">💜</div>
              <p className="text-white text-xl">Loading post...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <PageTransition />
        <CustomCursor />
        <ScrollProgress />
        <AnimatedGradient />
        <GridBackground />

        <main className="min-h-screen relative">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
              <p className="text-light-100 mb-8">This post doesn't exist or has been removed.</p>
              <Link
                href="/bella/blog"
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors inline-block"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageTransition />
      <CustomCursor />
      <ScrollProgress />
      <AnimatedGradient />
      <GridBackground />

      <main className="min-h-screen relative">
        <Navbar />

        <article className="section pt-32 pb-20 px-4">
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Back Link */}
              <Link
                href="/bella/blog"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
              >
                <span>←</span>
                <span>Back to Blog</span>
              </Link>

              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative h-96 rounded-2xl overflow-hidden mb-8 border border-purple-500/20">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent" />
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6 text-sm text-purple-300">
                <time>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</time>
                <span>•</span>
                <span>By {post.author}</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                  {post.title}
                </span>
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-light-100/80 mb-12 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
              />

              {/* Footer */}
              <div className="mt-16 pt-8 border-t border-purple-500/20">
                <div className="flex items-center justify-between">
                  <Link
                    href="/bella/blog"
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    ← Back to Blog
                  </Link>
                  <div className="text-light-100/60 text-sm">
                    Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
