import { NextResponse } from "next/server";
import { obtenerFlujo } from "@/lib/supabase-flujos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
