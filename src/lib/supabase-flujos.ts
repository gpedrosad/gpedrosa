import { promises as fs } from "fs";
import path from "path";
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

async function sembrarDesdeDisco() {
  const root = path.join(process.cwd(), "marketing");
  let mapa: { nodos?: PiezaNodo[]; enlaces?: PiezaEnlace[] } = {
    nodos: [],
    enlaces: [],
  };
  try {
    mapa = JSON.parse(await fs.readFile(path.join(root, "esquema.json"), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const nodos: NodoGuardado[] = [];
  for (const nodo of mapa.nodos ?? []) {
    let cuerpo = "";
    try {
      cuerpo = (await fs.readFile(path.join(root, nodo.archivo), "utf8")).replace(
        /\n$/,
        ""
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const tipo: TipoNodo = nodo.tipo === "criterio" ? "criterio" : "flujo";
    nodos.push({ ...nodo, tipo, cuerpo });
  }

  const esquema: EsquemaGuardado = {
    nodos,
    enlaces: mapa.enlaces ?? [],
  };
  await rest("gpedrosa_flujos", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: "esquema",
      titulo: "Esquema",
      texto: textoDe(esquema),
      esquema,
    }),
  });
}

function textoDe(esquema: EsquemaGuardado) {
  const partes = [
    "# FLUJO EN TEXTO PLANO",
    "# Editable. Conservá los marcadores, los ID y las referencias DESDE/HASTA.",
  ];
  for (const nodo of esquema.nodos.filter((item) => item.tipo !== "criterio")) {
    partes.push(
      [
        "=== PASO ===",
        `ID: ${nodo.id}`,
        `TÍTULO: ${nodo.titulo}`,
        `POSICIÓN: ${nodo.x}, ${nodo.y}`,
        "CONTENIDO:",
        nodo.cuerpo.trim(),
      ].join("\n")
    );
  }
  for (const enlace of esquema.enlaces) {
    const criterio = esquema.nodos.find((nodo) => nodo.id === enlace.criterio);
    partes.push(
      [
        "=== CONEXIÓN ===",
        `DESDE: ${enlace.desde}`,
        `HASTA: ${enlace.hasta}`,
        "CRITERIO:",
        (criterio?.cuerpo ?? "").trim(),
      ].join("\n")
    );
  }
  return `${partes.join("\n\n")}\n`;
}

let semilla: Promise<void> | null = null;

export function asegurarSemilla() {
  if (!semilla) {
    semilla = (async () => {
      const actuales = await listarFlujos();
      if (actuales.length > 0) return;
      try {
        await sembrarDesdeDisco();
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : "";
        if (!mensaje.includes("23505") && !mensaje.includes("duplicate")) {
          semilla = null;
          throw error;
        }
      }
    })();
  }
  return semilla;
}
