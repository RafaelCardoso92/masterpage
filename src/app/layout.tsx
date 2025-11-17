import type { Metadata } from "next";
import "../styles/globals.css";
import { StructuredData, Analytics } from "../components";

export const metadata: Metadata = {
  metadataBase: new URL("https://rafaelcardoso.dev"),
  title: {
    default: "Rafael Cardoso | Full-Stack Developer & UI/UX Specialist",
    template: "%s | Rafael Cardoso",
  },
  description:
    "Award-winning full-stack developer crafting exceptional digital experiences. Specializing in React, Next.js, TypeScript, and modern web technologies. Building fast, accessible, and beautiful applications.",
  keywords: [
    "Rafael Cardoso",
    "Full-Stack Developer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Expert",
    "JavaScript",
    "Web Development",
    "UI/UX Design",
    "Performance Optimization",
    "SEO Expert",
    "WordPress",
    "Drupal",
    "Modern Web Apps",
  ],
  authors: [{ name: "Rafael Cardoso", url: "https://rafaelcardoso.dev" }],
  creator: "Rafael Cardoso",
  publisher: "Rafael Cardoso",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rafaelcardoso.dev",
    siteName: "Rafael Cardoso Portfolio",
    title: "Rafael Cardoso | Full-Stack Developer & UI/UX Specialist",
    description:
      "Award-winning full-stack developer crafting exceptional digital experiences. Building fast, accessible, and beautiful web applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rafael Cardoso - Full-Stack Developer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafael Cardoso | Full-Stack Developer",
    description:
      "Crafting exceptional digital experiences with React, Next.js, and TypeScript.",
    images: ["/og-image.png"],
    creator: "@rafaelcardoso",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://rafaelcardoso.dev",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://stijndv.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://stijndv.com/fonts/Eudoxus-Sans.css"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#03397a" />
        <StructuredData />
      </head>
      <body className="antialiased gpu-accelerated">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
