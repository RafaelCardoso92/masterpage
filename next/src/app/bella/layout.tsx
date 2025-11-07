import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bella | AI Companion",
  description:
    "Meet Bella - Rafael's intelligent AI companion with deep smart home integration, continuous awareness, and genuine connection.",
  openGraph: {
    title: "Bella | AI Companion by Rafael Cardoso",
    description:
      "An intelligent AI companion with deep smart home integration, continuous awareness, and genuine connection.",
  },
};

export default function BellaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
