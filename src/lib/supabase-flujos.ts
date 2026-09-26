import type { PiezaEnlace, PiezaNodo, TipoNodo } from "./esquema-types";

export type NodoGuardado = PiezaNodo & { cuerpo: string };

export type EsquemaGuardado = {
  nodos: NodoGuardado[];
  enlaces: PiezaEnlace[];
};

export type FlujoResumen = {
  id: string;
  titulo: string;
  updated_at: string;
};

type Fila = FlujoResumen & {
  texto: string;
  esquema: EsquemaGuardado;
};

const VACIO: EsquemaGuardado = { nodos: [], enlaces: [] };

function credenciales() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url, key };
}

async function rest<T>(ruta: string, init?: RequestInit): Promise<T> {
  const { url, key } = credenciales();
  const respuesta = await fetch(`${url}/rest/v1/${ruta}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const crudo = await respuesta.text();
  if (!respuesta.ok) {
    throw new Error(`Supabase respondió ${respuesta.status}: ${crudo.slice(0, 280)}`);
  }
  if (!crudo) return undefined as T;
  return JSON.parse(crudo) as T;
}

function normalizar(esquema: EsquemaGuardado | null | undefined): EsquemaGuardado {
  return {
    nodos: (esquema?.nodos ?? []).map((nodo) => ({
      ...nodo,
      cuerpo: nodo.cuerpo ?? "",
      tipo: nodo.tipo === "criterio" ? "criterio" : "flujo",
    })),
    enlaces: esquema?.enlaces ?? [],
  };
}

export async function listarFlujos(): Promise<FlujoResumen[]> {
  return rest<FlujoResumen[]>(
    "gpedrosa_flujos?select=id,titulo,updated_at&order=updated_at.desc"
  );
}

export async function obtenerFlujo(id: string): Promise<Fila | null> {
  const filas = await rest<Fila[]>(
    `gpedrosa_flujos?id=eq.${encodeURIComponent(id)}&select=id,titulo,texto,esquema,updated_at`
  );
  const fila = filas[0];
  if (!fila) return null;
  return { ...fila, esquema: normalizar(fila.esquema) };
}

export async function guardarFlujo(
  id: string,
  esquema: EsquemaGuardado,
  texto: string
) {
  await rest(
    `gpedrosa_flujos?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        esquema,
        texto,
        updated_at: new Date().toISOString(),
      }),
    }
  );
}

export async function renombrarFlujo(id: string, titulo: string) {
  await rest(`gpedrosa_flujos?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      titulo,
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function eliminarFlujo(id: string) {
  const fila = await obtenerFlujo(id);
  if (!fila) return false;
  await rest(`gpedrosa_flujos?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  return true;
}

export async function insertarFlujo(id: string, titulo: string, texto = "") {
  await rest("gpedrosa_flujos", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id,
      titulo,
      texto,
      esquema: VACIO,
    }),
  });
}

