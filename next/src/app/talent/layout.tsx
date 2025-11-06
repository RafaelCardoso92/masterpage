import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talent & Expertise | Rafael Cardoso",
  description:
    "Discover real-world technical achievements, production systems, and proven expertise across full-stack development, DevOps, and infrastructure.",
  keywords: [
    "Full-Stack Developer",
    "DevOps",
    "Docker",
    "Server Administration",
    "Next.js",
    "React",
    "Infrastructure",
    "CI/CD",
    "Portfolio",
  ],
  openGraph: {
    title: "Talent & Expertise | Rafael Cardoso",
    description:
      "Real projects. Real impact. Real expertise in full-stack development and infrastructure.",
    type: "website",
  },
};

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
