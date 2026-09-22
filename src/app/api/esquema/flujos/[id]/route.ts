import { NextResponse } from "next/server";
import { conFlujo, importarTextoPlano } from "@/lib/esquema";
import { obtenerFlujo } from "@/lib/supabase-flujos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Contexto = { params: Promise<{ id: string }> };

export async function GET(_request: Request, contexto: Contexto) {
  const { id } = await contexto.params;
  try {
    const fila = await obtenerFlujo(id);
    if (!fila) return NextResponse.json({ error: "No existe ese flujo" }, { status: 404 });
    return new NextResponse(fila.texto, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo leer el flujo";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request, contexto: Contexto) {
  const { id } = await contexto.params;
  const tipo = request.headers.get("content-type") ?? "";
  let texto = "";
  if (tipo.includes("application/json")) {
    const body = (await request.json()) as { texto?: unknown };
    if (typeof body.texto !== "string") {
      return NextResponse.json({ error: "Falta el texto del flujo" }, { status: 400 });
    }
    texto = body.texto;
  } else {
    texto = await request.text();
  }

  try {
    const fila = await obtenerFlujo(id);
    if (!fila) return NextResponse.json({ error: "No existe ese flujo" }, { status: 404 });
    await conFlujo(id, () => importarTextoPlano(texto, "reemplazar"));
    return NextResponse.json({ id, url: `/esquema?flujo=${id}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar el flujo";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
