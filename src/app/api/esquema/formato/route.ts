import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origen = new URL(request.url).origin;
  const archivo = await fs.readFile(
    path.join(process.cwd(), "marketing", "FORMATO_FLUJO.md"),
    "utf8"
  );

  return new NextResponse(archivo.replaceAll("{ORIGEN}", origen), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
