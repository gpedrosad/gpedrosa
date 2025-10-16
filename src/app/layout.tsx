// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata consistente (sin cloaking) y neutral.
 * - Sin lenguaje clínico/diagnóstico ni promesas terapéuticas.
 * - Mismo contenido para bots y humanos.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://gpedrosa.cl"),
  title: "Gonzalo Pedrosa |",
  description:
    "Acompañamiento Online",
  alternates: {
    canonical: "/",
    languages: { "es-CL": "/" },
  },
  openGraph: {
    type: "website",
    url: "https://gpedrosa.cl/",
    title: "Gonzalo Pedrosa",
    description:
      "Acompañamiento Online",
    siteName: "Gonzalo Pedrosa",
    locale: "es_CL",
    images: [
      {
        url: "/yo.png",
        width: 1200,
        height: 630,
        alt: "Orientación online con Gonzalo Pedrosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gonzalo Pedrosa | Agendamiento Online",
    description:
      "Agendamiento Online",
    images: ["/yo.png"],
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ID del Pixel (si no existe, el stub no hace nada)
  const PIXEL_ID =
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ??
    process.env.FACEBOOK_PIXEL_ID ??
    "";

  return (
    <html lang="es-CL">
      <head>
        {/* Referrer reducido: menos fuga de parámetros a terceros */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* ─────────────────────────────────────────────────────────────
           ───────────────────────────────────────────────────────────── */}
        <Script id="ld-professional" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            name: "Gonzalo Pedrosa",
            areaServed: ["Online"],
            url: "https://gpedrosa.cl/",
            image: "https://gpedrosa.cl/yo.png",
            description:
              "Acompañamiento Online",
          })}
        </Script>

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* ─────────────────────────────────────────────────────────────
           Pixel de Meta con carga perezosa y sin PageView automático.
           - No se carga la librería hasta que ALGUIEN llame fbq(...)
           - En la primera llamada, se encola automáticamente fbq('init', PIXEL_ID)
           - NO hay 'PageView' por defecto.
           - Sin <noscript> (evita disparos en crawlers/headless)
           Esto reduce señales a bots y mantiene consistencia de contenido.
           ───────────────────────────────────────────────────────────── */}
        <Script id="fbq-lazy" strategy="afterInteractive">
          {`
            (function (w, d, pid) {
              if (!pid) return;
              if (w.fbq) return;

              var n = function() {
                var args = Array.prototype.slice.call(arguments);
                // Auto-init: si llega un 'track' antes de 'init', encolamos 'init' primero
                if (!n.__inited && args[0] !== 'init') {
                  n.queue.push(['init', pid]);
                  n.__inited = true;
                } else if (args[0] === 'init') {
                  n.__inited = true;
                }
                n.queue.push(args);

                // Carga perezosa de la librería al primer uso
                if (!n.__loading) {
                  n.__loading = true;
                  var s = d.createElement('script');
                  s.async = true;
                  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
                  var x = d.getElementsByTagName('script')[0];
                  x.parentNode.insertBefore(s, x);
                }
              };

              n.queue = [];
              n.version = '2.0';
              n.loaded = true;
              n.push = n; // compat

              w.fbq = n;
              if (!w._fbq) w._fbq = n;
            })(window, document, '${PIXEL_ID}');
          `}
        </Script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* Analytics de Vercel (no bloqueante) */}
      </body>
    </html>
  );
}