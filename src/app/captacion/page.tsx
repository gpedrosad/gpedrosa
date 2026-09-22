import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Captación",
  robots: { index: false, follow: false },
};

const contenido = {
  hero: {
    headline: "",
    subheadline: "",
    visual: "",
    cta: "",
  },
  problema: {
    situaciones: "",
    paraQuien: "",
  },
  beneficios: {
    concretos: "",
    aprendizajes: "",
  },
  recurso: {
    formato: "",
    incluye: "",
    comoSeRecibe: "",
  },
  autoridad: {
    quien: "",
    credenciales: "",
    motivo: "",
  },
  ctaFinal: {
    propuesta: "",
    formulario: "",
    boton: "",
  },
  footer: {
    disclaimer: "",
  },
};

function Campo({
  valor,
  etiqueta,
  as: Tag = "p",
  className = "",
}: {
  valor: string;
  etiqueta: string;
  as?: "p" | "h1" | "h2";
  className?: string;
}) {
  const vacio = !valor.trim();
  return (
    <Tag
      className={
        vacio
          ? `rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-400 ${className}`
          : className
      }
    >
      {vacio ? etiqueta : valor}
    </Tag>
  );
}

export default function CaptacionPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-6 py-16">
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Campo
              as="h1"
              valor={contenido.hero.headline}
              etiqueta="Headline"
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
            />
            <Campo
              valor={contenido.hero.subheadline}
              etiqueta="Subheadline"
              className="text-lg text-neutral-600"
            />
            <a
              href="#cta"
              className="mt-2 inline-flex h-12 w-fit items-center rounded-full bg-black px-6 text-sm font-medium text-white"
            >
              {contenido.hero.cta.trim() || "CTA principal"}
            </a>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 text-center text-sm text-neutral-400">
            {contenido.hero.visual.trim() || "Visual / mockup"}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Campo
            valor={contenido.problema.situaciones}
            etiqueta="Situaciones o síntomas reconocibles"
          />
          <Campo
            valor={contenido.problema.paraQuien}
            etiqueta="Para quién es el recurso"
          />
        </section>

        <section className="flex flex-col gap-4">
          <Campo
            valor={contenido.beneficios.concretos}
            etiqueta="Beneficios concretos"
          />
          <Campo
            valor={contenido.beneficios.aprendizajes}
            etiqueta="Contenido / aprendizajes principales"
          />
        </section>

        <section className="flex flex-col gap-4">
          <Campo valor={contenido.recurso.formato} etiqueta="Formato" />
          <Campo valor={contenido.recurso.incluye} etiqueta="Qué incluye" />
          <Campo
            valor={contenido.recurso.comoSeRecibe}
            etiqueta="Cómo se recibe"
          />
        </section>

        <section className="flex flex-col gap-4">
          <Campo valor={contenido.autoridad.quien} etiqueta="Quién lo creó" />
          <Campo
            valor={contenido.autoridad.credenciales}
            etiqueta="Credenciales relevantes"
          />
          <Campo
            valor={contenido.autoridad.motivo}
            etiqueta="Motivo por el que existe"
          />
        </section>

        <section id="cta" className="flex flex-col gap-4">
          <Campo
            as="h2"
            valor={contenido.ctaFinal.propuesta}
            etiqueta="Repetición de la propuesta"
            className="text-3xl font-semibold tracking-tight"
          />
          <form className="flex max-w-md flex-col gap-3">
            <div className="rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-sm text-neutral-400">
              {contenido.ctaFinal.formulario.trim() || "Formulario"}
            </div>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white"
            >
              {contenido.ctaFinal.boton.trim() || "Botón"}
            </button>
          </form>
        </section>
      </main>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-neutral-500">
          {contenido.footer.disclaimer.trim() ? (
            <p>{contenido.footer.disclaimer}</p>
          ) : null}
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-black">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-black">
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
