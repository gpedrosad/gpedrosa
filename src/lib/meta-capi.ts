import { createHash } from "node:crypto";

const PIXEL_ID =
  process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";
const ACCESS_TOKEN =
  process.env.META_ACCESS_TOKEN ?? process.env.FACEBOOK_ACCESS_TOKEN ?? "";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v19.0";

function sha256(valor: string) {
  return createHash("sha256").update(valor).digest("hex");
}

function cookie(request: Request, nombre: string) {
  const crudo = request.headers.get("cookie");
  if (!crudo) return undefined;
  for (const parte of crudo.split(";")) {
    const [clave, ...resto] = parte.trim().split("=");
    if (clave === nombre) {
      const valor = resto.join("=").trim();
      return valor || undefined;
    }
  }
  return undefined;
}

function ipCliente(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const primera = forwarded.split(",")[0]?.trim();
    if (primera) return primera;
  }
  return request.headers.get("x-real-ip")?.trim() || undefined;
}

function urlEvento(request: Request) {
  try {
    const url = new URL(request.url);
    return `${url.origin}/captacion`;
  } catch {
    return "https://www.gpedrosa.cl/captacion";
  }
}

export function metaCapiDisponible() {
  return Boolean(PIXEL_ID && ACCESS_TOKEN);
}

export async function enviarLeadMeta(input: {
  request: Request;
  email: string;
  eventId?: string;
}) {
  if (!metaCapiDisponible()) return;

  const email = input.email.trim().toLowerCase();
  const user_data: Record<string, unknown> = {
    em: [sha256(email)],
    client_user_agent: input.request.headers.get("user-agent") || undefined,
    client_ip_address: ipCliente(input.request),
    fbp: cookie(input.request, "_fbp"),
    fbc: cookie(input.request, "_fbc"),
  };

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId || `lead-${Date.now()}`,
        action_source: "website",
        event_source_url: urlEvento(input.request),
        user_data,
        custom_data: {
          content_name: "guia-7-decisiones",
          content_category: "lead_magnet",
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;
  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const cuerpo = (await respuesta.json()) as { events_received?: number; error?: { message?: string } };
  if (!respuesta.ok || (cuerpo.events_received ?? 0) < 1) {
    throw new Error(cuerpo.error?.message || `Meta CAPI ${respuesta.status}`);
  }
}
