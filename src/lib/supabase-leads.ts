import type { CorreoCaptacion } from "@/lib/brevo";

type Lead = {
  email: string;
  resource: string;
  angulo: "A" | "B" | "C";
  source: string;
};

export type LeadSecuencia = {
  email: string;
  created_at: string;
  correo_1_at: string | null;
  correo_2_at: string | null;
  correo_3_at: string | null;
  correo_4_at: string | null;
};

const COLUMNA_CORREO: Record<CorreoCaptacion, keyof LeadSecuencia> = {
  1: "correo_1_at",
  2: "correo_2_at",
  3: "correo_3_at",
  4: "correo_4_at",
};

function credenciales() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function supabaseLeadsDisponible() {
  return credenciales() !== null;
}

export async function guardarLead(lead: Lead) {
  const creds = credenciales();
  if (!creds) {
    throw new Error("Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY");
  }

  const ahora = new Date().toISOString();
  const respuesta = await fetch(
    `${creds.url}/rest/v1/gpedrosa_leads?on_conflict=email`,
    {
      method: "POST",
      headers: {
        apikey: creds.key,
        Authorization: `Bearer ${creds.key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        email: lead.email,
        resource: lead.resource,
        angulo: lead.angulo,
        source: lead.source,
        updated_at: ahora,
      }),
      cache: "no-store",
    }
  );

  if (!respuesta.ok) {
    const crudo = await respuesta.text();
    throw new Error(`Supabase respondió ${respuesta.status}: ${crudo.slice(0, 280)}`);
  }
}

async function supabaseFetch(path: string, init: RequestInit) {
  const creds = credenciales();
  if (!creds) {
    throw new Error("Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY");
  }
  const respuesta = await fetch(`${creds.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: creds.key,
      Authorization: `Bearer ${creds.key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  if (!respuesta.ok) {
    const crudo = await respuesta.text();
    throw new Error(`Supabase respondió ${respuesta.status}: ${crudo.slice(0, 280)}`);
  }
  return respuesta;
}

export async function listarLeadsSecuencia(): Promise<LeadSecuencia[]> {
  const respuesta = await supabaseFetch(
    "gpedrosa_leads?select=email,created_at,correo_1_at,correo_2_at,correo_3_at,correo_4_at&order=created_at.asc",
    { method: "GET" }
  );
  return (await respuesta.json()) as LeadSecuencia[];
}

export async function marcarCorreoLead(email: string, paso: CorreoCaptacion) {
  const columna = COLUMNA_CORREO[paso];
  const destino = encodeURIComponent(email.trim().toLowerCase());
  await supabaseFetch(`gpedrosa_leads?email=eq.${destino}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      [columna]: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
}
