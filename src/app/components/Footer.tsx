// src/app/components/Footer.tsx
import Link from "next/link";
import React from "react";

type FooterProps = {
  className?: string;
};

const EMAIL = "gpedrosadom@gmail.com";
const WHATS   = "+56968257817";
const WHATS_LINK =
  "https://wa.me/56968257817?text=Hola%20Gonzalo%2C%20quisiera%20agendar%20una%20sesi%C3%B3n";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/contacto", label: "Contacto" },
] as const;

export default function Footer({ className = "" }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={[
        "border-t border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        className,
      ].join(" ")}
      aria-label="Pie de página del sitio"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          {/* Brand + disclaimer */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">Gonzalo Pedrosa</p>
            <p className="max-w-prose text-sm text-gray-600">
              Este sitio puede usar cookies y Facebook Pixel para medición y mejora de contenidos.{" "}
              <Link href="/privacidad" className="underline underline-offset-2">
                Más información
              </Link>
              .
            </p>
          </div>

          {/* Navegación */}
          <nav aria-label="Enlaces legales y de contacto">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-700">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[#023047]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto directo */}
          <div className="flex flex-col items-start gap-2 text-sm">
            <a
              href={`mailto:${EMAIL}?subject=Consulta%20desde%20gpedrosa.cl`}
              className="text-[#023047] underline underline-offset-2"
              aria-label="Enviar correo a Gonzalo Pedrosa"
            >
              {EMAIL}
            </a>
            <a
              href={WHATS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#023047] underline underline-offset-2"
              aria-label="Abrir WhatsApp para contactar a Gonzalo Pedrosa"
              title={WHATS}
            >
              WhatsApp {WHATS}
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6">
          <p className="text-center text-xs text-gray-500">
            © {year} Gonzalo Pedrosa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}