"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/vibe", label: "Vibe Manager", icon: "🎵" },
    { href: "/admin/homepage-music", label: "Homepage Music", icon: "🏠" },
    { href: "/admin/bella/blog", label: "Bella Blog", icon: "💜" },
    { href: "/admin/bella/chat-features", label: "Bella Features", icon: "✨" },
    { href: "/admin/webcam", label: "Webcam Monitor", icon: "📷" },
    { href: "/admin/metrics", label: "Analytics", icon: "📊" },
    { href: "/admin/gpu-mode", label: "GPU Mode", icon: "🎮" },
    { href: "/admin/system-stats", label: "System Monitor", icon: "🖥️" },
  ];

  return (
    <nav className="bg-dark-200 border-b border-dark-400 mb-8">
      <div className="container-custom px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "text-accent border-accent"
                    : "text-light-100 border-transparent hover:text-white hover:bg-dark-300"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
