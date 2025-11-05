"use client";

import {
  Navbar,
  Footer,
  CustomCursor,
  ScrollProgress,
  AnimatedGradient,
  ParticleField,
  GridBackground,
  PageTransition,
} from "../components";
import { Hero, About, Skills, Work, Contact } from "../sections";

export default function Home() {
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
        <Hero />
        <About />
        <Skills />
        <Work />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
