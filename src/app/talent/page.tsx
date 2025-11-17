"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Navbar,
  Footer,
  CustomCursor,
  ScrollProgress,
  AnimatedGradient,
  GridBackground,
  PageTransition,
  TiltCard,
} from "../../components";

// Lazy load heavy interactive components
const ParticleField = dynamic(() => import("../../components/ParticleField"), {
  ssr: false,
  loading: () => null,
});

const InteractiveTerminal = dynamic(() => import("../../components/InteractiveTerminal").then(mod => ({ default: mod.InteractiveTerminal })), {
  ssr: false,
  loading: () => null,
});

const LiveMetricsDashboard = dynamic(() => import("../../components/LiveMetricsDashboard").then(mod => ({ default: mod.LiveMetricsDashboard })), {
  ssr: false,
  loading: () => null,
});

const SkillConstellation = dynamic(() => import("../../components/SkillConstellation").then(mod => ({ default: mod.SkillConstellation })), {
  ssr: false,
  loading: () => null,
});

const InteractiveTimeline = dynamic(() => import("../../components/InteractiveTimeline").then(mod => ({ default: mod.InteractiveTimeline })), {
  ssr: false,
  loading: () => null,
});

// Stats that will animate on scroll
const impactStats = [
  { label: "Production Apps", value: 15, suffix: "+", icon: "🚀" },
  { label: "Docker Containers", value: 25, suffix: "+", icon: "🐳" },
  { label: "Uptime", value: 99.9, suffix: "%", icon: "⚡" },
  { label: "API Requests/Day", value: 50000, suffix: "+", icon: "📡" },
];

// Real impressive technical achievements
const achievements = [
  {
    title: "Home Server Infrastructure",
    description: "Built and maintained a production-grade home server with RAID 1, automated backups, monitoring, and 20+ self-hosted services using Docker, Traefik, and Cloudflare.",
    tech: ["Docker", "Traefik", "Linux", "RAID"],
    metric: "99.9% uptime",
    icon: "🖥️",
  },
  {
    title: "Full-Stack Case Management System",
    description: "Architected and deployed a comprehensive divorce case management platform with CI/CD, automated deployments, and real-time analytics.",
    tech: ["Next.js", "PostgreSQL", "GitHub Actions", "Docker"],
    metric: "Production-ready",
    icon: "⚖️",
  },
  {
    title: "Zero-Downtime Deployments",
    description: "Implemented automated container updates with Watchtower, health monitoring with Uptime Kuma, and automated maintenance scripts running on cron.",
    tech: ["Watchtower", "Bash", "Cron", "Monitoring"],
    metric: "Fully automated",
    icon: "🔄",
  },
  {
    title: "Secure Remote Access",
    description: "Configured Cloudflare Tunnels for secure SSH access, reverse proxy with automatic HTTPS, and integrated CrowdSec for security.",
    tech: ["Cloudflare", "SSL/TLS", "Security", "Networking"],
    metric: "Enterprise-grade",
    icon: "🔐",
  },
  {
    title: "Performance Optimization",
    description: "Optimized Next.js applications with code splitting, image optimization, and achieved 95+ Lighthouse scores across all metrics.",
    tech: ["Next.js", "Web Vitals", "SEO", "Performance"],
    metric: "95+ Lighthouse",
    icon: "⚡",
  },
  {
    title: "Multi-CMS Integration",
    description: "Built dynamic websites with WordPress, Sanity CMS, and custom headless solutions, implementing RESTful APIs and GraphQL endpoints.",
    tech: ["WordPress", "Sanity", "REST", "GraphQL"],
    metric: "5+ CMS platforms",
    icon: "📝",
  },
];

// Technology mastery data
const techMastery = [
  { name: "Docker & Containerization", level: 95, projects: 10 },
  { name: "Next.js & React", level: 95, projects: 15 },
  { name: "Server Administration", level: 90, projects: 8 },
  { name: "CI/CD Pipelines", level: 90, projects: 12 },
  { name: "Database Design", level: 85, projects: 10 },
  { name: "Security & Networking", level: 85, projects: 8 },
];

