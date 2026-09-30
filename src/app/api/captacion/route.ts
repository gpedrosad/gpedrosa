import { NextResponse } from "next/server";
import { enviarLeadMeta } from "@/lib/meta-capi";
import { guardarLead, supabaseLeadsDisponible } from "@/lib/supabase-leads";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Cuerpo = {
  email?: unknown;
  website?: unknown;
  resource?: unknown;
  angulo?: unknown;
  event_id?: unknown;
  simular?: unknown;
};

async function leerCuerpo(request: Request): Promise<{ datos: Cuerpo; viaFormulario: boolean }> {
  const tipo = request.headers.get("content-type") || "";
  if (tipo.includes("application/json")) {
    return { datos: await request.json(), viaFormulario: false };
  }
  if (tipo.includes("application/x-www-form-urlencoded") || tipo.includes("multipart/form-data")) {
    const form = await request.formData();
    return {
      datos: {
        email: form.get("email"),
        website: form.get("website"),
        resource: form.get("resource"),
        angulo: form.get("angulo"),
        event_id: form.get("event_id"),
        simular: form.get("simular") === "true",
      },
      viaFormulario: true,
    };
  }
  return { datos: await request.json(), viaFormulario: false };
}

function responder(
  request: Request,
  viaFormulario: boolean,
  cuerpo: { ok?: boolean; simulado?: boolean; event_id?: string; message?: string },
  status: number
) {
  if (viaFormulario) {
    if (status >= 200 && status < 300) {
      return NextResponse.redirect(new URL("/captacion/gracias", request.url), 303);
    }
    return new NextResponse(cuerpo.message || "No pudimos enviar la guía.", {
      status,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return NextResponse.json(cuerpo, { status });
}

export async function POST(request: Request) {
  let datos: Cuerpo;
  let viaFormulario = false;
  try {
    const leido = await leerCuerpo(request);
    datos = leido.datos;
    viaFormulario = leido.viaFormulario;
  } catch {
    return NextResponse.json({ message: "Los datos enviados no son válidos." }, { status: 400 });
  }

  if (typeof datos.website === "string" && datos.website.length > 0) {
    return responder(request, viaFormulario, { ok: true }, 200);
  }

  const email = typeof datos.email === "string" ? datos.email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return responder(request, viaFormulario, { message: "Ingresa un email válido." }, 400);
  }

  const resource =
    typeof datos.resource === "string" && datos.resource.trim()
      ? datos.resource.trim().slice(0, 64)
      : "7-decisiones";
  const angulo = datos.angulo === "B" || datos.angulo === "C" ? datos.angulo : "A";
  const eventId =
    typeof datos.event_id === "string" && datos.event_id.trim()
      ? datos.event_id.trim().slice(0, 80)
      : `lead-${Date.now()}`;

  if (datos.simular === true) {
    return responder(request, viaFormulario, { ok: true, simulado: true }, 200);
  }

  if (!supabaseLeadsDisponible()) {
    return responder(request, viaFormulario, { ok: true, simulado: true }, 200);
  }

  try {
    await guardarLead({
      email,
      resource,
      angulo,
      source: "landing-captacion",
    });
    try {
      await enviarLeadMeta({ request, email, eventId });
    } catch (error) {
      console.error("captacion meta capi error", error);
    }
    return responder(request, viaFormulario, { ok: true, event_id: eventId }, 200);
  } catch (error) {
    console.error("captacion supabase error", error);
    return responder(
      request,
      viaFormulario,
      { message: "No pudimos enviar la guía. Intenta de nuevo en unos minutos." },
      502
    );
  }
}
