import { NextResponse } from "next/server";
import { conFlujo } from "@/lib/esquema";
import { generarNodo, rellenarNodo } from "@/lib/rellenar-nodo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { id?: unknown; modo?: unknown; flujo?: unknown };
  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const flujo =
    new URL(request.url).searchParams.get("flujo")?.trim() ||
    (typeof body.flujo === "string" ? body.flujo.trim() : "");

  try {
    const cuerpo = await conFlujo(flujo, () =>
      body.modo === "generar" ? generarNodo(body.id as string) : rellenarNodo(body.id as string)
    );
    return NextResponse.json({ cuerpo });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo generar";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