// Live code example that showcases skills
const codeExample = `// Real production code from home server automation
const healthCheck = async () => {
  const metrics = await Promise.all([
    checkDiskUsage(),
    checkDockerContainers(),
    checkRAIDStatus(),
    monitorDriveHealth(),
  ]);

  if (metrics.some(m => m.status === 'critical')) {
    await sendAlert(metrics);
  }

  return generateReport(metrics);
};`;

const Talent = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const achievementsRef = useRef(null);
  const techRef = useRef(null);
  const codeRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const isAchievementsInView = useInView(achievementsRef, { once: true, margin: "-100px" });
  const isTechInView = useInView(techRef, { once: true, margin: "-100px" });
  const isCodeInView = useInView(codeRef, { once: true, margin: "-100px" });

  const [animatedStats, setAnimatedStats] = useState(
    impactStats.map(() => 0)
  );

  // Animate numbers when in view
  useEffect(() => {
    if (isStatsInView) {
      impactStats.forEach((stat, index) => {
        const duration = 2000;
        const steps = 60;
        const increment = stat.value / steps;
        let current = 0;

        const interval = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(interval);
          }
          setAnimatedStats((prev) => {
            const newStats = [...prev];
            newStats[index] = current;
            return newStats;
          });
        }, duration / steps);
      });
    }
  }, [isStatsInView]);

  return (
    <>
      <PageTransition />
      <CustomCursor />
      <ScrollProgress />
      <AnimatedGradient />
      <ParticleField />
      <GridBackground />
      <main className="min-h-screen relative">
        <Navbar />

        {/* Hero Section */}
        <section className="section pt-32" ref={heroRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isHeroInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-6xl mb-6"
              >
                💎
              </motion.div>
              <h1 className="text-display font-bold text-white mb-6">
                Beyond the Resume
              </h1>
              <p className="text-xl text-light-100 mb-8 text-balance">
                Where code meets infrastructure, automation meets creativity, and passion meets production.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block px-6 py-3 bg-accent/20 border border-accent/50 rounded-full text-accent font-medium"
              >
                Real projects. Real impact. Real expertise.
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="section" ref={statsRef}>
          <div className="container-custom relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {impactStats.map((stat, index) => (
                <TiltCard key={stat.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isStatsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card-glass p-6 text-center"
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.value >= 1000
                        ? Math.floor(animatedStats[index]).toLocaleString()
                        : animatedStats[index].toFixed(stat.value % 1 !== 0 ? 1 : 0)}
                      {stat.suffix}
                    </div>
                    <div className="text-sm text-light-100">{stat.label}</div>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Grid */}
        <section className="section" ref={achievementsRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isAchievementsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-light-100 font-medium mb-4">
                Real-World Impact
              </span>
              <h2 className="text-display font-bold text-white mb-4">
                Technical Achievements
              </h2>
              <p className="text-lg text-light-100 max-w-3xl mx-auto">
                Production systems, live infrastructure, and real solutions powering actual businesses.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {achievements.map((achievement, index) => (
                <TiltCard key={achievement.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isAchievementsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card-glass p-6 h-full flex flex-col"
                  >
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-light-100 mb-4 flex-grow">
                      {achievement.description}
                    </p>
                    <div className="mb-4">
                      <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/50 rounded-full text-accent text-xs font-medium">
                        {achievement.metric}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {achievement.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-white/5 text-light-100 rounded border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Mastery */}
        <section className="section" ref={techRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isTechInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-light-100 font-medium mb-4">
                Expertise Level
              </span>
              <h2 className="text-display font-bold text-white mb-4">
                Technology Mastery
              </h2>
              <p className="text-lg text-light-100 max-w-3xl mx-auto">
                Proven expertise across the full stack and beyond.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {techMastery.map((tech, index) => (
                <TiltCard key={tech.name}>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={isTechInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card-glass p-6"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-white">{tech.name}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-light-100">
                          {tech.projects} projects
                        </span>
                        <span className="text-accent font-bold">{tech.level}%</span>
                      </div>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isTechInView ? { width: `${tech.level}%` } : { width: 0 }}
                        transition={{
                          duration: 1.5,
                          delay: index * 0.1 + 0.3,
                          ease: "easeOut",
                        }}
                        className="h-full bg-gradient-to-r from-accent via-accent to-accent-dark rounded-full"
                      />
                    </div>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Code Showcase */}
        <section className="section" ref={codeRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isCodeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-light-100 font-medium mb-4">
                Code Quality
              </span>
              <h2 className="text-display font-bold text-white mb-4">
                Clean, Production-Ready Code
              </h2>
              <p className="text-lg text-light-100 max-w-3xl mx-auto">
                Real code from production systems, not tutorial examples.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <TiltCard>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isCodeInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="card-glass overflow-hidden"
                >
                  <div className="bg-dark-200/50 px-6 py-3 border-b border-white/10 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-sm text-light-100">health-check.sh</span>
                  </div>
                  <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
                    <code className="text-light-100 font-mono">
                      {codeExample}
                    </code>
                  </pre>
                  <div className="bg-dark-200/50 px-6 py-3 border-t border-white/10 flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-xs font-medium">
                      ✓ Production Tested
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-blue-400 text-xs font-medium">
                      ✓ Error Handling
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-purple-400 text-xs font-medium">
                      ✓ Async/Await
                    </span>
                    <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded text-orange-400 text-xs font-medium">
                      ✓ Monitoring
                    </span>
                  </div>
                </motion.div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Interactive Terminal Section */}
        <section className="section">
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-light-100 font-medium mb-4">
                Live Systems
              </span>
              <h2 className="text-display font-bold text-white mb-4">
                Production Server in Action
              </h2>
              <p className="text-lg text-light-100 max-w-3xl mx-auto">
                Watch real commands execute on a live production server with 99.9% uptime.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <InteractiveTerminal />
            </motion.div>
          </div>
        </section>

        {/* Live Metrics Dashboard */}
        <section className="section">
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-light-100 font-medium mb-4">
                Real-Time Monitoring
              </span>
              <h2 className="text-display font-bold text-white mb-4">
                Live Infrastructure Metrics
              </h2>
              <p className="text-lg text-light-100 max-w-3xl mx-auto">
                Real-time monitoring dashboard showing live metrics from production infrastructure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <LiveMetricsDashboard />
            </motion.div>
          </div>
        </section>

        {/* Skill Constellation */}
        <section className="section">
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-light-100 font-medium mb-4">
                Technology Network
              </span>
              <h2 className="text-display font-bold text-white mb-4">
                Interactive Skill Constellation
              </h2>
              <p className="text-lg text-light-100 max-w-3xl mx-auto">
                Explore the interconnected web of technologies and how they work together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <SkillConstellation />
            </motion.div>
          </div>
        </section>

        {/* Project Timeline */}
        <section className="section">
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-light-100 font-medium mb-4">
                Journey
              </span>
              <h2 className="text-display font-bold text-white mb-4">
                Evolution of Excellence
              </h2>
              <p className="text-lg text-light-100 max-w-3xl mx-auto">
                A timeline of continuous growth, learning, and building impressive solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <InteractiveTimeline />
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section">
          <div className="container-custom relative z-20">
            <TiltCard>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card-glass p-12 text-center max-w-4xl mx-auto"
              >
                <h2 className="text-4xl font-bold text-white mb-4">
                  Ready to Build Something Amazing?
                </h2>
                <p className="text-lg text-light-100 mb-8">
                  From infrastructure to interfaces, let's create production-ready solutions.
                </p>
                <a
                  href="/#contact"
                  className="btn-primary inline-block"
                >
                  Get In Touch
                </a>
              </motion.div>
            </TiltCard>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Talent;
