import type { Metadata } from "next";
import Link from "next/link";
import { CONTEXTO_CAPTACION } from "@/lib/captacion-contexto";
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
          Briefing del experimento para sugerir el siguiente paso. No indexar.
        </p>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Pedido al lector</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700">
            {CONTEXTO_CAPTACION.pedidoAlLector.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Estado del experimento</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700">
            <li>{CONTEXTO_CAPTACION.estado.experimento}. {CONTEXTO_CAPTACION.estado.canal}.</li>
            <li>Promesa: {CONTEXTO_CAPTACION.estado.promesaUnica}.</li>
            <li>USD {CONTEXTO_CAPTACION.estado.presupuestoUsdDia} / día. Un anuncio activo. No hay A/B/C en Meta.</li>
            <li>Sin checkout del Kit. El programa de $250 no entra.</li>
            <li>{CONTEXTO_CAPTACION.estado.remitente}. {CONTEXTO_CAPTACION.estado.replyTo}</li>
            <li>WhatsApp {CONTEXTO_CAPTACION.estado.whatsapp}. {CONTEXTO_CAPTACION.estado.cron}</li>
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Meta</h2>
          <p className="mt-3 text-base leading-7 text-neutral-700">
            {CONTEXTO_CAPTACION.metaObservado.fuente}. Fecha {CONTEXTO_CAPTACION.metaObservado.fecha}:
            {" "}{CONTEXTO_CAPTACION.metaObservado.visitasLanding} visitas,{" "}
            {CONTEXTO_CAPTACION.metaObservado.leads} leads,{" "}
            {CONTEXTO_CAPTACION.metaObservado.conversionAprox}. {CONTEXTO_CAPTACION.metaObservado.nota}
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Respuestas</h2>
          <p className="mt-3 text-base leading-7 text-neutral-700">
            Correo 1: {CONTEXTO_CAPTACION.respuestasObservadas.respuestasCorreo1Numero}.
            Correo 2: {CONTEXTO_CAPTACION.respuestasObservadas.respuestasCorreo2Linea}.
            Correo 3: {CONTEXTO_CAPTACION.respuestasObservadas.respuestasCorreo3Linea}.
            WhatsApp: {CONTEXTO_CAPTACION.respuestasObservadas.whatsapp}.{" "}
            {CONTEXTO_CAPTACION.respuestasObservadas.nota}
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Anuncio y ángulos</h2>
          <p className="mt-3 text-base leading-7 text-neutral-700">
            Headline: {CONTEXTO_CAPTACION.anuncio.headline}. CTA: {CONTEXTO_CAPTACION.anuncio.cta}.
          </p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap border border-neutral-200 bg-white p-4 text-sm leading-6">
            {CONTEXTO_CAPTACION.anuncio.primaryText}
          </pre>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700">
            {CONTEXTO_CAPTACION.angulosDisenados.map((ad) => (
              <li key={ad.id}>
                {ad.id} · {ad.angulo}: {ad.linea} ({ad.url})
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Landing</h2>
          <p className="mt-3 text-base leading-7 text-neutral-700">
            {CONTEXTO_CAPTACION.landing.headline}
          </p>
          <p className="mt-2 text-base leading-7 text-neutral-700">
            {CONTEXTO_CAPTACION.landing.subheadline}
          </p>
          <p className="mt-2 text-base leading-7 text-neutral-700">
            CTA: {CONTEXTO_CAPTACION.landing.cta}. {CONTEXTO_CAPTACION.landing.formulario}
          </p>
          <p className="mt-4 text-base font-medium">{CONTEXTO_CAPTACION.landing.destacado}</p>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-base leading-7 text-neutral-700">
            {CONTEXTO_CAPTACION.landing.decisiones.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Thank-you y umbrales</h2>
          <p className="mt-3 text-base leading-7 text-neutral-700">
            {CONTEXTO_CAPTACION.thankyou.h1} {CONTEXTO_CAPTACION.thankyou.kit}.{" "}
            {CONTEXTO_CAPTACION.thankyou.checkout}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700">
            {CONTEXTO_CAPTACION.umbrales.map((item) => (
              <li key={item}>{item}</li>
            ))}
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
