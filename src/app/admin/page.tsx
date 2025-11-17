"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndex() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();

        if (data.authenticated) {
          // Authenticated - go to admin panel
          router.push("/admin/vibe");
        } else {
          // Not authenticated - go to login
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      }
    }

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🔄</div>
        <p className="text-white text-xl">Redirecting...</p>
      </div>
    </div>
  );
}
