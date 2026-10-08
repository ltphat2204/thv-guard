import { track } from "@vercel/analytics";
export const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
export function trackEvent(event: "simulation_started" | "simulation_completed" | "scenario_switched" | "approval_simulated" | "architecture_engaged" | "contact_prepared", properties?: Record<string, string>) {
  if (analyticsEnabled) track(event, properties);
}
