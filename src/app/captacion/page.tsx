import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadForm from "./LeadForm";
import Rastreo from "./Rastreo";

const TITULO = "Guía gratuita para familiares: 7 decisiones sobre plata, límites y recaídas";
const DESCRIPCION = "Material psicoeducativo elaborado por un psicólogo clínico.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  robots: { index: false, follow: false },
  alternates: { canonical: "/captacion" },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    type: "website",
    url: "https://gpedrosa.cl/captacion",
  },
  twitter: {
    title: TITULO,
    description: DESCRIPCION,
  },
};

const situacion = [
  "Te pide plata para una deuda más, la última.",
  "Prometió que no iba a volver a pasar.",
  "Descubriste mentiras y no sabes qué creerle.",
  "Sientes que eres la única persona que lo sabe.",
];

const decisiones = [
  {
    titulo: "Ayudar o hacerte cargo.",
    texto: "Cómo distinguir cuándo tu ayuda sostiene el problema.",
  },
  {
    titulo: "Prestar o no prestar.",
    texto: "Qué pensar antes de pasar plata o cubrir una deuda, y qué hacer en su lugar.",
  },
  {
    titulo: "Qué límite poner.",
    texto: "Uno que sirva sin convertirte en su policía.",
  },
  {
    titulo: "Creerle o no.",
    texto: "En qué fijarte cuando promete cambiar después de mentiras o recaídas.",
  },
  {
    titulo: "Volver a confiar.",
    texto: "Qué señales permiten hacerlo de a poco, y cuáles todavía no.",
  },
  {
    titulo: "Qué hacer si recae.",
    texto: "Cómo responder sin volver al mismo ciclo de siempre.",
  },
  {
    titulo: "Qué hacer si no quiere ayuda.",
    texto: "Lo que sí puedes hacer tú aunque no lo admita.",
  },
];

const preguntas = [
  {
    q: "¿Alguien más se va a enterar?",
    a: "No. La guía llega solo a tu correo, desde Gonzalo Pedrosa, y tu email no queda guardado en este dispositivo.",
  },
  {
    q: "¿Me van a llenar de correos?",
    a: "No. Después de la guía te escribo sobre este tema, y puedes darte de baja con un clic en cualquier correo.",
  },
  {
    q: "¿Sirve si no admite que tiene un problema?",
    a: "Sí. La guía se centra en cómo puedes ayudar tú, no en convencer a la otra persona.",
  },
  {
    q: "¿Tiene un enfoque religioso o de 12 pasos?",
    a: "No. Es material psicológico y laico. Si un grupo de apoyo te sirve, esta guía lo puede complementar.",
  },
  {
    q: "¿Me va a decir si lo dejo o me quedo?",
    a: "No. La guía no decide por ti. Te ayuda a ordenar cómo ayudar y qué límites poner.",
  },
  {
    q: "¿Reemplaza una terapia?",
    a: "No. Es un primer paso para ordenar decisiones. Si necesitas acompañamiento, puedes consultar con un profesional.",
  },
];

function anguloDe(valor: string | string[] | undefined) {
  const marca = Array.isArray(valor) ? valor[0] : valor;
  return marca === "A" || marca === "C" ? marca : "B";
}

