"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { guardarEventos, leerEventos, type EventoSimulado } from "../eventos";

const ANUNCIOS = [
  {
    id: "A" as const,
    angulo: "general",
    linea: "Cuando las apuestas empiezan a afectar a una familia.",
    destino: "/captacion?a=A",
  },
  {
    id: "B" as const,
    angulo: "dinero",
    linea: "Ayudar económicamente no siempre significa ayudar.",
    destino: "/captacion?a=B",
  },
  {
    id: "C" as const,
    angulo: "confianza",
    linea: "Apuestas, deudas y promesas de cambio.",
    destino: "/captacion?a=C",
  },
];

const PRECIO_KIT = 27;

type Veredicto = "Anda" | "Seguir midiendo" | "No anda" | "Todavía no";

function tasa(parte: number, total: number) {
  if (!total) return null;
  return parte / total;
}

function porcentaje(valor: number | null) {
  if (valor === null) return "—";
  return `${(valor * 100).toFixed(1)}%`;
}

function plata(valor: number) {
  return `$${valor.toFixed(2)}`;
}

function veredicto(opts: {
  muestra: boolean;
  anda: boolean;
  borde?: boolean;
}): Veredicto {
  if (!opts.muestra) return "Todavía no";
  if (opts.anda) return "Anda";
  if (opts.borde) return "Seguir midiendo";
  return "No anda";
}

function tono(estado: Veredicto) {
  if (estado === "Anda") return "text-emerald-800";
  if (estado === "No anda") return "text-red-800";
  if (estado === "Seguir midiendo") return "text-amber-800";
  return "text-neutral-500";
}

