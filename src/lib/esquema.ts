import { AsyncLocalStorage } from "node:async_hooks";
import type {
  Enlace,
  Esquema,
  EvaluacionG,
  Nodo,
  PiezaEnlace,
} from "./esquema-types";
import {
  guardarFlujo,
  insertarFlujo,
  listarFlujos,
  obtenerFlujo,
  renombrarFlujo,
  type EsquemaGuardado,
  type NodoGuardado,
} from "./supabase-flujos";

type EsquemaArchivo = EsquemaGuardado;

const flujoPedido = new AsyncLocalStorage<string>();
const PASO = 520;
const ANCHO_FLUJO = 208;
const ALTO_FLUJO = 192;
const ANCHO_CRITERIO = 176;
const ALTO_CRITERIO = 120;

type PasoImportado = {
  id: string;
  titulo: string;
  cuerpo: string;
  x?: number;
  y?: number;
};

type ConexionImportada = {
  desde: string;
  hasta: string;
  criterio: string;
};

export function conFlujo<T>(id: string, fn: () => Promise<T>) {
  return flujoPedido.run(id, fn);
}

export async function flujos() {
  return listarFlujos();
}

async function idDeTrabajo() {
  const lista = await listarFlujos();
  if (!lista.length) throw new Error("No hay flujos");
  const pedido = flujoPedido.getStore()?.trim();
  if (!pedido) return lista[0].id;
  if (!lista.some((flujo) => flujo.id === pedido)) {
    throw new Error("No existe ese flujo");
  }
  return pedido;
}

const CAMPOS_ESQUEMA = ["anuncio", "h1", "intro", "valor", "cta"] as const;

export async function crearEsquemaSimple(
  campos: Record<string, string>,
  titulo?: string
) {
  const faltan = CAMPOS_ESQUEMA.filter((campo) => !campos[campo]?.trim());
  if (faltan.length) throw new Error(`Faltan: ${faltan.join(", ")}`);

  const nombre =
    titulo?.trim() ||
    campos.anuncio.trim().split("\n")[0].slice(0, 48) ||
    "Flujo";
  const bloques = [
    ["anuncio", "Anuncio", campos.anuncio.trim()],
    ["h1", "H1", campos.h1.trim()],
    ["intro", "Intro", campos.intro.trim()],
    ["valor", "Valor", campos.valor.trim()],
    ["cta", "CTA", campos.cta.trim()],
  ];
  const uniones = [
    ["anuncio", "h1", "El H1 continúa la promesa del anuncio."],
    ["h1", "intro", "La intro desarrolla el H1 sin cambiar de promesa."],
    ["intro", "valor", "El valor concreta lo que la intro abrió."],
    ["valor", "cta", "El CTA pide el paso que el valor ya justificó."],
  ];
  const texto = [
    ...bloques.map(([id, tituloPaso, cuerpo]) =>
      [`=== PASO ===`, `ID: ${id}`, `TÍTULO: ${tituloPaso}`, "CONTENIDO:", cuerpo].join("\n")
    ),
    ...uniones.map(([desde, hasta, criterio]) =>
      [`=== CONEXIÓN ===`, `DESDE: ${desde}`, `HASTA: ${hasta}`, "CRITERIO:", criterio].join("\n")
    ),
  ].join("\n\n");
  return crearFlujo(nombre, texto);
}