function MiniaturaPdf() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/captacion/guia-portada.svg"
        alt=""
        width={51}
        height={72}
        className="h-[72px] w-[51px] border border-neutral-300 bg-[#f4f1ea] object-cover"
      />
      <p className="text-sm leading-5 text-neutral-700">PDF de 10 páginas · Descarga inmediata</p>
    </div>
  );
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
        <div className="mx-auto flex h-12 w-full max-w-xl items-center px-5 sm:h-14">
          <p className="text-sm font-medium">Gonzalo Pedrosa · Psicólogo clínico</p>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-xl px-5 pt-4 pb-5 sm:pt-10 sm:pb-12">
          <h1 className="text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-4xl sm:leading-tight">
            Ayudar a quien apuesta sin hacerte cargo de todo
          </h1>
          <p className="mt-2.5 text-sm leading-5 text-neutral-700 sm:mt-5 sm:text-base sm:leading-7">
            Guía gratuita en PDF para parejas y familiares de alguien que apuesta. Las 7 decisiones que
            más cuestan: qué responder cuando pide plata, si cubrir una deuda, qué hacer con las
            mentiras y cómo actuar si recae.
          </p>
          <div className="mt-3 sm:mt-6">
            <MiniaturaPdf />
          </div>
          <div className="mt-3 sm:mt-6">
            <LeadForm id="hero" angulo={angulo} />
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <Image
              src="/yo.png"
              alt=""
              width={40}
              height={40}
              sizes="40px"
              className="h-10 w-10 rounded-full object-cover"
            />
            <p className="text-sm text-neutral-700">Gonzalo Pedrosa, psicólogo clínico</p>
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-xl px-5 py-12 sm:py-16">
            <h2 className="text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">
              Querer ayudar y no saber por dónde empezar
            </h2>
            <ul className="mt-6 space-y-2 text-base leading-7 text-neutral-700">
              {situacion.map((linea) => (
                <li key={linea} className="flex gap-2">
                  <span className="text-neutral-400" aria-hidden="true">
                    -
                  </span>
                  <span>{linea}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-lg font-semibold leading-7 text-neutral-900">
              Esta guía no va a hacer que deje de apostar. Eso no depende de ti. Lo que sí depende de
              ti es cómo ayudas, qué límites pones y qué dejas de cubrir.
            </p>
          </div>
        </section>

        <section className="border-t border-neutral-200">
          <div className="mx-auto w-full max-w-xl px-5 py-12 sm:py-16">
            <h2 className="text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">
              Las 7 decisiones que vas a poder tomar con más claridad
            </h2>
            <ol className="mt-6 list-decimal space-y-4 pl-5 text-base leading-7 text-neutral-700">
              {decisiones.map((item) => (
                <li key={item.titulo}>
                  <span className="font-semibold text-neutral-900">{item.titulo}</span> {item.texto}
                </li>
              ))}
            </ol>
            <a
              href="#recibir"
              className="mt-8 inline-flex h-11 items-center justify-center bg-neutral-900 px-5 text-sm font-semibold text-white"
            >
              Recibir la guía gratis
            </a>
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-xl px-5 py-12 sm:py-16">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Así se ve por dentro</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5">
              <img
                src="/captacion/guia-portada.svg"
                alt="Portada de la guía gratuita"
                width={420}
                height={594}
                className="aspect-[210/297] w-full border border-neutral-300 bg-[#f4f1ea] object-cover"
              />
              <img
                src="/captacion/guia-interior.svg"
                alt="Página interior de la guía: las 7 decisiones"
                width={420}
                height={594}
                className="aspect-[210/297] w-full border border-neutral-300 bg-[#faf9f6] object-cover"
              />
            </div>
            <p className="mt-3 text-sm text-neutral-600">PDF de 10 páginas.</p>
          </div>
        </section>

        <section className="border-t border-neutral-200">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-start sm:gap-8 sm:py-16">
            <Image
              src="/yo.png"
              alt="Gonzalo Pedrosa"
              width={160}
              height={160}
              sizes="160px"
              className="h-40 w-40 shrink-0 object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">Quién escribe esta guía</h2>
              <p className="mt-4 text-base leading-7 text-neutral-700">
                Soy Gonzalo Pedrosa, psicólogo clínico. Escribí esta guía para parejas y familiares que
                quieren ayudar a alguien que apuesta y no saben por dónde empezar. Reúne principios
                psicológicos y herramientas prácticas para acompañar sin asumir la responsabilidad por
                la recuperación de otra persona.
              </p>
              <p className="mt-4 text-base leading-7 text-neutral-700">
                Es un enfoque psicológico y profesional, sin contenido religioso. Puede complementar un
                grupo de apoyo, no lo reemplaza.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-xl px-5 py-12 sm:py-16">
            <p className="text-base leading-7 text-neutral-700">
              Para ti si eres pareja, hija o hijo, madre, padre o alguien cercano a una persona que
              apuesta. No necesitas que la otra persona admita el problema.
            </p>
            <p className="mt-4 text-base leading-7 text-neutral-700">
              No es para diagnosticar a nadie ni reemplaza un tratamiento psicológico. Es material
              psicoeducativo.
            </p>
          </div>
        </section>

        <section className="border-t border-neutral-200">
          <div className="mx-auto w-full max-w-xl px-5 py-12 sm:py-16">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Preguntas frecuentes</h2>
            <div className="mt-6">
              {preguntas.map((item) => (
                <details key={item.q} className="border-b border-neutral-200">
                  <summary className="flex min-h-11 cursor-pointer items-center py-3 text-base font-semibold leading-6">
                    {item.q}
                  </summary>
                  <p className="pb-4 text-base leading-7 text-neutral-700">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="recibir" className="scroll-mt-4 border-t border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-md px-5 py-12 sm:py-16">
            <h2 className="text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">
              No necesitas tener todas las respuestas hoy.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-700">
              Empieza por las decisiones que sí dependen de ti.
            </p>
            <div className="mt-8">
              <LeadForm id="final" angulo={angulo} />
            </div>
          </div>
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
