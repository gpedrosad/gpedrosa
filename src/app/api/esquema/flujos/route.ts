import { NextResponse } from "next/server";
import { crearFlujo, flujos } from "@/lib/esquema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ flujos: await flujos() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron listar los flujos";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as { titulo?: unknown; texto?: unknown };
  if (typeof body.titulo !== "string") {
    return NextResponse.json({ error: "El flujo necesita un nombre" }, { status: 400 });
  }

  try {
    const creado = await crearFlujo(
      body.titulo,
      typeof body.texto === "string" ? body.texto : undefined
    );
    return NextResponse.json({
      ...creado,
      url: `/esquema?flujo=${creado.id}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear el flujo";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
