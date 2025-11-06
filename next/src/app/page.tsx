"use client";

import dynamic from "next/dynamic";
import {
  Navbar,
  Footer,
  CustomCursor,
  ScrollProgress,
  AnimatedGradient,
  GridBackground,
  PageTransition,
} from "../components";
import { Hero, About, Skills, Work, Contact } from "../sections";

// Only lazy load the heaviest component (ParticleField with canvas)
const ParticleField = dynamic(() => import("../components/ParticleField"), {
  ssr: false,
  loading: () => null,
});

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