export async function editarEsquemaSimple(
  id: string,
  campos: Partial<Record<(typeof CAMPOS_ESQUEMA)[number], string>>,
  titulo?: string
) {
  const fila = await obtenerFlujo(id);
  if (!fila) throw new Error("No existe ese flujo");

  const cambios = CAMPOS_ESQUEMA.filter((campo) => Boolean(campos[campo]?.trim()));
  const nombre = titulo?.trim() ?? "";
  if (!cambios.length && !nombre) {
    throw new Error("Mandá al menos un campo: anuncio, h1, intro, valor, cta o titulo");
  }

  await conFlujo(id, async () => {
    if (!cambios.length) return;
    const mapa = await leerMapa();
    for (const campo of cambios) {
      const nodo = mapa.nodos.find((item) => item.id === campo && item.tipo !== "criterio");
      if (!nodo) throw new Error(`Este flujo no tiene el paso ${campo}`);
      nodo.cuerpo = campos[campo]!.trim();
    }
    for (const enlace of mapa.enlaces) {
      if (cambios.some((campo) => enlace.desde === campo || enlace.hasta === campo)) {
        delete enlace.evaluacion;
      }
    }
    await guardarMapa(mapa);
  });

  if (nombre) await renombrarFlujo(id, nombre);
  return { id, tocados: cambios };
}

export async function crearFlujo(titulo: string, texto?: string) {
  const nombre = titulo.trim();
  if (!nombre) throw new Error("El flujo necesita un nombre");
  const usados = new Set((await listarFlujos()).map((flujo) => flujo.id));
  const id = idLibre(slug(nombre), usados);
  await insertarFlujo(id, nombre);
  if (texto?.trim()) {
    await conFlujo(id, () => importarTextoPlano(texto, "reemplazar"));
  }
  return { id, titulo: nombre };
}

function slug(texto: string) {
  const base = texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return base || "nodo";
}

