export type EventoSimulado = {
  t: string;
  evento: string;
  angulo?: "A" | "B" | "C";
  simulado?: boolean;
};

const CLAVE = "gpedrosa-captacion-eventos";

function tieneEmail(valor: unknown) {
  if (!Array.isArray(valor)) return false;
  return valor.some((item) => item && typeof item === "object" && "email" in item);
}

export function limpiarEmailsGuardados() {
  if (typeof window === "undefined") return;
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return;
    const parsed = JSON.parse(crudo);
    if (tieneEmail(parsed)) window.localStorage.removeItem(CLAVE);
  } catch {
    window.localStorage.removeItem(CLAVE);
  }
}

export function leerEventos(): EventoSimulado[] {
  if (typeof window === "undefined") return [];
  limpiarEmailsGuardados();
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return [];
    const parsed = JSON.parse(crudo) as Array<Record<string, unknown>>;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      t: typeof item.t === "string" ? item.t : "",
      evento:
        typeof item.evento === "string"
          ? item.evento
          : item.paso === "kit"
            ? "captacion_kit"
            : "captacion_email",
      angulo: item.angulo === "A" || item.angulo === "B" || item.angulo === "C" ? item.angulo : undefined,
      simulado: Boolean(item.simulado),
    }));
  } catch {
    return [];
  }
}

export function guardarEventos(eventos: EventoSimulado[]) {
  const limpios = eventos.map(({ t, evento, angulo, simulado }) => ({
    t,
    evento,
    ...(angulo ? { angulo } : {}),
    ...(simulado ? { simulado: true } : {}),
  }));
  window.localStorage.setItem(CLAVE, JSON.stringify(limpios));
}
