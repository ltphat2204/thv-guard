"use client";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { useEffect } from "react";
import { analyticsEnabled, trackEvent } from "@/lib/analytics";
export function Analytics() {
  useEffect(() => {
    if (!analyticsEnabled) return;
    const onToggle = (event: Event) => {
      if (event.target instanceof HTMLDetailsElement && event.target.classList.contains("architecture-stage") && event.target.open) trackEvent("architecture_engaged");
    };
    document.addEventListener("toggle", onToggle, true);
    return () => document.removeEventListener("toggle", onToggle, true);
  }, []);
  return analyticsEnabled ? <VercelAnalytics mode="production" /> : null;
}
