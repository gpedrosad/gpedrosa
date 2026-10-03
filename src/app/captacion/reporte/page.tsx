import type { Metadata } from "next";
import Link from "next/link";
import { armarReporteCaptacion } from "@/lib/captacion-reporte";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Reporte captación",
  robots: { index: false, follow: false },
};

export default async function ReporteCaptacionPage() {
  const reporte = await armarReporteCaptacion();
  const captacion = reporte.brevo?.find((fila) => fila.tag === "captacion");

  return (
    <article className="min-h-screen bg-[#faf9f6] text-neutral-900">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
          <Link href="/" className="text-sm font-medium">
            Gonzalo Pedrosa
          </Link>
          <Link href="/captacion/reporte/texto" className="text-sm underline underline-offset-2">
            Versión texto
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Reporte del funnel
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
          Generado {reporte.generado} (Chile). Ventana Brevo: {reporte.desde} a {reporte.hasta}.
          Página para leer el estado del experimento: leads, envíos, clics y el texto de los
          correos. No indexar.
        </p>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Cómo medir</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700">
            <li>Se juzgan clics y respuestas. No aperturas: Gmail infla el pixel.</li>
            <li>Correo 1: enlace a la guía y responder con 1, 2 o 3.</li>
            <li>Correo 2 y 3: sin enlace. Una línea en el mismo correo.</li>
            <li>Correo 4: enlace a WhatsApp. Escribir la situación.</li>
            <li>
              Con 30 a 40 leads que ya recibieron los 4 correos, menos de 3 a 5 señales
              (respuestas + clics de guía o WhatsApp): el problema es el email, no el anuncio.
            </li>
            <li>Landing: anda si el 20% o más de los clics deja el email. Hoy no se toca.</li>
            <li>Respuestas de Gmail: no hay API. Hay que contarlas a mano.</li>
            <li>Kit de $27 sin checkout. Programa de $250 fuera de este test.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Leads</h2>
          {reporte.errorLeads ? (
            <p className="mt-3 text-base text-red-700">{reporte.errorLeads}</p>
          ) : null}
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="border border-neutral-200 p-3">
              <dt className="text-neutral-500">Total</dt>
              <dd className="mt-1 text-2xl font-semibold">{reporte.leads.total}</dd>
            </div>
            <div className="border border-neutral-200 p-3">
              <dt className="text-neutral-500">Reales</dt>
              <dd className="mt-1 text-2xl font-semibold">{reporte.leads.reales}</dd>
            </div>
            <div className="border border-neutral-200 p-3">
              <dt className="text-neutral-500">Pruebas</dt>
              <dd className="mt-1 text-2xl font-semibold">{reporte.leads.pruebas}</dd>
            </div>
            <div className="border border-neutral-200 p-3">
              <dt className="text-neutral-500">Con los 4 correos</dt>
              <dd className="mt-1 text-2xl font-semibold">{reporte.leads.conLosCuatro}</dd>
            </div>
          </dl>
          <p className="mt-4 text-base leading-7 text-neutral-700">
            Enviados: correo 1 = {reporte.leads.correo1}; correo 2 = {reporte.leads.correo2};
            correo 3 = {reporte.leads.correo3}; correo 4 = {reporte.leads.correo4}. Ángulos
            reales:{" "}
            {Object.entries(reporte.leads.porAngulo)
              .map(([angulo, n]) => `${angulo} ${n}`)
              .join(", ") || "sin datos"}
            .
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-300">
                  <th className="py-2 pr-3 font-medium">Email</th>
                  <th className="py-2 pr-3 font-medium">Prueba</th>
                  <th className="py-2 pr-3 font-medium">Ángulo</th>
                  <th className="py-2 pr-3 font-medium">Fuente</th>
                  <th className="py-2 pr-3 font-medium">Alta</th>
                  <th className="py-2 pr-3 font-medium">C1</th>
                  <th className="py-2 pr-3 font-medium">C2</th>
                  <th className="py-2 pr-3 font-medium">C3</th>
                  <th className="py-2 font-medium">C4</th>
                </tr>
              </thead>
              <tbody>
                {reporte.leads.filas.map((fila) => (
                  <tr key={`${fila.email}-${fila.creado}`} className="border-b border-neutral-200">
                    <td className="py-2 pr-3">{fila.email}</td>
                    <td className="py-2 pr-3">{fila.prueba ? "sí" : "no"}</td>
                    <td className="py-2 pr-3">{fila.angulo}</td>
                    <td className="py-2 pr-3">{fila.source}</td>
                    <td className="py-2 pr-3">{fila.creado}</td>
                    <td className="py-2 pr-3">{fila.correo1 || "—"}</td>
                    <td className="py-2 pr-3">{fila.correo2 || "—"}</td>
                    <td className="py-2 pr-3">{fila.correo3 || "—"}</td>
                    <td className="py-2">{fila.correo4 || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Clics y entrega (Brevo)</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-700">
            Mira clics, no aperturas. Totales tag captacion
            {captacion
              ? `: ${captacion.delivered} entregados, ${captacion.uniqueClicks} clics únicos, ${captacion.clicks} clics.`
              : "."}
          </p>
          {reporte.errorBrevo ? (
            <p className="mt-3 text-base text-red-700">{reporte.errorBrevo}</p>
          ) : null}
          {reporte.brevo ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className="py-2 pr-3 font-medium">Tag</th>
                    <th className="py-2 pr-3 font-medium">Entregados</th>
                    <th className="py-2 pr-3 font-medium">Clics</th>
                    <th className="py-2 pr-3 font-medium">Clics únicos</th>
                    <th className="py-2 pr-3 font-medium">Aperturas (no usar)</th>
                    <th className="py-2 pr-3 font-medium">Rebotes</th>
                    <th className="py-2 font-medium">Bajas</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.brevo.map((fila) => (
                    <tr key={fila.tag} className="border-b border-neutral-200">
                      <td className="py-2 pr-3">{fila.tag}</td>
                      <td className="py-2 pr-3">{fila.delivered}</td>
                      <td className="py-2 pr-3">{fila.clicks}</td>
                      <td className="py-2 pr-3">{fila.uniqueClicks}</td>
                      <td className="py-2 pr-3">{fila.uniqueOpens}</td>
                      <td className="py-2 pr-3">{fila.hardBounces}</td>
                      <td className="py-2">{fila.unsubscribed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Correos actuales</h2>
          {reporte.plantillas.map((plantilla) => (
            <section key={plantilla.paso} className="mt-8">
              <h3 className="text-base font-semibold">
                Correo {plantilla.paso} · {plantilla.tag}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">Asunto: {plantilla.asunto}</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap border border-neutral-200 bg-white p-4 text-sm leading-6">
                {plantilla.texto}
              </pre>
            </section>
          ))}
        </section>
      </main>
    </article>
  );
}
