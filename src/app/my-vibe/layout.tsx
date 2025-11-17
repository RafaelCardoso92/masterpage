import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Vibe | Rafael Cardoso",
  description:
    "The soundtrack to my coding journey. Explore my favorite tracks that fuel creativity and productivity.",
  keywords: [
    "Music",
    "Coding Music",
    "Productivity",
    "Creative Vibes",
    "Developer Playlist",
  ],
  openGraph: {
    title: "My Vibe | Rafael Cardoso",
    description: "The soundtrack to my coding journey.",
    type: "website",
  },
};

export default function MyVibeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
