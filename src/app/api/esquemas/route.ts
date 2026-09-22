import { NextResponse } from "next/server";
import { conFlujo, crearEsquemaSimple, leerEsquema } from "@/lib/esquema";
import { evaluarEnlace } from "@/lib/rellenar-nodo";

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

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "El cuerpo tiene que ser JSON" }, { status: 400 });
  }

  try {
    const creado = await crearEsquemaSimple(
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
    const conexiones = await conFlujo(creado.id, async () => {
      const esquema = await leerEsquema();
      const salida = [];
      for (const enlace of esquema.enlaces) {
        try {
          const evaluacion = await evaluarEnlace(enlace.id);
          salida.push({
            desde: enlace.desde,
            hasta: enlace.hasta,
            puntuacion: evaluacion.puntuacion,
            resumen: evaluacion.resumen,
            recomendacion: evaluacion.recomendacion,
            brechas: evaluacion.brechas,
          });
        } catch (error) {
          salida.push({
            desde: enlace.desde,
            hasta: enlace.hasta,
            error: error instanceof Error ? error.message : "No se pudo evaluar",
          });
        }
      }
      return salida;
    });
    return NextResponse.json({
      id: creado.id,
      url: `${origen}/esquema?flujo=${creado.id}`,
      conexiones,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear el esquema";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
