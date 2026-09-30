type Lead = {
  email: string;
  resource: string;
  angulo: "A" | "B" | "C";
  source: string;
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
