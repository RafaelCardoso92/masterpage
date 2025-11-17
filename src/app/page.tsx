"use client";

import dynamic from "next/dynamic";
import {
  Navbar,
  Footer,
  ScrollProgress,
  AnimatedGradient,
  PageTransition,
} from "../components";
import { Hero, About, Skills, Work, Contact } from "../sections";

const MiniMusicPlayer = dynamic(() => import("../components/MiniMusicPlayer"), {
  ssr: false,
  loading: () => null,
});

const StarField = dynamic(() => import("../components/StarField"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <>
      <PageTransition />
      <ScrollProgress />
      <AnimatedGradient />
      <StarField />
      <MiniMusicPlayer />
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