function idLibre(base: string, usados: Set<string>) {
  let id = base;
  let n = 2;
  while (usados.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

async function leerMapa(): Promise<EsquemaArchivo> {
  const fila = await obtenerFlujo(await idDeTrabajo());
  if (!fila) throw new Error("No existe ese flujo");
  return fila.esquema;
}

function aTextoPlano(mapa: EsquemaArchivo) {
  const partes = [
    "# FLUJO EN TEXTO PLANO",
    "# Editable. Conservá los marcadores, los ID y las referencias DESDE/HASTA.",
  ];
  for (const nodo of mapa.nodos.filter((item) => item.tipo !== "criterio")) {
    partes.push(
      [
        "=== PASO ===",
        `ID: ${nodo.id}`,
        `TÍTULO: ${nodo.titulo}`,
        `POSICIÓN: ${nodo.x}, ${nodo.y}`,
        "CONTENIDO:",
        (nodo.cuerpo ?? "").trim(),
      ].join("\n")
    );
  }
  for (const enlace of mapa.enlaces) {
    const criterio = mapa.nodos.find((nodo) => nodo.id === enlace.criterio);
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

async function guardarMapa(mapa: EsquemaArchivo) {
  await guardarFlujo(await idDeTrabajo(), mapa, aTextoPlano(mapa));
}

function posicionCriterio(
  desde: { x: number; y: number },
  hasta: { x: number; y: number }
) {
  const cx = (desde.x + ANCHO_FLUJO / 2 + hasta.x + ANCHO_FLUJO / 2) / 2;
  const cy = (desde.y + ALTO_FLUJO / 2 + hasta.y + ALTO_FLUJO / 2) / 2;
  return {
    x: Math.round(Math.max(16, cx - ANCHO_CRITERIO / 2)),
    y: Math.round(Math.max(16, cy - ALTO_CRITERIO / 2)),
  };
}

function usadosDe(mapa: EsquemaArchivo) {
  return new Set([
    ...mapa.nodos.map((nodo) => nodo.id),
    ...mapa.enlaces.map((enlace) => enlace.id),
  ]);
}

function bloquesTextoPlano(texto: string) {
  const patron = /^===\s*(PASO|CONEXI[ÓO]N|CRITERIO)\s*===\s*$/gim;
  const marcas = [...texto.matchAll(patron)];
  return marcas.map((marca, index) => ({
    tipo: marca[1].toUpperCase(),
    contenido: texto
      .slice(
        (marca.index ?? 0) + marca[0].length,
        marcas[index + 1]?.index ?? texto.length
      )
      .trim(),
  }));
}

function campoUnaLinea(texto: string, nombre: RegExp) {
  return texto
    .split("\n")
    .map((linea) => linea.trim())
    .find((linea) => nombre.test(linea))
    ?.replace(nombre, "")
    .trim();
}

function cuerpoDesde(texto: string, nombre: RegExp) {
  const lineas = texto.split("\n");
  const indice = lineas.findIndex((linea) => nombre.test(linea.trim()));
  return indice >= 0 ? lineas.slice(indice + 1).join("\n").trim() : "";
}

function analizarTextoPlano(texto: string) {
  const pasos: PasoImportado[] = [];
  const conexiones: ConexionImportada[] = [];

  for (const bloque of bloquesTextoPlano(texto)) {
    if (bloque.tipo === "PASO") {
      const titulo = campoUnaLinea(bloque.contenido, /^T[IÍ]TULO\s*:\s*/i);
      if (!titulo) throw new Error("Cada PASO necesita TÍTULO");
      const id = campoUnaLinea(bloque.contenido, /^ID\s*:\s*/i) || slug(titulo);
      const posicion = campoUnaLinea(bloque.contenido, /^POSICI[ÓO]N\s*:\s*/i);
      const [x, y] = (posicion || "").split(",").map((valor) => Number(valor.trim()));
      pasos.push({
        id: slug(id),
        titulo,
        cuerpo: cuerpoDesde(bloque.contenido, /^CONTENIDO\s*:\s*$/i),
        ...(Number.isFinite(x) && Number.isFinite(y) ? { x, y } : {}),
      });
      continue;
    }

    const desde = campoUnaLinea(bloque.contenido, /^DESDE\s*:\s*/i);
    const hasta = campoUnaLinea(bloque.contenido, /^HASTA\s*:\s*/i);
    if (!desde || !hasta) {
      throw new Error("Cada CONEXIÓN necesita DESDE y HASTA");
    }
    conexiones.push({
      desde: slug(desde),
      hasta: slug(hasta),
      criterio: cuerpoDesde(bloque.contenido, /^CRITERIO\s*:\s*$/i),
    });
  }

  if (!pasos.length) {
    throw new Error("No encontré bloques === PASO === en el texto");
  }
  const ids = new Set<string>();
  for (const paso of pasos) {
    if (ids.has(paso.id)) throw new Error(`El ID ${paso.id} está repetido`);
    ids.add(paso.id);
  }
  for (const conexion of conexiones) {
    if (!ids.has(conexion.desde) || !ids.has(conexion.hasta)) {
      throw new Error(
        `La conexión ${conexion.desde} → ${conexion.hasta} apunta a un paso inexistente`
      );
    }
    if (!conexion.criterio) {
      throw new Error(`La conexión ${conexion.desde} → ${conexion.hasta} necesita CRITERIO`);
    }
  }
  return { pasos, conexiones };
}

function posicionAutomatica(index: number, baseY = 80) {
  const columna = index % 3;
  const fila = Math.floor(index / 3);
  const x = fila % 2 === 0 ? 40 + columna * PASO : 40 + (2 - columna) * PASO;
  return { x, y: baseY + fila * 400 };
}

export async function parchearFlujo(texto: string) {
  const marcas = texto.match(/^===\s*(PASO|CONEXI[ÓO]N)\s*===\s*$/gim) ?? [];
  if (marcas.length > 1) {
    throw new Error("PATCH cambia un solo paso o una sola conexión. Para el flujo entero usá PUT.");
  }

  const mapa = await leerMapa();
  const desde = campoUnaLinea(texto, /^DESDE\s*:\s*/i);
  const hasta = campoUnaLinea(texto, /^HASTA\s*:\s*/i);
  if (desde && hasta) {
    const enlace = mapa.enlaces.find(
      (item) => item.desde === slug(desde) && item.hasta === slug(hasta)
    );
    if (!enlace?.criterio) {
      throw new Error(`No existe la conexión ${slug(desde)} → ${slug(hasta)}`);
    }
    const criterio = mapa.nodos.find((nodo) => nodo.id === enlace.criterio);
    if (!criterio) throw new Error("La conexión no tiene criterio");
    const cuerpo = cuerpoDesde(texto, /^CRITERIO\s*:\s*$/i);
    if (!cuerpo) {
      throw new Error("CRITERIO: va solo en su línea y el texto empieza en la línea siguiente");
    }
    criterio.cuerpo = cuerpo;
    await guardarMapa(mapa);
    return;
  }

  const idLinea = campoUnaLinea(texto, /^ID\s*:\s*/i);
  if (!idLinea) {
    throw new Error("Indicá ID: del paso, o DESDE: y HASTA: de la conexión");
  }
  const nodo = mapa.nodos.find((item) => item.id === slug(idLinea) && item.tipo !== "criterio");
  if (!nodo) throw new Error(`No existe el paso ${slug(idLinea)}`);
  const titulo = campoUnaLinea(texto, /^T[IÍ]TULO\s*:\s*/i);
  if (titulo) nodo.titulo = titulo;
  if (/^CONTENIDO\s*:\s*$/im.test(texto)) {
    nodo.cuerpo = cuerpoDesde(texto, /^CONTENIDO\s*:\s*$/i);
  } else if (!titulo) {
    throw new Error("CONTENIDO: va solo en su línea y el texto empieza en la línea siguiente");
  }
  await guardarMapa(mapa);
}

export async function importarTextoPlano(
  texto: string,
  modo: "reemplazar" | "agregar"
) {
  if (modo === "agregar") {
    const creado = await crearFlujo("Importado");
    await conFlujo(creado.id, () => importarTextoPlano(texto, "reemplazar"));
    return creado.id;
  }

  const importado = analizarTextoPlano(texto);
  const mapa: EsquemaArchivo = { nodos: [], enlaces: [] };
  const usados = usadosDe(mapa);
  const ids = new Map<string, string>();
  const baseY = 80;
  const posicionesConocidas = importado.pasos.filter(
    (paso) => Number.isFinite(paso.x) && Number.isFinite(paso.y)
  );
  const minX = posicionesConocidas.length
    ? Math.min(...posicionesConocidas.map((paso) => paso.x as number))
    : 40;
  const minY = posicionesConocidas.length
    ? Math.min(...posicionesConocidas.map((paso) => paso.y as number))
    : 80;

  for (const [index, paso] of importado.pasos.entries()) {
    const id = idLibre(paso.id, usados);
    usados.add(id);
    ids.set(paso.id, id);
    const automatica = posicionAutomatica(index, baseY);
    const posicion =
      Number.isFinite(paso.x) && Number.isFinite(paso.y)
        ? {
            x: Math.round((paso.x as number) - minX + 40),
            y: Math.round((paso.y as number) - minY + baseY),
          }
        : automatica;
    const nodo: NodoGuardado = {
      id,
      titulo: paso.titulo,
      archivo: `nodos/${id}.md`,
      ...posicion,
      tipo: "flujo",
      cuerpo: paso.cuerpo,
    };
    mapa.nodos.push(nodo);
  }

  for (const conexion of importado.conexiones) {
    const desdeId = ids.get(conexion.desde) as string;
    const hastaId = ids.get(conexion.hasta) as string;
    const desde = mapa.nodos.find((nodo) => nodo.id === desdeId) as NodoGuardado;
    const hasta = mapa.nodos.find((nodo) => nodo.id === hastaId) as NodoGuardado;
    const criterioId = idLibre(slug(`criterio-${desdeId}-${hastaId}`), usados);
    usados.add(criterioId);
    const pos = posicionCriterio(desde, hasta);
    const criterio: NodoGuardado = {
      id: criterioId,
      titulo: "Criterio",
      archivo: `nodos/${criterioId}.md`,
      ...pos,
      tipo: "criterio",
      cuerpo: conexion.criterio,
    };
    const enlace: PiezaEnlace = {
      id: idLibre(slug(`${desdeId}-${hastaId}`), usados),
      desde: desdeId,
      hasta: hastaId,
      criterio: criterioId,
    };
    usados.add(enlace.id);
    mapa.nodos.push(criterio);
    mapa.enlaces.push(enlace);
  }

  await guardarMapa(mapa);
  return idDeTrabajo();
}

export async function leerEsquema(): Promise<Esquema> {
  const mapa = await leerMapa();
  const nodos: Nodo[] = await Promise.all(
    mapa.nodos.map(async (nodo, index) => ({
      id: nodo.id,
      titulo: nodo.titulo,
      archivo: nodo.archivo,
      x: Number.isFinite(nodo.x) ? nodo.x : 40 + index * PASO,
      y: Number.isFinite(nodo.y) ? nodo.y : 120,
      tipo: nodo.tipo === "criterio" ? "criterio" : "flujo",
      cuerpo: nodo.cuerpo ?? "",
    }))
  );
  const enlaces: Enlace[] = mapa.enlaces
    .filter((enlace) => enlace.criterio)
    .map((enlace) => ({
      id: enlace.id,
      desde: enlace.desde,
      hasta: enlace.hasta,
      criterio: enlace.criterio as string,
      evaluacion: enlace.evaluacion,
    }));
  return { nodos, enlaces };
}

export async function guardarEvaluacionEnlace(
  id: string,
  evaluacion: EvaluacionG
) {
  const mapa = await leerMapa();
  const enlace = mapa.enlaces.find((item) => item.id === id);
  if (!enlace) throw new Error("No existe la conexión en el esquema");
  enlace.evaluacion = evaluacion;
  await guardarMapa(mapa);
}

export async function guardarCuerpo(
  tipo: "nodo" | "enlace",
  id: string,
  cuerpo: string
) {
  const mapa = await leerMapa();
  const pieza = mapa.nodos.find((item) => item.id === id);
  if (tipo !== "nodo" || !pieza) throw new Error("No existe en el esquema");
  pieza.cuerpo = cuerpo;
  for (const enlace of mapa.enlaces) {
    if (enlace.desde === id || enlace.hasta === id || enlace.criterio === id) {
      delete enlace.evaluacion;
    }
  }
  await guardarMapa(mapa);
}

export async function crearNodo(titulo: string) {
  const nombre = titulo.trim();
  if (!nombre) throw new Error("El nodo necesita un nombre");

  const mapa = await leerMapa();
  const flujo = mapa.nodos.filter((nodo) => nodo.tipo !== "criterio");
  const id = idLibre(slug(nombre), usadosDe(mapa));
  const maxX = flujo.reduce((max, nodo) => Math.max(max, nodo.x ?? 0), 0);
  const nodo: NodoGuardado = {
    id,
    titulo: nombre,
    archivo: `nodos/${id}.md`,
    x: flujo.length ? maxX + PASO : 40,
    y: 120,
    tipo: "flujo",
    cuerpo: "",
  };

  mapa.nodos.push(nodo);
  await guardarMapa(mapa);
}

export async function renombrarNodo(id: string, titulo: string) {
  const nombre = titulo.trim();
  if (!nombre) throw new Error("El nodo necesita un nombre");

  const mapa = await leerMapa();
  const nodo = mapa.nodos.find((item) => item.id === id);
  if (!nodo) throw new Error("No existe en el esquema");
  nodo.titulo = nombre;
  for (const enlace of mapa.enlaces) {
    if (enlace.desde === id || enlace.hasta === id || enlace.criterio === id) {
      delete enlace.evaluacion;
    }
  }
  await guardarMapa(mapa);
}

export async function moverNodo(id: string, x: number, y: number) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error("Posición inválida");
  }

  const mapa = await leerMapa();
  const nodo = mapa.nodos.find((item) => item.id === id);
  if (!nodo) throw new Error("No existe en el esquema");
  nodo.x = Math.round(Math.min(8000, Math.max(16, x)));
  nodo.y = Math.round(Math.min(8000, Math.max(16, y)));
  if (nodo.tipo !== "criterio") {
    for (const enlace of mapa.enlaces) {
      if (enlace.desde !== id && enlace.hasta !== id) continue;
      const desde = mapa.nodos.find((item) => item.id === enlace.desde);
      const hasta = mapa.nodos.find((item) => item.id === enlace.hasta);
      const criterio = mapa.nodos.find((item) => item.id === enlace.criterio);
      if (!desde || !hasta || !criterio) continue;
      const pos = posicionCriterio(desde, hasta);
      criterio.x = pos.x;
      criterio.y = pos.y;
    }
  }
  await guardarMapa(mapa);
}

export async function crearEnlace(desde: string, hasta: string) {
  if (desde === hasta) throw new Error("Un nodo no se une consigo mismo");

  const mapa = await leerMapa();
  const origen = mapa.nodos.find((nodo) => nodo.id === desde);
  const destino = mapa.nodos.find((nodo) => nodo.id === hasta);
  if (!origen || !destino) throw new Error("Elegí dos nodos del esquema");
  if (origen.tipo === "criterio" || destino.tipo === "criterio") {
    throw new Error("El criterio va entre dos nodos del flujo");
  }
  if (mapa.enlaces.some((enlace) => enlace.desde === desde && enlace.hasta === hasta)) {
    throw new Error("Esa unión ya existe");
  }

  const dx = destino.x - origen.x;
  const dy = destino.y - origen.y;
  const dist = Math.hypot(dx, dy) || 1;
  const minima = ANCHO_FLUJO + ANCHO_CRITERIO + 64;
  if (dist < minima) {
    destino.x = Math.round(origen.x + (dx / dist) * minima);
    destino.y = Math.round(origen.y + (dy / dist) * minima);
  }

  const usados = usadosDe(mapa);
  const criterioId = idLibre("criterio", usados);
  usados.add(criterioId);
  const pos = posicionCriterio(origen, destino);
  const criterio: NodoGuardado = {
    id: criterioId,
    titulo: "Criterio",
    archivo: `nodos/${criterioId}.md`,
    x: pos.x,
    y: pos.y,
    tipo: "criterio",
    cuerpo: "",
  };
  const enlace: PiezaEnlace = {
    id: idLibre(`${desde}-${hasta}`.slice(0, 48), usados),
    desde,
    hasta,
    criterio: criterioId,
  };

  mapa.nodos.push(criterio);
  mapa.enlaces.push(enlace);
  await guardarMapa(mapa);
}

export async function quitarEnlace(id: string) {
  const mapa = await leerMapa();
  const enlace = mapa.enlaces.find((item) => item.id === id);
  if (!enlace) throw new Error("No existe en el esquema");
  const criterio = mapa.nodos.find((nodo) => nodo.id === enlace.criterio);
  mapa.enlaces = mapa.enlaces.filter((item) => item.id !== id);
  mapa.nodos = mapa.nodos.filter((nodo) => nodo.id !== enlace.criterio);
  await guardarMapa(mapa);
}

export async function quitarNodo(id: string) {
  const mapa = await leerMapa();
  const nodo = mapa.nodos.find((item) => item.id === id);
  if (!nodo) throw new Error("No existe en el esquema");

  if (nodo.tipo === "criterio") {
    mapa.enlaces = mapa.enlaces.filter((enlace) => enlace.criterio !== id);
    mapa.nodos = mapa.nodos.filter((item) => item.id !== id);
    await guardarMapa(mapa);
    return;
  }

  const enlaces = mapa.enlaces.filter(
    (enlace) => enlace.desde === id || enlace.hasta === id
  );
  const criterios = mapa.nodos.filter((item) =>
    enlaces.some((enlace) => enlace.criterio === item.id)
  );
  mapa.nodos = mapa.nodos.filter(
    (item) => item.id !== id && !criterios.some((criterio) => criterio.id === item.id)
  );
  mapa.enlaces = mapa.enlaces.filter(
    (enlace) => enlace.desde !== id && enlace.hasta !== id
  );
  await guardarMapa(mapa);
}
