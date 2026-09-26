export type EventoSimulado = {
  t: string;
  email: string;
  angulo: "A" | "B" | "C";
  paso: "lead" | "kit";
  simulado: boolean;
};

const CLAVE = "gpedrosa-captacion-eventos";

export function leerEventos(): EventoSimulado[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as EventoSimulado[]) : [];
  } catch {
    return [];
  }
}

export function guardarEventos(eventos: EventoSimulado[]) {
  window.localStorage.setItem(CLAVE, JSON.stringify(eventos));
}