export default function Simulador() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [angulo, setAngulo] = useState<"A" | "B" | "C">("A");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [eventos, setEventos] = useState<EventoSimulado[]>(() => leerEventos());
  const [metricas, setMetricas] = useState({
    impresiones: "",
    clics: "",
    leads: "",
    vistasKit: "",
    compras: "",
    gasto: "",
  });

  const juicio = useMemo(() => {
    const n = (valor: string) => Number(valor) || 0;
    const impresiones = n(metricas.impresiones);
    const clics = n(metricas.clics);
    const leads = n(metricas.leads);
    const vistasKit = n(metricas.vistasKit);
    const compras = n(metricas.compras);
    const gasto = n(metricas.gasto);
    const ctr = tasa(clics, impresiones);
    const landing = tasa(leads, clics);
    const kit = tasa(compras, vistasKit || leads);
    const cpaKit = compras ? gasto / compras : null;
    const ingresos = compras * PRECIO_KIT;

    return {
      ctr,
      landing,
      kit,
      cpaLead: leads ? gasto / leads : null,
      cpaKit,
      ingresos,
      roas: gasto ? ingresos / gasto : null,
      pasos: [
        {
          paso: "1. Ad → clic",
          espera: "Problema consciente. El ángulo nombra una situación real. La gente abre la landing de las 7 decisiones, no el Kit.",
          barra: "Anda desde 1% de CTR. Con 1.000 impresiones, si un ángulo queda a la mitad o menos del mejor, se corta. Si nadie cliquea, no se toca la landing.",
          valor: porcentaje(ctr),
          estado: veredicto({
            muestra: impresiones >= 1000,
            anda: (ctr ?? 0) >= 0.01,
            borde: (ctr ?? 0) >= 0.007,
          }),
        },
        {
          paso: "2. Clic → landing",
          espera: "Misma promesa: 7 decisiones importantes. Quien llega reconoce el anuncio.",
          barra: "Se juzga junto al email. CTR bien y email bajo: la landing rompió la promesa. Los dos bajos: el ángulo no era el problema correcto.",
          valor: ctr !== null && landing !== null ? "se lee con el paso 3" : "—",
          estado: veredicto({
            muestra: clics >= 80,
            anda: (ctr ?? 0) >= 0.01 && (landing ?? 0) >= 0.2,
            borde: (landing ?? 0) >= 0.1,
          }),
        },
        {
          paso: "3. Landing → email",
          espera: "Solución consciente. El único trabajo de la landing: un email a cambio de la guía. No vende un método.",
          barra: "Anda desde 20% de los clics. 10–20%: seguir. Menos de 10% con 80 clics: no anda. No se pone el Kit en la landing para salvar esto.",
          valor: porcentaje(landing),
          estado: veredicto({
            muestra: clics >= 80,
            anda: (landing ?? 0) >= 0.2,
            borde: (landing ?? 0) >= 0.1,
          }),
        },
        {
          paso: "4. Email → thank-you",
          espera: "Quien dejó el email ve el Kit en /captacion/gracias.",
          barra: "Si el formulario no abre la thank-you, es un fallo técnico. No se juzga la oferta.",
          valor: leads && vistasKit ? porcentaje(tasa(vistasKit, leads)) : leads ? "el envío tiene que abrir la thank-you" : "—",
          estado: (leads === 0
            ? "Todavía no"
            : vistasKit === 0
              ? "No anda"
              : (vistasKit / leads) >= 0.9
                ? "Anda"
                : "Seguir midiendo") as Veredicto,
        },
        {
          paso: "5. Thank-you → Kit $27",
          espera: "Solución consciente → producto consciente. PDF: qué decisiones tomar. Kit: cómo ejecutarlas.",
          barra: "Anda desde 3% de las vistas, con CPA del Kit por debajo de $27. Menos de 1% con 80 vistas: el salto no anda. Sin checkout, este paso no se declara andando.",
          valor: kit === null ? "—" : `${porcentaje(kit)} · CPA ${cpaKit === null ? "—" : plata(cpaKit)}`,
          estado: veredicto({
            muestra: (vistasKit || leads) >= 80,
            anda: (kit ?? 0) >= 0.03 && (cpaKit === null || cpaKit < PRECIO_KIT),
            borde: (kit ?? 0) >= 0.01,
          }),
        },
      ],
    };
  }, [metricas]);

  async function recorrer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnviando(true);
    setMensaje("");
    try {
      const response = await fetch("/api/captacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, angulo, resource: "7-decisiones", simular: true }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "No se pudo abrir el flujo.");
      const siguientes = [
        {
          t: new Date().toISOString(),
          evento: "captacion_email",
          angulo,
          simulado: true,
        },
        ...leerEventos(),
      ].slice(0, 50);
      guardarEventos(siguientes);
      setEventos(siguientes);
      router.push("/captacion/gracias");
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo abrir el flujo.");
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-14">
      <section>
        <h2 className="text-xl font-semibold tracking-[-0.02em]">A dónde apunta cada ad</h2>
        <p className="mt-3 text-base leading-7 text-neutral-700">
          Los tres anuncios van a la misma landing. Solo cambia el ángulo. El Kit no se juzga acá.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-300">
                <th className="py-2 pr-3 font-medium">Ad</th>
                <th className="py-2 pr-3 font-medium">Ángulo</th>
                <th className="py-2 pr-3 font-medium">El ad dice</th>
                <th className="py-2 font-medium">Apunta a</th>
              </tr>
            </thead>
            <tbody>
              {ANUNCIOS.map((ad) => (
                <tr key={ad.id} className="border-b border-neutral-200 align-top">
                  <td className="py-3 pr-3 font-medium">{ad.id}</td>
                  <td className="py-3 pr-3">{ad.angulo}</td>
                  <td className="py-3 pr-3 text-neutral-700">{ad.linea}</td>
                  <td className="py-3">
                    <Link href={ad.destino} className="underline underline-offset-2">
                      {ad.destino}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-[-0.02em]">Qué esperamos en cada paso</h2>
        <p className="mt-3 text-base leading-7 text-neutral-700">
          Un paso no se usa para tapar el anterior. Si el ad no anda, no se reescribe la landing. Si
          el email no sale, no se pone el Kit en el anuncio. El de $250 no se mide acá.
        </p>
        <div className="mt-6 space-y-4">
          {juicio.pasos.map((paso) => (
            <article key={paso.paso} className="border border-neutral-300 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold">{paso.paso}</h3>
                <p className={`text-sm font-semibold ${tono(paso.estado)}`}>{paso.estado}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{paso.espera}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{paso.barra}</p>
              <p className="mt-3 text-sm text-neutral-500">Con estos números: {paso.valor}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-[-0.02em]">Cargar números y decidir</h2>
        <p className="mt-3 text-base leading-7 text-neutral-700">
          Los umbrales de arriba se aplican a estos datos. “Todavía no” significa que falta muestra.
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["impresiones", "Impresiones del ad"],
                ["clics", "Clics a la landing"],
                ["leads", "Emails"],
                ["vistasKit", "Vistas de la thank-you"],
                ["compras", "Compras del Kit $27"],
                ["gasto", "Gasto en ads"],
              ] as const
            ).map(([clave, etiqueta]) => (
              <label key={clave} className="block text-sm">
                {etiqueta}
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={metricas[clave]}
                  onChange={(event) =>
                    setMetricas((actual) => ({ ...actual, [clave]: event.target.value }))
                  }
                  className="mt-1 h-11 w-full border border-neutral-300 bg-white px-3 outline-none focus:border-neutral-900"
                />
              </label>
            ))}
          </div>
          <dl className="space-y-3 border border-neutral-300 bg-white p-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt>CPA email</dt>
              <dd className="font-medium">{juicio.cpaLead === null ? "—" : plata(juicio.cpaLead)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>CPA Kit</dt>
              <dd className="font-medium">{juicio.cpaKit === null ? "—" : plata(juicio.cpaKit)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Ingresos Kit</dt>
              <dd className="font-medium">{plata(juicio.ingresos)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>ROAS</dt>
              <dd className="font-medium">{juicio.roas === null ? "—" : `${juicio.roas.toFixed(2)}x`}</dd>
            </div>
            <p className="pt-2 text-neutral-600">
              El Kit anda en plata si el CPA queda por debajo de $27.
            </p>
          </dl>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-[-0.02em]">Ver el flujo con cualquier email</h2>
        <p className="mt-3 text-base leading-7 text-neutral-700">
          Para recorrer ad → landing → thank-you y ver si la promesa se sostiene.
        </p>
        <form onSubmit={recorrer} className="mt-6 max-w-md space-y-3">
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="cualquier@email.com"
              className="mt-1 h-12 w-full border border-neutral-300 bg-white px-3 text-base outline-none focus:border-neutral-900"
            />
          </label>
          <label className="block text-sm font-medium">
            Ángulo del ad
            <select
              value={angulo}
              onChange={(event) => setAngulo(event.target.value as "A" | "B" | "C")}
              className="mt-1 h-12 w-full border border-neutral-300 bg-white px-3 text-base outline-none focus:border-neutral-900"
            >
              {ANUNCIOS.map((ad) => (
                <option key={ad.id} value={ad.id}>
                  {ad.id} — {ad.angulo}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/captacion?a=${angulo}`}
              className="flex h-12 items-center justify-center border border-neutral-900 px-4 text-sm font-semibold"
            >
              Ver la landing
            </Link>
            <button
              type="submit"
              disabled={enviando}
              className="flex h-12 items-center justify-center bg-neutral-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {enviando ? "Abriendo…" : "Ir a la thank-you"}
            </button>
          </div>
          {mensaje ? <p className="text-sm text-red-700">{mensaje}</p> : null}
        </form>
      </section>

      {eventos.length > 0 ? (
        <section>
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Recorridos de este navegador</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700">
            {eventos.slice(0, 12).map((evento) => (
              <li key={`${evento.t}-${evento.evento}-${evento.angulo}`}>
                {evento.evento === "captacion_kit" ? "Kit $27" : "Email"} · ad {evento.angulo}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
