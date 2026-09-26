"use client";

import { useEffect } from "react";
import { captar } from "@/lib/posthog-captacion";
import { limpiarEmailsGuardados } from "./eventos";

type Props = {
  evento: "captacion_landing" | "captacion_gracias";
  angulo?: "A" | "B" | "C";
};

export default function Rastreo({ evento, angulo }: Props) {
  useEffect(() => {
    limpiarEmailsGuardados();
    captar(evento, angulo ? { angulo } : undefined);
  }, [evento, angulo]);
  return null;
}
