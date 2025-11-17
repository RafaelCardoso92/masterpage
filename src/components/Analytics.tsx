"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname?.startsWith("/admin")) {
      return;
    }

    // Track page visit
    const trackVisit = async () => {
      try {
        // Get hostname to track which domain is being used
        const hostname = window.location.hostname;
        const pagePath = pathname || "/";

        // Combine hostname and path for better tracking
        const fullPage = `${hostname}${pagePath}`;

        await fetch("/api/metrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: fullPage,
            referrer: document.referrer,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
          }),
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug("Analytics tracking failed:", error);
      }
    };

    // Track after a short delay to ensure page is loaded
    const timer = setTimeout(trackVisit, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // This component renders nothing
  return null;
}
