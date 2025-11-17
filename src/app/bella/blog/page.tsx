"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Navbar,
  Footer,
  CustomCursor,
  ScrollProgress,
  AnimatedGradient,
  GridBackground,
  PageTransition,
} from "../../../components";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
  isPublished: boolean;
}

export default function BellaBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/bella/blog?published=true");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <>
      <PageTransition />
      <CustomCursor />
      <ScrollProgress />
      <AnimatedGradient />
      <GridBackground />

      <main className="min-h-screen relative">
        <Navbar />

        {/* Hero */}
        <section className="section pt-32 pb-16 px-4">
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-5xl">💜</span>
                <div className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 rounded-full text-purple-200 text-sm font-bold">
                  BELLA BLOG
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                  AI Insights & Updates
                </span>
              </h1>
              <p className="text-xl text-light-100 leading-relaxed">
                Deep dives into AI companionship, self-hosted AI stacks, and the future of human-AI interaction.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Posts */}
        <section className="section px-4 pb-20">
          <div className="container-custom relative z-20">
            {loading ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4 animate-spin">💜</div>
                <p className="text-light-100 text-xl">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-light-100 text-2xl mb-2">No posts yet</p>
                <p className="text-light-100/60">Check back soon for updates!</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/bella/blog/${post.slug}`}>
                      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 group">
                        {post.coverImage && (
                          <div className="relative h-64 md:h-80 overflow-hidden">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/50 to-transparent" />
                          </div>
                        )}

                        <div className={`p-6 md:p-8 ${!post.coverImage ? 'pt-8' : ''}`}>
                          <div className="flex items-center gap-4 mb-4 text-sm text-purple-300">
                            <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
                            {post.tags && post.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex gap-2">
                                  {post.tags.slice(0, 3).map((tag) => (
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

                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                            {post.title}
                          </h2>

                          {post.excerpt && (
                            <p className="text-lg text-light-100 leading-relaxed mb-6">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">
                              Read more →
                            </span>
                            <span className="text-light-100/60">By {post.author}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
