import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bella 2.0 | The Ultimate Self-Hosted AI Companion",
  description:
    "Meet Bella 2.0 - A superpowered AI companion with 7 GPU-accelerated services, advanced cognitive systems, complete smart home control, and genuine emotional intelligence. 9.8/10 stack quality, 100% self-hosted, zero monthly fees.",
  openGraph: {
    title: "Bella 2.0 | Superpowered AI Companion by Rafael Cardoso",
    description:
      "The ultimate self-hosted AI companion featuring Flux.1 Dev image generation, Qwen2-VL vision, emotional voice, semantic memory, and autonomous decision-making. Complete privacy, state-of-the-art models.",
  },
};

export default function BellaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
