import { NextResponse } from "next/server";
import {
  conFlujo,
  crearEnlace,
  crearNodo,
  flujos,
  guardarCuerpo,
  importarTextoPlano,
  leerEsquema,
  moverNodo,
  quitarEnlace,
  quitarNodo,
  renombrarNodo,
} from "@/lib/esquema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function pedido(request: Request, body?: { flujo?: unknown }) {
  const desdeUrl = new URL(request.url).searchParams.get("flujo")?.trim();
  if (desdeUrl) return desdeUrl;
  if (body && typeof body.flujo === "string" && body.flujo.trim()) return body.flujo.trim();
  return "";
}

export async function GET(request: Request) {
  try {
    return await conFlujo(pedido(request), async () => {
      const esquema = await leerEsquema();
      const lista = await flujos();
      return NextResponse.json({ esquema, flujo: pedido(request) || lista[0]?.id || "" });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo leer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function respuesta(
  request: Request,
  body: { flujo?: unknown },
  accion: () => Promise<string | void>
) {
  try {
    return await conFlujo(pedido(request, body), async () => {
      const escrito = await accion();
      const publicar = async () => {
        const esquema = await leerEsquema();
        const lista = await flujos();
        return NextResponse.json({
          esquema,
          flujo: escrito || pedido(request, body) || lista[0]?.id || "",
        });
      };
      if (escrito) return conFlujo(escrito, publicar);
      return publicar();
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "No se pudo guardar";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    accion?: string;
    titulo?: unknown;
    id?: unknown;
    desde?: unknown;
    hasta?: unknown;
    x?: unknown;
    y?: unknown;
    texto?: unknown;
    modo?: unknown;
    flujo?: unknown;
  };

  if (body.accion === "crear-nodo" && typeof body.titulo === "string") {
    return respuesta(request, body, () => crearNodo(body.titulo as string));
  }
  if (body.accion === "renombrar" && typeof body.id === "string" && typeof body.titulo === "string") {
    return respuesta(request, body, () => renombrarNodo(body.id as string, body.titulo as string));
  }
  if (
    body.accion === "mover" &&
    typeof body.id === "string" &&
    typeof body.x === "number" &&
    typeof body.y === "number"
  ) {
    return respuesta(request, body, () => moverNodo(body.id as string, body.x as number, body.y as number));
  }
  if (body.accion === "crear-enlace" && typeof body.desde === "string" && typeof body.hasta === "string") {
    return respuesta(request, body, () => crearEnlace(body.desde as string, body.hasta as string));
  }
  if (body.accion === "quitar-enlace" && typeof body.id === "string") {
    return respuesta(request, body, () => quitarEnlace(body.id as string));
  }
  if (body.accion === "quitar-nodo" && typeof body.id === "string") {
    return respuesta(request, body, () => quitarNodo(body.id as string));
  }
  if (
    body.accion === "importar-texto" &&
    typeof body.texto === "string" &&
    (body.modo === "reemplazar" || body.modo === "agregar")
  ) {
    return respuesta(request, body, () =>
      importarTextoPlano(body.texto as string, body.modo as "reemplazar" | "agregar")
    );
  }

  return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    tipo?: string;
    id?: string;
    cuerpo?: unknown;
    flujo?: unknown;
  };

  if (
    (body.tipo !== "nodo" && body.tipo !== "enlace") ||
    typeof body.id !== "string" ||
    typeof body.cuerpo !== "string"
  ) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  return respuesta(request, body, () =>
    guardarCuerpo(body.tipo as "nodo" | "enlace", body.id as string, body.cuerpo as string)
  );
}
