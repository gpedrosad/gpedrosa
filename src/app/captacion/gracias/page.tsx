import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Rastreo from "../Rastreo";

export const metadata: Metadata = {
  title: "Listo. Tu guía va en camino.",
  description: "La guía se envía por correo. Material psicoeducativo elaborado por un psicólogo.",
  robots: { index: false, follow: false },
  twitter: {
    title: "Listo. Tu guía va en camino.",
  },
};

const PDF_URL = "/captacion/guia";

// TODO: link de pago del kit
const KIT_PAGO_URL = "";

function Check() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="m7 16.5 5.4 5.3L25 9.4" />
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

export default function GraciasPage() {
  return (
    <div className="capture-shell capture-thanks-shell">
      <Rastreo evento="captacion_gracias" />

      <main>
        <section className="capture-thanks-hero">
          <div className="capture-thanks-copy">
            <div className="capture-confirmation" aria-hidden="true">
              <Check />
            </div>
            <p className="capture-eyebrow capture-eyebrow-mint">Guía enviada</p>
            <h1>
              Listo. Tu guía va <strong>en camino.</strong>
            </h1>
            <p className="capture-thanks-lead">
              Te la enviamos por correo desde Gonzalo Pedrosa. Si no la ves en 5 minutos,
              revisa Promociones o Spam.
            </p>
            <a href={PDF_URL} className="capture-pill capture-thanks-primary">
              Ver la guía ahora <span aria-hidden="true">↗</span>
            </a>
          </div>

          <a
            href={PDF_URL}
            className="capture-thanks-guide"
            aria-label="Ver la guía Ayudar a quien apuesta sin hacerte cargo de todo"
          >
            <div className="capture-thanks-note">Ver la guía ↗</div>
            <div className="capture-thanks-cover">
              <Image
                src="/captacion/guia-portada.png"
                quality={90}
                alt="Portada de la guía Ayudar a quien apuesta sin hacerte cargo de todo"
                fill
                priority
                sizes="(max-width: 767px) 72vw, 360px"
              />
            </div>
            <div className="capture-thanks-star"><Star /></div>
          </a>
        </section>

        <section id="kit" className="capture-kit">
          <div className="capture-kit-intro">
            <p className="capture-eyebrow">El siguiente paso</p>
            <h2>
              Kit práctico <strong>para familiares.</strong>
            </h2>
            <p>
              Entender qué hacer es el primer paso. Aplicarlo cuando vuelve a pedir plata,
              aparece otra mentira o se incumple un límite suele ser más difícil.
            </p>
          </div>

          <div className="capture-kit-card">
            <div className="capture-kit-comparison">
              <div>
                <span>01</span>
                <p>La guía gratis te ayuda a ver <strong>qué decisiones tomar.</strong></p>
              </div>
              <div>
                <span>02</span>
                <p>El kit te enseña <strong>cómo llevarlas a la práctica.</strong></p>
              </div>
            </div>
            <div className="capture-kit-buy">
              <div>
                <p>Kit práctico para familiares</p>
                <strong>$27.990 <small>CLP</small></strong>
              </div>
              <a href={KIT_PAGO_URL || "#kit"} className="capture-pill capture-kit-button">
                Comprar el kit <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="capture-footer capture-thanks-footer">
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
