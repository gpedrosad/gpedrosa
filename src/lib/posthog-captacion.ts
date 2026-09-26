"use client";

import posthog from "posthog-js";

export function captar(
  evento: string,
  props?: Record<string, string | number | boolean>
) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;
  posthog.capture(evento, props);
}
