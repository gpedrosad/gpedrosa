import type { Metadata } from "next";
import { conFlujo, flujos, leerEsquema } from "@/lib/esquema";
import EsquemaEditor from "./EsquemaEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Esquema",
  robots: { index: false, follow: false },
};

export default async function EsquemaPage({
  searchParams,
}: {
  searchParams: Promise<{ flujo?: string }>;
}) {
  const { flujo } = await searchParams;
  const lista = await flujos();
  const id =
    flujo && lista.some((item) => item.id === flujo) ? flujo : (lista[0]?.id ?? "");
  const esquema = id
    ? await conFlujo(id, () => leerEsquema())
    : { nodos: [], enlaces: [] };
  return <EsquemaEditor esquema={esquema} flujoId={id} flujos={lista} />;
}
