"use client";

import { Footer, Navbar } from "../components";

import {
  About,
  Explore,
  Feedback,
  GetStarted,
  Hero,
  Insights,
  WhatsNew,
} from "../sections";
export default function Home() {
  const bg = {
    backgroundColor: "rgb(3 57 122)",
  };
  return (
    <div className=" overflow-hidden" style={bg}>
      <Navbar />
      <Hero />
      <div className="relative">
        <About />
        <div className="gradient-03 z-0" />
        <Explore />
      </div>

      <div className="relative">
        <GetStarted />
        <div className="gradient-04 z-0" />
        <WhatsNew />
      </div>

      <div className="relative">
        <Insights />
        <div className="gradient-04 z-0" />
        <Feedback />
      </div>
      <Footer />
    </div>
  );
}
