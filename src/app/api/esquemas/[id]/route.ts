import { NextResponse } from "next/server";
import { conFlujo, editarEsquemaSimple } from "@/lib/esquema";
import { feedbackConexiones } from "@/lib/feedback-esquema";
import { eliminarFlujo, obtenerFlujo } from "@/lib/supabase-flujos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

function textoDe(body: Record<string, unknown>, ...claves: string[]) {
  for (const clave of claves) {
    const valor = body[clave];
    if (typeof valor === "string") return valor;
  }
  return "";
}

type Contexto = { params: Promise<{ id: string }> };

export async function GET(request: Request, contexto: Contexto) {
  const { id } = await contexto.params;
  try {
    const fila = await obtenerFlujo(id);
    if (!fila) return NextResponse.json({ error: "No existe ese flujo" }, { status: 404 });
    const origen = new URL(request.url).origin;
    return NextResponse.json({
      id: fila.id,
      url: `${origen}/esquema?flujo=${fila.id}`,
      conexiones: fila.esquema.enlaces.map((enlace) => ({
        desde: enlace.desde,
        hasta: enlace.hasta,
        puntuacion: enlace.evaluacion?.puntuacion ?? null,
        resumen: enlace.evaluacion?.resumen ?? "",
        recomendacion: enlace.evaluacion?.recomendacion ?? "",
        brechas: enlace.evaluacion?.brechas ?? [],
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo leer el feedback";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request, contexto: Contexto) {
  const { id } = await contexto.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "El cuerpo tiene que ser JSON" }, { status: 400 });
  }

  try {
    const editado = await editarEsquemaSimple(
      id,
      {
        anuncio: textoDe(body, "anuncio"),
        h1: textoDe(body, "h1", "H1"),
        intro: textoDe(body, "intro"),
        valor: textoDe(body, "valor"),
        cta: textoDe(body, "cta", "CTA"),
      },
      textoDe(body, "titulo", "título")
    );
    const origen = new URL(request.url).origin;
    const conexiones = await conFlujo(editado.id, () =>
      feedbackConexiones(new Set(editado.tocados))
    );
    return NextResponse.json({
      id: editado.id,
      url: `${origen}/esquema?flujo=${editado.id}`,
      conexiones,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo editar el esquema";
    const status = message === "No existe ese flujo" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, contexto: Contexto) {
  const { id } = await contexto.params;
  try {
    const borrado = await eliminarFlujo(id);
    if (!borrado) return NextResponse.json({ error: "No existe ese flujo" }, { status: 404 });
    return NextResponse.json({ id, borrado: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo borrar el flujo";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
