import { NextResponse } from "next/server";
import {
  enviarCorreoCaptacion,
  type CorreoCaptacion,
} from "@/lib/brevo";
import {
  listarLeadsSecuencia,
  marcarCorreoLead,
  supabaseLeadsDisponible,
  type LeadSecuencia,
} from "@/lib/supabase-leads";

const DIA_MS = 86_400_000;

const CUANDO: { paso: CorreoCaptacion; desdeDia: number; previo?: keyof LeadSecuencia }[] = [
  { paso: 1, desdeDia: 0 },
  { paso: 2, desdeDia: 1, previo: "correo_1_at" },
  { paso: 3, desdeDia: 3, previo: "correo_2_at" },
  { paso: 4, desdeDia: 5, previo: "correo_3_at" },
];

function autorizado(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function columna(paso: CorreoCaptacion): keyof LeadSecuencia {
  return `correo_${paso}_at`;
}

function diasDesde(fecha: string) {
  return (Date.now() - new Date(fecha).getTime()) / DIA_MS;
}

export async function GET(request: Request) {
  if (!autorizado(request)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }
  if (!supabaseLeadsDisponible()) {
    return NextResponse.json({ enviados: [] });
  }

  const leads = await listarLeadsSecuencia();
  const enviados: { email: string; paso: CorreoCaptacion }[] = [];

  for (const lead of leads) {
    const dias = diasDesde(lead.created_at);
    for (const regla of CUANDO) {
      if (lead[columna(regla.paso)]) continue;
      if (dias < regla.desdeDia) continue;
      if (regla.previo && !lead[regla.previo]) continue;
      try {
        await enviarCorreoCaptacion(regla.paso, lead.email);
        await marcarCorreoLead(lead.email, regla.paso);
        lead[columna(regla.paso)] = new Date().toISOString();
        enviados.push({ email: lead.email, paso: regla.paso });
      } catch (error) {
        console.error("captacion secuencia error", regla.paso, lead.email, error);
      }
    }
  }

  return NextResponse.json({ ok: true, enviados: enviados.length });
}