import type { Metadata } from "next";
import Link from "next/link";
import Simulador from "./Simulador";

export const metadata: Metadata = {
  title: "Métricas | captación",
  robots: { index: false, follow: false },
};

export default function MetricasPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
          <Link href="/" className="text-sm font-medium">
            Gonzalo Pedrosa
          </Link>
          <Link href="/captacion" className="text-sm underline underline-offset-2">
            Landing
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Cómo juzgar el funnel
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
          Cada paso se decide solo. Primero se mira el nivel de conciencia que apunta esa pieza.
          El ad no pide una compra. El Kit de $27 se juzga después del email. El programa de $250
          no entra en este test.
        </p>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Niveles de conciencia</h2>
          <p className="mt-3 text-base leading-7 text-neutral-700">
            No se salta un nivel. El anuncio y la landing no venden el Kit ni el programa. La
            thank-you cambia el nivel: ya se presentó el enfoque, recién ahí se puede decir que
            aplicarlo es más difícil.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-300">
                  <th className="py-2 pr-3 font-medium">Pieza</th>
                  <th className="py-2 pr-3 font-medium">De → a</th>
                  <th className="py-2 font-medium">Qué promete</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200 align-top">
                  <td className="py-3 pr-3">Ad + landing + PDF</td>
                  <td className="py-3 pr-3">Problema consciente → solución consciente</td>
                  <td className="py-3 text-neutral-700">7 decisiones importantes, gratis</td>
                </tr>
                <tr className="border-b border-neutral-200 align-top">
                  <td className="py-3 pr-3">Thank-you · Kit $27</td>
                  <td className="py-3 pr-3">Solución consciente → producto consciente</td>
                  <td className="py-3 text-neutral-700">
                    PDF: qué decisiones tomar. Kit: cómo ejecutarlas.
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="py-3 pr-3">Programa $250</td>
                  <td className="py-3 pr-3">Producto consciente → compra</td>
                  <td className="py-3 text-neutral-700">No se menciona en este test</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <h3 className="text-base font-semibold">Qué hace el anuncio</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-7 text-neutral-700">
              <li>Existe este problema.</li>
              <li>Hay decisiones que quizás estás manejando por intuición.</li>
              <li>Existe una forma más estructurada de abordarlas.</li>
              <li>Te explico las 7 principales gratis.</li>
            </ol>
            <p className="mt-4 text-base leading-7 text-neutral-700">
              Eso es problema consciente → solución consciente. La landing no vende un método.
              Aumenta conciencia sobre la solución y pide el email. Ad, landing y PDF dicen lo
              mismo: 7 decisiones importantes.
            </p>
          </div>
          <div className="mt-8">
            <h3 className="text-base font-semibold">PostHog</h3>
            <p className="mt-3 text-base leading-7 text-neutral-700">
              El clic del anuncio se mira en Meta. En el sitio, PostHog registra el resto. No se
              manda el email. Filtrar <code>simulado = true</code> para no mezclar pruebas.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className="py-2 pr-3 font-medium">Evento</th>
                    <th className="py-2 pr-3 font-medium">Paso</th>
                    <th className="py-2 font-medium">Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 pr-3"><code>captacion_landing</code></td>
                    <td className="py-3 pr-3">Clic → landing</td>
                    <td className="py-3">Problema → solución</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 pr-3"><code>captacion_email</code></td>
                    <td className="py-3 pr-3">Landing → email</td>
                    <td className="py-3">Solución consciente</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 pr-3"><code>captacion_gracias</code></td>
                    <td className="py-3 pr-3">Email → thank-you</td>
                    <td className="py-3">Solución → producto</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-3"><code>captacion_kit</code></td>
                    <td className="py-3 pr-3">Thank-you → Kit $27</td>
                    <td className="py-3">Cuando exista checkout</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="mt-14">
          <Simulador />
        </div>
      </main>
    </div>
  );
}
