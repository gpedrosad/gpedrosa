"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Esquema, EvaluacionG } from "@/lib/esquema-types";

type FlujoLista = { id: string; titulo: string };

type Seleccion = { tipo: "nodo" | "enlace"; id: string };

const ANCHO = 208;
const ALTO = 192;
const ANCHO_CRITERIO = 176;
const ALTO_CRITERIO = 120;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_PASO = 0.25;

function clave(tipo: Seleccion["tipo"], id: string) {
  return `${tipo}:${id}`;
}

function mapaInicial(esquema: Esquema) {
  const mapa: Record<string, string> = {};
  for (const nodo of esquema.nodos) mapa[clave("nodo", nodo.id)] = nodo.cuerpo;
  return mapa;
}

function ordenarPasos(esquema: Esquema) {
  const pasos = esquema.nodos.filter((nodo) => nodo.tipo === "flujo");
  const pendientes = new Map(
    pasos.map((paso) => [
      paso.id,
      esquema.enlaces.filter((enlace) => enlace.hasta === paso.id).length,
    ])
  );
  const cola = pasos.filter((paso) => pendientes.get(paso.id) === 0);
  const ordenados: typeof pasos = [];
  while (cola.length) {
    const actual = cola.shift();
    if (!actual || ordenados.some((paso) => paso.id === actual.id)) continue;
    ordenados.push(actual);
    for (const enlace of esquema.enlaces.filter((item) => item.desde === actual.id)) {
      const restante = (pendientes.get(enlace.hasta) ?? 1) - 1;
      pendientes.set(enlace.hasta, restante);
      const siguiente = pasos.find((paso) => paso.id === enlace.hasta);
      if (restante === 0 && siguiente) cola.push(siguiente);
    }
  }
  return [...ordenados, ...pasos.filter((paso) => !ordenados.includes(paso))];
}

function aTextoPlano(esquema: Esquema, cuerpos: Record<string, string>) {
  const cabecera = [
    "# FLUJO EN TEXTO PLANO",
    "# Editable y reutilizable. Conservá los marcadores, los ID y las referencias DESDE/HASTA.",
    "# Un LLM puede modificar este flujo o crear otro respetando exactamente este formato.",
  ];
  const pasos = ordenarPasos(esquema).map((nodo) =>
    [
      "=== PASO ===",
      `ID: ${nodo.id}`,
      `TÍTULO: ${nodo.titulo}`,
      `POSICIÓN: ${Math.round(nodo.x)}, ${Math.round(nodo.y)}`,
      "CONTENIDO:",
      (cuerpos[clave("nodo", nodo.id)] ?? nodo.cuerpo).trim(),
    ].join("\n")
  );
  const conexiones = esquema.enlaces.map((enlace) => {
    const criterio = esquema.nodos.find((nodo) => nodo.id === enlace.criterio);
    return [
      "=== CONEXIÓN ===",
      `DESDE: ${enlace.desde}`,
      `HASTA: ${enlace.hasta}`,
      "CRITERIO:",
      criterio
        ? (cuerpos[clave("nodo", criterio.id)] ?? criterio.cuerpo).trim()
        : "",
    ].join("\n");
  });
  return [...cabecera, ...pasos, ...conexiones].join("\n\n").trim() + "\n";
}

function medida(tipo: "flujo" | "criterio") {
  return tipo === "criterio"
    ? { ancho: ANCHO_CRITERIO, alto: ALTO_CRITERIO }
    : { ancho: ANCHO, alto: ALTO };
}

function posicionCriterio(
  desde: { x: number; y: number },
  hasta: { x: number; y: number }
) {
  const cx = (desde.x + ANCHO / 2 + hasta.x + ANCHO / 2) / 2;
  const cy = (desde.y + ALTO / 2 + hasta.y + ALTO / 2) / 2;
  return {
    x: Math.round(Math.max(16, cx - ANCHO_CRITERIO / 2)),
    y: Math.round(Math.max(16, cy - ALTO_CRITERIO / 2)),
  };
}

function ancla(
  desde: { x: number; y: number; ancho: number; alto: number },
  hasta: { x: number; y: number; ancho: number; alto: number }
) {
  const cx = desde.x + desde.ancho / 2;
  const cy = desde.y + desde.alto / 2;
  const tx = hasta.x + hasta.ancho / 2;
  const ty = hasta.y + hasta.alto / 2;
  const dx = tx - cx;
  const dy = ty - cy;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { x1: desde.x + desde.ancho, y1: cy, x2: hasta.x, y2: ty }
      : { x1: desde.x, y1: cy, x2: hasta.x + hasta.ancho, y2: ty };
  }

  return dy >= 0
    ? { x1: cx, y1: desde.y + desde.alto, x2: tx, y2: hasta.y }
    : { x1: cx, y1: desde.y, x2: tx, y2: hasta.y + hasta.alto };
}

