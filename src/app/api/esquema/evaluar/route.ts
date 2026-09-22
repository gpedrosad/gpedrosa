import { NextResponse } from "next/server";
import { evaluarEnlace } from "@/lib/rellenar-nodo";
import { conFlujo, leerEsquema } from "@/lib/esquema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { id?: unknown; flujo?: unknown };
  const flujo =
    new URL(request.url).searchParams.get("flujo")?.trim() ||
    (typeof body.flujo === "string" ? body.flujo.trim() : "");

  try {
    return await conFlujo(flujo, async () => {
      const esquema = await leerEsquema();
      const ids =
        typeof body.id === "string"
          ? [body.id]
          : esquema.enlaces.map((enlace) => enlace.id);

      if (!ids.length) throw new Error("El flujo todavía no tiene conexiones");

      for (const id of ids) await evaluarEnlace(id);
      return NextResponse.json({ esquema: await leerEsquema(), flujo });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo evaluar";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
