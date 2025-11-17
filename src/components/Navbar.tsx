"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MagneticButton from "./MagneticButton";

const navLinks = [
  { name: "Work", href: "/#work" },
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Talent", href: "/talent" },
  { name: "My Vibe", href: "/my-vibe" },
  { name: "Bella", href: "/bella" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-dark/60 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
        }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="relative z-50">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold"
            >
              <span className="text-white">Rafael</span>
              <span className="text-accent">.</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <MagneticButton>
                  {link.name === "Bella" ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 text-sm font-medium rounded-full hover:bg-white/5 transition-colors"
                    >
                      <motion.span
                        animate={{
                          textShadow: [
                            "0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(236, 72, 153, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)",
                            "0 0 25px rgba(139, 92, 246, 0.8), 0 0 50px rgba(168, 85, 247, 0.6), 0 0 70px rgba(236, 72, 153, 0.4)",
                            "0 0 20px rgba(236, 72, 153, 0.8), 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)",
                            "0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(236, 72, 153, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)",
                          ],
                          color: [
                            "#a855f7",
                            "#ec4899",
                            "#8b5cf6",
                            "#a855f7",
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="font-semibold"
                      >
                        {link.name}
                      </motion.span>
                    </motion.div>
                  ) : link.name === "My Vibe" ? (
                    <div className="relative">
                      <motion.div
                        animate={{
                          opacity: [0.4, 0.8, 0.4],
                          scale: [1, 1.15, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -inset-2 bg-gradient-to-r from-accent via-purple-500 to-blue-500 rounded-full blur-lg"
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative px-5 py-2 text-sm font-medium text-white rounded-full overflow-hidden group"
                      >
                        <motion.div
                          animate={{
                            background: [
                              "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
                              "linear-gradient(135deg, #3a86ff 0%, #ff006e 50%, #8338ec 100%)",
                              "linear-gradient(135deg, #8338ec 0%, #3a86ff 50%, #ff006e 100%)",
                              "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
                            ],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                        />
                        <motion.div
                          animate={{
                            x: ["-200%", "200%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                        <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />
                        <span className="relative z-10">🎧 {link.name}</span>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 text-sm font-medium text-light-100 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                    >
                      {link.name}
                    </motion.div>
                  )}
                </MagneticButton>
              </Link>
            ))}
            <a
              href="https://www.linkedin.com/in/rafaelcardosouk/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4"
            >
              <MagneticButton>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Let's Talk
                </motion.button>
              </MagneticButton>
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white rounded-full"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-white rounded-full"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white rounded-full"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark/80 backdrop-blur-xl border-t border-white/10"
          >
            <div className="container-custom py-8 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.name === "Bella" ? (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-medium hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <motion.span
                        animate={{
                          textShadow: [
                            "0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(236, 72, 153, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)",
                            "0 0 25px rgba(139, 92, 246, 0.8), 0 0 50px rgba(168, 85, 247, 0.6), 0 0 70px rgba(236, 72, 153, 0.4)",
                            "0 0 20px rgba(236, 72, 153, 0.8), 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)",
                            "0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(236, 72, 153, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)",
                          ],
                          color: [
                            "#a855f7",
                            "#ec4899",
                            "#8b5cf6",
                            "#a855f7",
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="font-semibold"
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  ) : link.name === "My Vibe" ? (
                    <div className="relative">
                      <motion.div
                        animate={{
                          opacity: [0.4, 0.8, 0.4],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -inset-1 bg-gradient-to-r from-accent via-purple-500 to-blue-500 rounded-xl blur-lg"
                      />
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block relative overflow-hidden rounded-xl group"
                      >
                        <motion.div
                          animate={{
                            background: [
                              "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
                              "linear-gradient(135deg, #3a86ff 0%, #ff006e 50%, #8338ec 100%)",
                              "linear-gradient(135deg, #8338ec 0%, #3a86ff 50%, #ff006e 100%)",
                              "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
                            ],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                        />
                        <motion.div
                          animate={{
                            x: ["-200%", "200%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                        <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors" />
                        <span className="relative z-10 block px-4 py-3 text-lg font-medium text-white">
                          🎧 {link.name}
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-medium text-light-100 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-4"
              >
                <a
                  href="https://www.linkedin.com/in/rafaelcardosouk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Let's Talk
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
