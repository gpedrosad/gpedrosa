"use client";

import { useEffect } from "react";
import { captar } from "@/lib/posthog-captacion";

type Props = {
  evento: "captacion_landing" | "captacion_gracias";
  angulo?: "A" | "B" | "C";
};

export default function Rastreo({ evento, angulo }: Props) {
  useEffect(() => {
    captar(evento, angulo ? { angulo } : undefined);
  }, [evento, angulo]);
  return null;
}
