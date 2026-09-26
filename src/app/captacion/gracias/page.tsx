import type { Metadata } from "next";
import Link from "next/link";
import Rastreo from "../Rastreo";

export const metadata: Metadata = {
  title: "Listo. Tu guía va en camino.",
  description: "La guía se envía por correo. Material psicoeducativo elaborado por un psicólogo clínico.",
  robots: { index: false, follow: false },
  twitter: {
    title: "Listo. Tu guía va en camino.",
  },
};

// TODO: URL del PDF
const PDF_URL = "";

// TODO: link de pago del kit
const KIT_PAGO_URL = "";

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900">
      <Rastreo evento="captacion_gracias" />
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-12 w-full max-w-xl items-center px-5 sm:h-14">
          <p className="text-sm font-medium">Gonzalo Pedrosa · Psicólogo clínico</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl px-5 py-12 sm:py-16">
        <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
          Listo. Tu guía va en camino.
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Te la enviamos por correo desde Gonzalo Pedrosa. Si no la ves en 5 minutos, revisa
          Promociones o Spam.
        </p>
        <a
          href={PDF_URL || "#pdf"}
          className="mt-8 inline-flex h-11 w-full items-center justify-center bg-neutral-900 px-5 text-sm font-semibold text-white sm:w-auto"
        >
          Descargar ahora
        </a>

        <section className="mt-14 border-t border-neutral-200 pt-12">
          <p className="text-base leading-7 text-neutral-700">
            Entender qué hacer es el primer paso. Aplicarlo cuando vuelve a pedir plata, aparece otra
            mentira o se incumple un límite suele ser más difícil.
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-[-0.02em]">
            Kit práctico para familiares
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-700">
            La guía gratis te ayuda a ver qué decisiones tomar. El kit te enseña cómo llevarlas a la
            práctica.
          </p>
          <p className="mt-4 text-lg font-semibold">$27.990 CLP</p>
          <a
            href={KIT_PAGO_URL || "#kit"}
            className="mt-6 inline-flex h-11 w-full items-center justify-center bg-neutral-900 px-5 text-sm font-semibold text-white sm:w-auto"
          >
            Comprar el kit
          </a>
        </section>
      </main>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto w-full max-w-xl px-5 py-8 text-sm leading-6 text-neutral-600">
          <p>
            © 2026 Gonzalo Pedrosa, psicólogo clínico ·{" "}
            <Link href="/privacidad" prefetch={false} className="hover:text-neutral-900">
              Privacidad
            </Link>
            {" · "}
            <Link href="/terminos" prefetch={false} className="hover:text-neutral-900">
              Términos
            </Link>
          </p>
          <p className="mt-3">
            Si hay riesgo inmediato para alguien, contacta a los servicios de emergencia de tu país.
          </p>
        </div>
      </footer>
    </div>
  );
}
