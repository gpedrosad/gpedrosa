import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadForm from "./LeadForm";
import Rastreo from "./Rastreo";

const TITULO = "Guía gratuita para familiares: 7 decisiones sobre plata, límites y recaídas";
const DESCRIPCION = "Material psicoeducativo elaborado por un psicólogo.";

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
  twitter: { title: TITULO, description: DESCRIPCION },
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

function HandUnderline() {
  return (
    <svg className="capture-hand-underline" viewBox="0 0 320 28" preserveAspectRatio="none" aria-hidden="true">
      <path d="M5 20C86 8 191 10 315 17C267 15 226 18 181 22" />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <path d="M40 4c2 22 13 34 36 36-23 2-34 14-36 36-2-22-13-34-36-36 23-2 34-14 36-36Z" />
    </svg>
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
    <div className="capture-shell">
      <Rastreo evento="captacion_landing" angulo={angulo} />

      <section className="capture-hero">
        <div className="capture-hero-grid">
          <div className="capture-hero-copy">
            <p className="capture-eyebrow capture-eyebrow-mint">Guía gratuita</p>
            <h1>
              Ayudar a quien apuesta{" "}
              <em>sin hacerte cargo</em> de{" "}
              <span className="capture-marked">
                <strong>todo.</strong>
                <HandUnderline />
              </span>
            </h1>
            <p className="capture-lead">
              Las 7 decisiones que más cuestan: qué responder cuando pide plata,
              si cubrir una deuda, qué hacer con las mentiras y cómo actuar si recae.
            </p>

            <div className="capture-form-card">
              <div className="capture-form-intro">
                <span>7 decisiones</span>
                <span>15 minutos de lectura</span>
              </div>
              <LeadForm id="hero" angulo={angulo} />
            </div>

            <div className="capture-byline">
              <Image src="/yo.png" alt="" width={46} height={46} className="capture-avatar" />
              <p>
                Elaborada por <strong>Gonzalo Pedrosa</strong>
                <span>Psicólogo</span>
              </p>
            </div>
          </div>

          <div className="capture-guide-art" aria-label="Vista previa de la guía">
            <div className="capture-note">para leer con calma</div>
            <div className="capture-cover capture-cover-back">
              <Image
                src="/captacion/guia-interior.svg"
                alt="Página interior de la guía: las 7 decisiones"
                fill
                sizes="(max-width: 767px) 70vw, 360px"
              />
            </div>
            <div className="capture-cover capture-cover-front">
              <Image
                src="/captacion/guia-portada.svg"
                alt="Portada de la guía gratuita"
                fill
                priority
                sizes="(max-width: 767px) 70vw, 360px"
              />
            </div>
            <div className="capture-star"><Star /></div>
            <svg className="capture-loop" viewBox="0 0 190 100" aria-hidden="true">
              <path d="M8 78c34 15 82 5 99-16 14-18 0-33-20-27-23 7-23 31 1 39 26 8 68-10 94-48" />
            </svg>
          </div>
        </div>
      </section>

      <main>
        <section className="capture-problem">
          <div className="capture-section-heading">
            <p className="capture-eyebrow">Quizás te suene familiar</p>
            <h2>
              Querer ayudar y no saber <strong>por dónde empezar.</strong>
            </h2>
          </div>
          <div className="capture-problem-grid">
            <ul>
              {situacion.map((linea, index) => (
                <li key={linea}>
                  <span>0{index + 1}</span>
                  {linea}
                </li>
              ))}
            </ul>
            <blockquote>
              <span aria-hidden="true">“</span>
              <p>
                Esta guía no va a hacer que deje de apostar. Eso no depende de ti.
                Lo que sí depende de ti es cómo ayudas, qué límites pones y qué dejas de cubrir.
              </p>
            </blockquote>
          </div>
        </section>

        <section className="capture-decisions">
          <div className="capture-section-heading capture-section-heading-left">
            <p className="capture-eyebrow">Dentro de la guía</p>
            <h2>
              Siete decisiones para mirar con más <strong>claridad.</strong>
            </h2>
          </div>
          <ol className="capture-decision-grid">
            {decisiones.map((item, index) => (
              <li key={item.titulo} className={index === 0 ? "capture-decision-featured" : ""}>
                <span className="capture-decision-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
              </li>
            ))}
          </ol>
          <a href="#recibir" className="capture-pill capture-pill-dark">
            Recibir la guía gratis <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="capture-preview">
          <div className="capture-preview-copy">
            <p className="capture-eyebrow capture-eyebrow-mint">Un vistazo</p>
            <h2>
              Así se ve <strong>por dentro.</strong>
            </h2>
            <p>
              Siete decisiones para leer en unos 15 minutos, sin fórmulas
              mágicas ni respuestas impuestas.
            </p>
            <div className="capture-preview-meta">
              <span>7</span>
              <p>decisiones<br />15 minutos</p>
            </div>
          </div>
          <div className="capture-pages">
            <div>
              <Image src="/captacion/guia-portada.svg" alt="Portada de la guía gratuita" fill sizes="350px" />
            </div>
            <div>
              <Image
                src="/captacion/guia-interior.svg"
                alt="Página interior de la guía"
                fill
                sizes="350px"
              />
            </div>
          </div>
        </section>

        <section className="capture-author">
          <div className="capture-author-photo">
            <Image src="/yo.png" alt="Gonzalo Pedrosa" fill sizes="(max-width: 767px) 100vw, 45vw" />
          </div>
          <div className="capture-author-copy">
            <p className="capture-eyebrow">Quién escribe esta guía</p>
            <h2>
              Hola, soy <strong>Gonzalo.</strong>
            </h2>
            <p>
              Soy psicólogo. Escribí esta guía para parejas y familiares
              que quieren ayudar a alguien que apuesta y no saben por dónde empezar.
            </p>
            <p>
              Reúne principios psicológicos y herramientas prácticas para acompañar
              sin asumir la responsabilidad por la recuperación de otra persona.
            </p>
            <p className="capture-author-note">
              Enfoque psicológico y profesional. Puede complementar un grupo
              de apoyo, no lo reemplaza.
            </p>
          </div>
        </section>

        <section className="capture-fit">
          <div>
            <span aria-hidden="true">✓</span>
            <p>
              <strong>Es para ti</strong> si eres pareja, hija o hijo, madre, padre
              o alguien cercano a una persona que apuesta. No necesitas que la otra
              persona admita el problema.
            </p>
          </div>
          <div>
            <span aria-hidden="true">×</span>
            <p>
              <strong>No es para diagnosticar</strong> a nadie ni reemplaza un
              tratamiento psicológico. Es material psicoeducativo.
            </p>
          </div>
        </section>

        <section className="capture-faq">
          <div className="capture-section-heading">
            <p className="capture-eyebrow">Antes de descargar</p>
            <h2>
              Preguntas <strong>frecuentes.</strong>
            </h2>
          </div>
          <div className="capture-faq-list">
            {preguntas.map((item) => (
              <details key={item.q}>
                <summary>
                  <span>{item.q}</span>
                  <i aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="recibir" className="capture-final">
          <div className="capture-final-star" aria-hidden="true"><Star /></div>
          <div className="capture-final-copy">
            <p className="capture-eyebrow">Descarga gratuita</p>
            <h2>
              No necesitas tener todas las respuestas <strong>hoy.</strong>
            </h2>
            <p>Empieza por las decisiones que sí dependen de ti.</p>
          </div>
          <div className="capture-final-form">
            <LeadForm id="final" angulo={angulo} />
          </div>
        </section>
      </main>

      <footer className="capture-footer">
        <div className="capture-brand">
          <span aria-hidden="true" />
          Gonzalo Pedrosa
        </div>
        <div>
          <Link href="/privacidad" prefetch={false}>Privacidad</Link>
          <Link href="/terminos" prefetch={false}>Términos</Link>
        </div>
        <p>
          © 2026 · Si hay riesgo inmediato para alguien, contacta a los servicios
          de emergencia de tu país.
        </p>
      </footer>
    </div>
  );
}