export default function EsquemaEditor({
  esquema,
  flujoId,
  flujos,
}: {
  esquema: Esquema;
  flujoId: string;
  flujos: FlujoLista[];
}) {
  const router = useRouter();
  const [datos, setDatos] = useState(esquema);
  const [cuerpos, setCuerpos] = useState(() => mapaInicial(esquema));
  const [guardados, setGuardados] = useState(() => mapaInicial(esquema));
  const [nombres, setNombres] = useState<Record<string, string>>({});
  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [uniendo, setUniendo] = useState(false);
  const [origen, setOrigen] = useState<string | null>(null);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [nombreFlujo, setNombreFlujo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [rellenando, setRellenando] = useState(false);
  const [evaluando, setEvaluando] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmar, setConfirmar] = useState<Seleccion | null>(null);
  const [zoom, setZoom] = useState(1);
  const [textoAbierto, setTextoAbierto] = useState(false);
  const [textoPlano, setTextoPlano] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [importando, setImportando] = useState(false);
  const [confirmarReemplazo, setConfirmarReemplazo] = useState(false);
  const zoomRef = useRef(1);
  const cuerposRef = useRef(cuerpos);
  const guardadosRef = useRef(guardados);
  cuerposRef.current = cuerpos;
  guardadosRef.current = guardados;
  zoomRef.current = zoom;

  useEffect(() => {
    setDatos(esquema);
    const mapa = mapaInicial(esquema);
    setCuerpos(mapa);
    setGuardados(mapa);
    setNombres({});
    setSeleccion(null);
    setTextoAbierto(false);
    setUniendo(false);
    setOrigen(null);
  }, [flujoId, esquema]);

  function endpoint(path: string) {
    const url = new URL(path, "http://local");
    if (flujoId) url.searchParams.set("flujo", flujoId);
    return `${url.pathname}${url.search}`;
  }

  useEffect(() => {
    function afuera(event: PointerEvent) {
      const destino = event.target as HTMLElement | null;
      if (destino?.closest("[data-nodo]")) return;
      setSeleccion(null);
      setConfirmar(null);
    }

    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSeleccion(null);
      setConfirmar(null);
      setUniendo(false);
      setOrigen(null);
    }

    document.addEventListener("pointerdown", afuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", afuera);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const tituloDe = new Map(
    datos.nodos.map((nodo) => [nodo.id, nombres[nodo.id] ?? nodo.titulo])
  );

  function valor(tipo: Seleccion["tipo"], id: string) {
    return cuerpos[clave(tipo, id)] ?? "";
  }

  function estaSucio(tipo: Seleccion["tipo"], id: string) {
    return valor(tipo, id) !== (guardados[clave(tipo, id)] ?? "");
  }

  async function mutar(payload: object) {
    setGuardando(true);
    setError("");
    try {
      const respuesta = await fetch(endpoint("/api/esquema"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await respuesta.json()) as { esquema?: Esquema; error?: string };
      if (!respuesta.ok || !data.esquema) {
        throw new Error(data.error || "No se pudo guardar");
      }
      const siguiente = data.esquema;
      const sucios = cuerposRef.current;
      const baseGuardada = guardadosRef.current;
      setDatos(siguiente);
      setCuerpos(() => {
        const base = mapaInicial(siguiente);
        for (const [key, texto] of Object.entries(sucios)) {
          if (key in base && texto !== (baseGuardada[key] ?? "")) base[key] = texto;
        }
        return base;
      });
      setGuardados(() => {
        const base = mapaInicial(siguiente);
        for (const key of Object.keys(base)) {
          if ((sucios[key] ?? "") !== (baseGuardada[key] ?? "")) {
            base[key] = baseGuardada[key] ?? "";
          }
        }
        return base;
      });
      return siguiente;
    } catch (causa) {
      setError(causa instanceof Error ? causa.message : "No se pudo guardar");
      return null;
    } finally {
      setGuardando(false);
    }
  }

  async function guardarCuerpo(actual: Seleccion) {
    const key = clave(actual.tipo, actual.id);
    setGuardando(true);
    setError("");
    try {
      const respuesta = await fetch(endpoint("/api/esquema"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: actual.tipo,
          id: actual.id,
          cuerpo: cuerpos[key] ?? "",
        }),
      });
      const data = (await respuesta.json()) as { error?: string };
      if (!respuesta.ok) throw new Error(data.error || "No se pudo guardar");
      setGuardados((prev) => ({ ...prev, [key]: cuerpos[key] ?? "" }));
    } catch (causa) {
      setError(causa instanceof Error ? causa.message : "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function rellenar(id: string, modo: "piezas" | "generar" = "piezas") {
    setRellenando(true);
    setError("");
    try {
      const respuesta = await fetch(endpoint("/api/esquema/rellenar"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, modo }),
      });
      const data = (await respuesta.json()) as { cuerpo?: string; error?: string };
      if (!respuesta.ok || typeof data.cuerpo !== "string") {
        throw new Error(data.error || "No se pudo rellenar");
      }
      const key = clave("nodo", id);
      setCuerpos((prev) => ({ ...prev, [key]: data.cuerpo as string }));
      setGuardados((prev) => ({ ...prev, [key]: data.cuerpo as string }));
    } catch (causa) {
      setError(causa instanceof Error ? causa.message : "No se pudo rellenar");
    } finally {
      setRellenando(false);
    }
  }

  async function evaluar(id?: string) {
    setEvaluando(id ?? "todo");
    setError("");
    try {
      const respuesta = await fetch(endpoint("/api/esquema/evaluar"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id } : {}),
      });
      const data = (await respuesta.json()) as { esquema?: Esquema; error?: string };
      if (!respuesta.ok || !data.esquema) {
        throw new Error(data.error || "No se pudo evaluar la coherencia");
      }
      setDatos(data.esquema);
    } catch (causa) {
      setError(causa instanceof Error ? causa.message : "No se pudo evaluar la coherencia");
    } finally {
      setEvaluando(null);
    }
  }

  function cargarTextoActual() {
    setTextoPlano(aTextoPlano(datos, cuerposRef.current));
    setCopiado(false);
    setConfirmarReemplazo(false);
  }

  async function copiarTexto() {
    let listo = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textoPlano);
        listo = true;
      }
    } catch {}

    if (!listo) {
      const auxiliar = document.createElement("textarea");
      auxiliar.value = textoPlano;
      auxiliar.setAttribute("readonly", "");
      auxiliar.style.position = "fixed";
      auxiliar.style.opacity = "0";
      document.body.appendChild(auxiliar);
      auxiliar.select();
      listo = document.execCommand("copy");
      auxiliar.remove();
    }

    if (listo) {
      setCopiado(true);
    } else {
      setError("No pude copiar automáticamente. Seleccioná el texto y copiá con el teclado.");
    }
  }

  async function importarTexto(modo: "reemplazar" | "agregar") {
    if (modo === "reemplazar" && !confirmarReemplazo) {
      setConfirmarReemplazo(true);
      return;
    }
    setImportando(true);
    setError("");
    try {
      const respuesta = await fetch(endpoint("/api/esquema"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "importar-texto", texto: textoPlano, modo }),
      });
      const data = (await respuesta.json()) as {
        esquema?: Esquema;
        flujo?: string;
        error?: string;
      };
      if (!respuesta.ok || !data.esquema) {
        throw new Error(data.error || "No se pudo generar el flujo desde el texto");
      }
      if (data.flujo && data.flujo !== flujoId) {
        router.push(`/esquema?flujo=${data.flujo}`);
        router.refresh();
        return;
      }
      setDatos(data.esquema);
      const mapa = mapaInicial(data.esquema);
      setCuerpos(mapa);
      setGuardados(mapa);
      setSeleccion(null);
      setConfirmarReemplazo(false);
      setTextoPlano(aTextoPlano(data.esquema, mapa));
    } catch (causa) {
      setError(
        causa instanceof Error ? causa.message : "No se pudo generar el flujo desde el texto"
      );
    } finally {
      setImportando(false);
    }
  }

  async function crear() {
    const titulo = nombreNuevo.trim();
    if (!titulo) return;
    const siguiente = await mutar({ accion: "crear-nodo", titulo });
    if (siguiente) setNombreNuevo("");
  }

  async function renombrar(id: string) {
    if (!(id in nombres)) return;
    const titulo = nombres[id].trim();
    const actual = datos.nodos.find((nodo) => nodo.id === id);
    if (!actual) return;
    if (!titulo) {
      setNombres((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setError("El nodo necesita un nombre");
      return;
    }
    if (titulo === actual.titulo) {
      setNombres((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    const siguiente = await mutar({ accion: "renombrar", id, titulo });
    if (siguiente) {
      setNombres((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  function elegirNodo(id: string) {
    const nodo = datos.nodos.find((item) => item.id === id);
    if (uniendo && nodo?.tipo === "criterio") return;
    if (!uniendo) {
      setSeleccion({ tipo: "nodo", id });
      setConfirmar(null);
      return;
    }
    if (!origen) {
      setOrigen(id);
      return;
    }
    if (origen === id) {
      setOrigen(null);
      return;
    }
    const desde = origen;
    setOrigen(null);
    setUniendo(false);
    void mutar({ accion: "crear-enlace", desde, hasta: id });
  }

  function iniciarArrastre(event: React.PointerEvent<HTMLDivElement>, id: string) {
    if ((event.target as HTMLElement).closest("[data-no-drag]")) return;

    const nodo = datos.nodos.find((item) => item.id === id);
    if (!nodo) return;

    const origenX = event.clientX;
    const origenY = event.clientY;
    const inicioX = nodo.x;
    const inicioY = nodo.y;
    let movio = false;
    const elemento = event.currentTarget;
    elemento.setPointerCapture(event.pointerId);

    const mover = (e: PointerEvent) => {
      const dx = e.clientX - origenX;
      const dy = e.clientY - origenY;
      if (Math.abs(dx) + Math.abs(dy) > 4) movio = true;
      const escala = zoomRef.current || 1;
      setDatos((prev) => {
        const nodos = prev.nodos.map((item) =>
          item.id === id
            ? {
                ...item,
                x: Math.max(16, inicioX + dx / escala),
                y: Math.max(16, inicioY + dy / escala),
              }
            : item
        );
        const movido = nodos.find((item) => item.id === id);
        if (!movido || movido.tipo === "criterio") return { ...prev, nodos };
        return {
          ...prev,
          nodos: nodos.map((item) => {
            if (item.tipo !== "criterio") return item;
            const enlace = prev.enlaces.find((relacion) => relacion.criterio === item.id);
            if (!enlace || (enlace.desde !== id && enlace.hasta !== id)) return item;
            const desde = nodos.find((nodo) => nodo.id === enlace.desde);
            const hasta = nodos.find((nodo) => nodo.id === enlace.hasta);
            if (!desde || !hasta) return item;
            return { ...item, ...posicionCriterio(desde, hasta) };
          }),
        };
      });
    };

    const soltar = (e: PointerEvent) => {
      elemento.removeEventListener("pointermove", mover);
      elemento.removeEventListener("pointerup", soltar);
      if (!movio) {
        elegirNodo(id);
        return;
      }
      const dx = e.clientX - origenX;
      const dy = e.clientY - origenY;
      const escala = zoomRef.current || 1;
      void fetch(endpoint("/api/esquema"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "mover",
          id,
          x: Math.max(16, inicioX + dx / escala),
          y: Math.max(16, inicioY + dy / escala),
        }),
      }).then(async (respuesta) => {
        if (!respuesta.ok) {
          const data = (await respuesta.json()) as { error?: string };
          setError(data.error || "No se pudo guardar la posición");
        }
      });
    };

    elemento.addEventListener("pointermove", mover);
    elemento.addEventListener("pointerup", soltar);
  }

  const ancho = Math.max(
    960,
    ...datos.nodos.map((nodo) => nodo.x + (seleccion?.id === nodo.id ? 360 : ANCHO) + 80)
  );
  const alto = Math.max(
    640,
    ...datos.nodos.map((nodo) => nodo.y + (seleccion?.id === nodo.id ? 460 : ALTO) + 80)
  );
  const evaluaciones = datos.enlaces
    .map((enlace) => enlace.evaluacion)
    .filter((item): item is EvaluacionG => Boolean(item));
  const coherencia = evaluaciones.length
    ? Math.round(
        evaluaciones.reduce((total, item) => total + item.puntuacion, 0) /
          evaluaciones.length
      )
    : null;

  function cambiarZoom(delta: number) {
    setZoom((actual) =>
      Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((actual + delta) * 100) / 100))
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Esquema</h1>
          <a
            href="/api/esquema/formato"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-neutral-500 underline decoration-neutral-300 underline-offset-4 hover:text-black"
          >
            /api/esquema/formato
          </a>
          <form
            className="flex items-center gap-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const titulo = nombreFlujo.trim();
              if (!titulo) return;
              setGuardando(true);
              setError("");
              try {
                const respuesta = await fetch("/api/esquema/flujos", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ titulo }),
                });
                const data = (await respuesta.json()) as { id?: string; error?: string };
                if (!respuesta.ok || !data.id) {
                  throw new Error(data.error || "No se pudo crear el flujo");
                }
                setNombreFlujo("");
                router.push(`/esquema?flujo=${data.id}`);
                router.refresh();
              } catch (causa) {
                setError(causa instanceof Error ? causa.message : "No se pudo crear el flujo");
              } finally {
                setGuardando(false);
              }
            }}
          >
            <select
              aria-label="Flujo"
              value={flujoId}
              onChange={(event) => {
                router.push(`/esquema?flujo=${event.target.value}`);
                router.refresh();
              }}
              className="h-10 max-w-52 rounded-full border border-neutral-300 bg-white px-4 text-sm outline-none"
            >
              {flujos.map((flujo) => (
                <option key={flujo.id} value={flujo.id}>
                  {flujo.titulo}
                </option>
              ))}
            </select>
            <input
              value={nombreFlujo}
              onChange={(event) => setNombreFlujo(event.target.value)}
              placeholder="Nombre del flujo nuevo"
              aria-label="Nombre del flujo nuevo"
              className="h-10 w-52 rounded-full border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-black"
            />
            <button
              type="submit"
              disabled={!nombreFlujo.trim() || guardando}
              className="h-10 rounded-full border border-neutral-300 bg-white px-4 text-sm disabled:opacity-30"
            >
              Crear flujo
            </button>
          </form>
          <div className="flex items-center rounded-full border border-neutral-300 bg-white">
            <button
              type="button"
              aria-label="Alejar"
              onClick={() => cambiarZoom(-ZOOM_PASO)}
              disabled={zoom <= ZOOM_MIN}
              className="h-10 w-10 text-lg disabled:opacity-30"
            >
              −
            </button>
            <button
              type="button"
              aria-label="Restablecer zoom"
              onClick={() => setZoom(1)}
              className="h-10 min-w-14 px-2 text-sm tabular-nums"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              aria-label="Acercar"
              onClick={() => cambiarZoom(ZOOM_PASO)}
              disabled={zoom >= ZOOM_MAX}
              className="h-10 w-10 text-lg disabled:opacity-30"
            >
              +
            </button>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void crear();
            }}
          >
            <input
              value={nombreNuevo}
              onChange={(event) => setNombreNuevo(event.target.value)}
              placeholder="Nombre del nuevo nodo"
              aria-label="Nombre del nuevo nodo"
              className="h-10 w-52 rounded-full border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-black"
            />
            <button
              type="submit"
              disabled={!nombreNuevo.trim() || guardando}
              className="h-10 rounded-full bg-black px-4 text-sm text-white disabled:opacity-30"
            >
              Crear nodo
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setUniendo((prev) => !prev);
              setOrigen(null);
              setSeleccion(null);
            }}
            className={`h-10 rounded-full px-4 text-sm ${
              uniendo ? "bg-black text-white" : "border border-neutral-300 bg-white"
            }`}
          >
            {uniendo ? "Cancelar" : "Unir dos nodos"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTextoAbierto((abierto) => {
                if (!abierto) cargarTextoActual();
                return !abierto;
              });
            }}
            className={`h-10 rounded-full px-4 text-sm ${
              textoAbierto
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 bg-white"
            }`}
          >
            Texto plano · LLM
          </button>
          <button
            type="button"
            onClick={() => void evaluar()}
            disabled={Boolean(evaluando) || guardando || rellenando}
            className="h-10 rounded-full border border-violet-300 bg-violet-50 px-4 text-sm text-violet-900 disabled:opacity-40"
          >
            {evaluando === "todo" ? "Evaluando…" : "Evaluar flujo · G-Eval"}
          </button>
          {coherencia !== null ? (
            <span
              className={`rounded-full px-3 py-2 text-sm font-medium ${
                coherencia >= 80
                  ? "bg-emerald-100 text-emerald-800"
                  : coherencia >= 55
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              Coherencia {coherencia}/100 · {evaluaciones.length}/{datos.enlaces.length}
            </span>
          ) : null}
          <Link href="/captacion" className="px-2 text-sm text-neutral-500 hover:text-black">
            Ver landing
          </Link>
        </div>
      </header>

      {textoAbierto ? (
        <section className="border-b border-neutral-200 bg-white px-6 py-5">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold">Flujo completo en texto plano</h2>
                  <p className="text-sm text-neutral-500">
                    Podés editarlo aquí, copiarlo a un LLM o pegar otro flujo con el mismo formato.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={cargarTextoActual}
                    className="h-9 rounded-full border border-neutral-300 px-4 text-sm"
                  >
                    Recargar esquema
                  </button>
                  <button
                    type="button"
                    onClick={() => void copiarTexto()}
                    className="h-9 rounded-full bg-black px-4 text-sm text-white"
                  >
                    {copiado ? "Copiado ✓" : "Copiar todo"}
                  </button>
                </div>
              </div>
              <textarea
                value={textoPlano}
                onChange={(event) => {
                  setTextoPlano(event.target.value);
                  setCopiado(false);
                  setConfirmarReemplazo(false);
                }}
                aria-label="Flujo completo en texto plano"
                spellCheck={false}
                className="h-[32rem] w-full resize-y rounded-2xl border border-neutral-300 bg-neutral-950 p-4 font-mono text-sm leading-relaxed text-neutral-100 outline-none focus:border-violet-500"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void importarTexto("agregar")}
                  disabled={importando || !textoPlano.trim()}
                  className="h-10 rounded-full bg-violet-700 px-4 text-sm text-white disabled:opacity-30"
                >
                  {importando ? "Generando…" : "Agregar como otro flujo"}
                </button>
                <button
                  type="button"
                  onClick={() => void importarTexto("reemplazar")}
                  disabled={importando || !textoPlano.trim()}
                  className={`h-10 rounded-full px-4 text-sm disabled:opacity-30 ${
                    confirmarReemplazo
                      ? "bg-red-700 text-white"
                      : "border border-neutral-300"
                  }`}
                >
                  {confirmarReemplazo ? "Confirmar reemplazo" : "Reemplazar flujo actual"}
                </button>
              </div>
            </div>
            <aside className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm leading-relaxed">
              <h2 className="font-semibold">Cómo usarlo con un LLM</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-neutral-700">
                <li>Pasale al LLM el link <code>/api/esquema/formato</code>.</li>
                <li>Usá <strong>Copiar todo</strong> y pegale el flujo que tiene que continuar.</li>
                <li>
                  Pedile que devuelva el flujo completo: <code>CONTENIDO:</code> y{" "}
                  <code>CRITERIO:</code> solos en su línea, y <code>DESDE</code>/<code>HASTA</code>{" "}
                  con el ID del paso.
                </li>
                <li>
                  Pegá la respuesta acá. <strong>Agregar como otro flujo</strong> crea una fila nueva
                  llamada Importado. <strong>Reemplazar flujo actual</strong> sustituye solo este.
                </li>
              </ol>
              <p className="mt-4 font-medium">Prompt sugerido</p>
              <p className="mt-2 rounded-xl bg-white p-3 text-neutral-700">
                “Lee /api/esquema/formato. Crea con POST /api/esquemas. Usa el feedback de conexiones para mejorar ese mismo id con PATCH y solo los campos que cambian. Borra con DELETE. No uses la pantalla. El copy no usa voseo.”
              </p>
              <details className="mt-4">
                <summary className="cursor-pointer font-medium">Reglas del formato</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-600">
                  <li>Cada paso empieza con <code>=== PASO ===</code>.</li>
                  <li>Los ID son únicos, en minúsculas y sin espacios.</li>
                  <li>Cada unión empieza con <code>=== CONEXIÓN ===</code>.</li>
                  <li>DESDE y HASTA usan el ID, no el título.</li>
                  <li>
                    <code>CONTENIDO:</code> y <code>CRITERIO:</code> van solos en su línea.
                  </li>
                  <li>La landing es un paso por componente, no un solo paso.</li>
                  <li>POSICIÓN es opcional.</li>
                </ul>
              </details>
            </aside>
          </div>
        </section>
      ) : null}

      <div
        className="overflow-auto"
        style={{
          backgroundImage: "radial-gradient(#e5e5e5 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <div style={{ width: ancho * zoom, height: alto * zoom }}>
          <div
            className="relative origin-top-left"
            style={{ width: ancho, height: alto, transform: `scale(${zoom})` }}
          >
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <marker
                id="flecha"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L8,4 L0,8 Z" fill="#b45309" />
              </marker>
            </defs>
            {datos.enlaces.map((enlace) => {
              const desde = datos.nodos.find((nodo) => nodo.id === enlace.desde);
              const criterio = datos.nodos.find((nodo) => nodo.id === enlace.criterio);
              const hasta = datos.nodos.find((nodo) => nodo.id === enlace.hasta);
              if (!desde || !criterio || !hasta) return null;
              const ida = ancla(
                { ...desde, ...medida(desde.tipo) },
                { ...criterio, ...medida("criterio") }
              );
              const vuelta = ancla(
                { ...criterio, ...medida("criterio") },
                { ...hasta, ...medida(hasta.tipo) }
              );
              return (
                <g key={enlace.id}>
                  <line
                    x1={ida.x1}
                    y1={ida.y1}
                    x2={ida.x2}
                    y2={ida.y2}
                    stroke="#b45309"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={vuelta.x1}
                    y1={vuelta.y1}
                    x2={vuelta.x2}
                    y2={vuelta.y2}
                    stroke="#b45309"
                    strokeWidth="1.5"
                    markerEnd="url(#flecha)"
                  />
                </g>
              );
            })}
          </svg>

          {datos.nodos.map((nodo) => {
            const abierto = seleccion?.tipo === "nodo" && seleccion.id === nodo.id;
            const esOrigen = origen === nodo.id;
            const criterio = nodo.tipo === "criterio";
            const box = medida(nodo.tipo);
            const relacion = criterio
              ? datos.enlaces.find((enlace) => enlace.criterio === nodo.id)
              : undefined;
            const detalle = criterio
              ? `Criterio entre ${tituloDe.get(relacion?.desde ?? "") ?? "?"} y ${tituloDe.get(relacion?.hasta ?? "") ?? "?"}`
              : "Paso del flujo";
            const unido = datos.enlaces.some(
              (enlace) => enlace.desde === nodo.id || enlace.hasta === nodo.id
            );
            const puedeRellenar = !criterio && unido;
            return (
              <div
                key={nodo.id}
                data-nodo={nodo.id}
                onPointerDown={(event) => {
                  if (uniendo) return;
                  iniciarArrastre(event, nodo.id);
                }}
                onClick={(event) => {
                  if (!uniendo) return;
                  if ((event.target as HTMLElement).closest("[data-no-drag]")) return;
                  elegirNodo(nodo.id);
                }}
                className={`absolute rounded-2xl border shadow-sm ${
                  criterio ? "z-20 border-amber-700 bg-amber-50" : "z-10 bg-white"
                } ${
                  esOrigen || abierto
                    ? criterio
                      ? "border-amber-800"
                      : "border-black"
                    : criterio
                      ? "border-amber-700"
                      : "border-neutral-200"
                } ${uniendo && !criterio ? "cursor-crosshair" : "cursor-grab"}`}
                style={{ left: nodo.x, top: nodo.y, width: abierto ? 320 : box.ancho }}
              >
                {abierto ? (
                  <div className="p-4">
                    <p className="mb-3 cursor-grab select-none text-[11px] uppercase tracking-wide text-neutral-400">
                      {detalle} · Arrastrar
                    </p>
                    <Editor
                      etiqueta={nombres[nodo.id] ?? nodo.titulo}
                      valor={valor("nodo", nodo.id)}
                      sucio={estaSucio("nodo", nodo.id)}
                      guardando={guardando}
                      error={error}
                      confirmar={confirmar?.tipo === "nodo" && confirmar.id === nodo.id}
                      textoQuitar={criterio ? "Eliminar esta unión" : "Eliminar nodo"}
                      nombreEditable
                      onNombre={(titulo) =>
                        setNombres((prev) => ({ ...prev, [nodo.id]: titulo }))
                      }
                      onNombreListo={() => void renombrar(nodo.id)}
                      onCerrar={() => setSeleccion(null)}
                      onChange={(cuerpo) =>
                        setCuerpos((prev) => ({
                          ...prev,
                          [clave("nodo", nodo.id)]: cuerpo,
                        }))
                      }
                      onGuardar={() => guardarCuerpo({ tipo: "nodo", id: nodo.id })}
                      onRellenar={puedeRellenar ? () => void rellenar(nodo.id) : undefined}
                      onGenerar={puedeRellenar ? () => void rellenar(nodo.id, "generar") : undefined}
                      evaluacion={relacion?.evaluacion}
                      onEvaluar={
                        criterio && relacion
                          ? () => void evaluar(relacion.id)
                          : undefined
                      }
                      evaluando={evaluando === relacion?.id}
                      rellenando={rellenando}
                      onQuitar={() => {
                        if (confirmar?.tipo === "nodo" && confirmar.id === nodo.id) {
                          setSeleccion(null);
                          setConfirmar(null);
                          void mutar({ accion: "quitar-nodo", id: nodo.id });
                          return;
                        }
                        setConfirmar({ tipo: "nodo", id: nodo.id });
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="flex flex-col p-4"
                    style={{ height: box.alto }}
                  >
                    <span
                      className={`text-[11px] uppercase tracking-wide ${
                        criterio ? "text-amber-800" : "text-neutral-400"
                      }`}
                    >
                      {esOrigen ? "Partida" : criterio ? "Criterio" : "Paso"}
                    </span>
                    <p className="mt-1 text-lg font-medium">{nombres[nodo.id] ?? nodo.titulo}</p>
                    {criterio && relacion?.evaluacion ? (
                      <span
                        className={`mt-2 w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                          relacion.evaluacion.puntuacion >= 80
                            ? "bg-emerald-100 text-emerald-800"
                            : relacion.evaluacion.puntuacion >= 55
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        Coincidencia {relacion.evaluacion.puntuacion}/100
                      </span>
                    ) : null}
                    <span className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-neutral-500">
                      {valor("nodo", nodo.id).trim() || "Sin notas todavía"}
                    </span>
                    {estaSucio("nodo", nodo.id) ? (
                      <span className="mt-auto text-xs text-neutral-400">Cambios sin guardar</span>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Editor({
  etiqueta,
  valor,
  sucio,
  guardando,
  error,
  confirmar,
  textoQuitar,
  nombreEditable = false,
  onNombre,
  onNombreListo,
  onCerrar,
  onChange,
  onGuardar,
  onRellenar,
  onGenerar,
  evaluacion,
  onEvaluar,
  evaluando = false,
  rellenando = false,
  onQuitar,
}: {
  etiqueta: string;
  valor: string;
  sucio: boolean;
  guardando: boolean;
  error: string;
  confirmar: boolean;
  textoQuitar: string;
  nombreEditable?: boolean;
  onNombre?: (titulo: string) => void;
  onNombreListo?: () => void;
  onCerrar: () => void;
  onChange: (cuerpo: string) => void;
  onGuardar: () => void;
  onRellenar?: () => void;
  onGenerar?: () => void;
  evaluacion?: EvaluacionG;
  onEvaluar?: () => void;
  evaluando?: boolean;
  rellenando?: boolean;
  onQuitar: () => void;
}) {
  return (
    <div data-no-drag className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {nombreEditable ? (
            <input
              value={etiqueta}
              aria-label="Nombre del nodo"
              onChange={(event) => onNombre?.(event.target.value)}
              onBlur={() => onNombreListo?.()}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              className="w-full bg-transparent text-lg font-medium outline-none"
            />
          ) : (
            <p className="text-lg font-medium">{etiqueta}</p>
          )}
        </div>
        <button type="button" onClick={onCerrar} className="shrink-0 text-sm text-neutral-400 hover:text-black">
          Cerrar
        </button>
      </div>
      <textarea
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        aria-label={etiqueta}
        placeholder="Notas de este nodo"
        className="min-h-40 w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 p-3 font-mono text-sm leading-relaxed outline-none focus:border-black"
      />
      <p className="text-xs text-neutral-400">
        {error || (sucio ? "Hay cambios sin guardar" : "Guardado")}
      </p>
      {evaluacion ? <Evaluacion evaluacion={evaluacion} /> : null}
      <div className="flex flex-wrap items-center gap-2">
        {onEvaluar ? (
          <button
            type="button"
            onClick={onEvaluar}
            disabled={guardando || rellenando || evaluando || sucio}
            title={sucio ? "Guardá el criterio antes de evaluarlo" : undefined}
            className="h-9 rounded-full bg-violet-700 px-4 text-sm text-white disabled:opacity-30"
          >
            {evaluando ? "Evaluando…" : "Evaluar conexión"}
          </button>
        ) : null}
        {onGenerar ? (
          <button
            type="button"
            onClick={onGenerar}
            disabled={guardando || rellenando}
            className="h-9 rounded-full bg-black px-4 text-sm text-white disabled:opacity-30"
          >
            {rellenando ? "Generando…" : "Generar"}
          </button>
        ) : null}
        {onRellenar ? (
          <button
            type="button"
            onClick={onRellenar}
            disabled={guardando || rellenando}
            className="h-9 rounded-full border border-neutral-300 px-4 text-sm disabled:opacity-30"
          >
            {rellenando ? "Pensando…" : "Qué incluir"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onGuardar}
          disabled={!sucio || guardando || rellenando}
          className="h-9 rounded-full border border-neutral-300 px-4 text-sm disabled:opacity-30"
        >
          {guardando ? "Guardando…" : "Guardar notas"}
        </button>
        <button type="button" onClick={onQuitar} className="h-9 px-2 text-sm text-neutral-400 hover:text-black">
          {confirmar ? "Sí, eliminar" : textoQuitar}
        </button>
      </div>
    </div>
  );
}

function Evaluacion({ evaluacion }: { evaluacion: EvaluacionG }) {
  return (
    <section className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-violet-950">G-Eval · {evaluacion.puntuacion}/100</strong>
        <span className="text-xs uppercase tracking-wide text-violet-700">
          Coincidencia {evaluacion.nivel}
        </span>
      </div>
      <p className="mt-2 text-violet-950">{evaluacion.resumen}</p>
      {evaluacion.dimensiones.length ? (
        <div className="mt-3 grid gap-1">
          {evaluacion.dimensiones.map((dimension) => (
            <div key={dimension.nombre} className="flex justify-between gap-3 text-xs">
              <span className="text-violet-900">{dimension.nombre}</span>
              <span className="font-semibold tabular-nums text-violet-950">
                {dimension.puntuacion}/100
              </span>
            </div>
          ))}
        </div>
      ) : null}
      {evaluacion.brechas.length ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Brechas</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-violet-950">
            {evaluacion.brechas.map((brecha) => <li key={brecha}>{brecha}</li>)}
          </ul>
        </div>
      ) : null}
      <p className="mt-3 border-t border-violet-200 pt-3 text-violet-950">
        <strong>Siguiente ajuste:</strong> {evaluacion.recomendacion}
      </p>
    </section>
  );
}
