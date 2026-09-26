import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadForm from "./LeadForm";
import Rastreo from "./Rastreo";

export const metadata: Metadata = {
  title: "Guía gratuita para familiares | 7 decisiones",
  description:
    "Una guía gratuita con 7 decisiones importantes sobre dinero, límites, confianza y recaídas para familiares y personas cercanas.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Qué hacer cuando las apuestas empiezan a afectar a una familia",
    description:
      "Una guía gratuita con 7 decisiones importantes sobre dinero, límites, confianza y recaídas.",
    type: "website",
  },
};

const aprendizajes = [
  "Cómo diferenciar ayudar de hacerse cargo de las consecuencias.",
  "Qué considerar antes de prestar dinero o cubrir una deuda.",
  "Por qué un límite útil no consiste en intentar controlar a la otra persona.",
  "En qué fijarse cuando existen promesas de cambio después de mentiras o recaídas.",
  "Qué aspectos pueden ayudar a reconstruir la confianza gradualmente.",
  "Cómo pensar una recaída sin volver inmediatamente a las mismas dinámicas.",
  "Qué puede hacer la familia cuando la persona no quiere buscar ayuda.",
];

function Mockup() {
  return (
    <div className="border border-neutral-300 bg-[#f4f1ea] p-8 shadow-sm sm:p-10">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-neutral-500">GUÍA GRATUITA</p>
      <h2 className="mt-8 text-[1.65rem] font-semibold leading-[1.15] tracking-[-0.03em] text-neutral-900 sm:text-[1.85rem]">
        Cuando las apuestas
        <br />
        empiezan a afectar
        <br />a una familia
      </h2>
      <p className="mt-6 max-w-[16rem] text-sm leading-6 text-neutral-700">
        7 decisiones importantes sobre dinero, límites, confianza y recaídas
      </p>
      <div className="mt-10 border-t border-neutral-300 pt-4 text-xs leading-5 text-neutral-600">
        Elaborada por psicólogo clínico
      </div>
    </div>
  );
}

function anguloDe(valor: string | string[] | undefined) {
  const marca = Array.isArray(valor) ? valor[0] : valor;
  return marca === "B" || marca === "C" ? marca : "A";
}

export default async function CaptacionPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string | string[] }>;
}) {
  const { a } = await searchParams;
  const angulo = anguloDe(a);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900">
      <Rastreo evento="captacion_landing" angulo={angulo} />
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-5">
          <Link href="/" className="text-sm font-medium">
            Gonzalo Pedrosa
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-14 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
              Qué hacer cuando las apuestas empiezan a afectar a una familia
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-700 sm:text-lg">
              Una guía gratuita con 7 decisiones importantes sobre dinero, límites, confianza y
              recaídas para familiares y personas cercanas.
            </p>
            <div className="mt-8 max-w-md">
              <LeadForm id="hero" angulo={angulo} />
            </div>
            <p className="mt-3 text-sm text-neutral-600">
              Material elaborado por psicólogo clínico. Acceso inmediato.
            </p>
          </div>
          <Mockup />
        </section>

        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:py-16">
            <h2 className="text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">
              Cuando intentar ayudar empieza a generar más preguntas que respuestas
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-neutral-700">
              <p>
                Frente a un problema de apuestas, saber que “hay que poner límites” o que “la
                persona necesita ayuda” no siempre resuelve las decisiones cotidianas.
              </p>
              <p>
                ¿Qué ocurre cuando pide dinero nuevamente? ¿Conviene cubrir una deuda? ¿Cómo
                distinguir una promesa de un cambio real? ¿Qué hacer si aparece otra recaída?
              </p>
              <p>
                La guía organiza estas situaciones para ayudarte a entender qué aspectos están bajo
                el control de la familia y cuáles dependen de la persona que apuesta.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200">
          <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:py-16">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">En esta guía encontrarás:</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-7 text-neutral-700">
              {aprendizajes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              href="#recibir"
              className="mt-8 inline-flex h-12 items-center justify-center bg-neutral-900 px-5 text-sm font-semibold tracking-wide text-white"
            >
              QUIERO RECIBIR LA GUÍA
            </a>
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:py-16">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Esta guía puede ser útil para:</h2>
            <p className="mt-5 text-base leading-7 text-neutral-700">
              Familiares, parejas y personas cercanas que están enfrentando las consecuencias de
              las apuestas de alguien importante para ellos y necesitan ordenar qué hacer frente al
              dinero, los límites, la confianza y posibles recaídas.
            </p>
            <p className="mt-5 text-sm leading-6 text-neutral-600">
              No es una guía para diagnosticar a otra persona ni sustituye un tratamiento
              psicológico. Es material psicoeducativo dirigido a familiares y personas cercanas.
            </p>
          </div>
        </section>

        <section className="border-t border-neutral-200">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-start sm:gap-10 sm:py-16">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-neutral-200">
              <Image src="/yo.png" alt="Gonzalo Pedrosa" fill className="object-cover" />
            </div>
            <div>
              <p className="text-lg font-semibold">Elaborada por Gonzalo Pedrosa</p>
              <p className="mt-1 text-sm text-neutral-600">Psicólogo clínico.</p>
              <p className="mt-4 text-base leading-7 text-neutral-700">
                La guía reúne principios psicológicos y herramientas prácticas para ayudar a
                familiares a comprender su propio rol frente a problemas relacionados con las
                apuestas, sin asumir la responsabilidad por la recuperación de otra persona.
              </p>
            </div>
          </div>
        </section>

        <section id="recibir" className="border-t border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-md px-5 py-14 sm:py-16">
            <h2 className="text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">
              No necesitas tener todas las respuestas hoy.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-700">
              Empieza por entender las decisiones que sí están bajo tu control.
            </p>
            <p className="mt-2 text-base leading-7 text-neutral-700">
              Recibe gratis la guía de 7 decisiones para familiares.
            </p>
            <div className="mt-8">
              <LeadForm id="final" angulo={angulo} />
            </div>
          </div>
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
