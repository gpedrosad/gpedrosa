import { NextResponse } from "next/server";
import { crearFlujo, flujos } from "@/lib/esquema";

function textoPlano(id: string) {
  return new NextResponse(`id: ${id}\nurl: /esquema?flujo=${id}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function tituloYCuerpo(raw: string) {
  const marca = raw.search(/^===/m);
  const cabeza = (marca === -1 ? raw : raw.slice(0, marca)).trim();
  const linea = cabeza
    .split("\n")
    .map((item) => item.trim())
    .find((item) => /^T[IÍ]TULO\s*:/i.test(item));
  const titulo = linea?.replace(/^T[IÍ]TULO\s*:\s*/i, "").trim() || "Flujo";
  const texto = (marca === -1 ? raw : raw.slice(marca)).trim();
  return { titulo, texto };
}

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
  const tipo = request.headers.get("content-type") ?? "";
  try {
    if (!tipo.includes("application/json")) {
      const { titulo, texto } = tituloYCuerpo(await request.text());
      const creado = await crearFlujo(titulo, texto);
      return textoPlano(creado.id);
    }

    const body = (await request.json()) as { titulo?: unknown; texto?: unknown };
    if (typeof body.titulo !== "string") {
      return NextResponse.json({ error: "El flujo necesita un nombre" }, { status: 400 });
    }
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
