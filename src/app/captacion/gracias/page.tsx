import type { Metadata } from "next";
import Link from "next/link";
import Rastreo from "../Rastreo";

export const metadata: Metadata = {
  title: "Kit práctico para familiares",
  description:
    "Entender qué hacer es el primer paso. Aplicarlo cuando vuelve a pedir dinero, aparece otra mentira o se incumple un límite suele ser más difícil.",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900">
      <Rastreo evento="captacion_gracias" />
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-5">
          <Link href="/" className="text-sm font-medium">
            Gonzalo Pedrosa
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 py-16 sm:py-24">
        <p className="text-lg leading-8 text-neutral-800 sm:text-xl">
          Entender qué hacer es el primer paso. Aplicarlo cuando vuelve a pedir dinero, aparece
          otra mentira o se incumple un límite suele ser más difícil.
        </p>

        <section className="mt-12 border border-neutral-300 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">
            Kit práctico para familiares — $27
          </h1>
          <dl className="mt-6 space-y-3 text-base leading-7 text-neutral-700">
            <div>
              <dt className="font-medium text-neutral-900">PDF gratis</dt>
              <dd>qué decisiones tengo que tomar.</dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">Kit</dt>
              <dd>cómo ejecutar esas decisiones.</dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gonzalo Pedrosa</p>
          <div className="flex gap-5">
            <Link href="/privacidad" className="hover:text-neutral-900">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-neutral-900">
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
