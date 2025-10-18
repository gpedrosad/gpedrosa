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
  title: "Gonzalo Pedrosa",
  description: "Acompañamiento Online",
  alternates: {
    canonical: "/",
    languages: { "es-CL": "/" },
  },
  openGraph: {
    type: "website",
    url: "https://gpedrosa.cl/",
    title: "Gonzalo Pedrosa",
    description: "Acompañamiento Online",
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
    description: "Agendamiento Online",
    images: ["/yo.png"],
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ID del Pixel (si no existe, no renderizamos el snippet)
  const PIXEL_ID =
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ??
    process.env.FACEBOOK_PIXEL_ID ??
    "";

  return (
    <html lang="es-CL">
      <head>
        {/* Referrer reducido: menos fuga de parámetros a terceros */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* ───────────────────────────────────────────────────────────── */}
        <Script id="ld-professional" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            name: "Gonzalo Pedrosa",
            areaServed: ["Online"],
            url: "https://gpedrosa.cl/",
            image: "https://gpedrosa.cl/yo.png",
            description: "Acompañamiento Online",
          })}
        </Script>

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* ─────────────────────────────────────────────────────────────
            Pixel de Meta (snippet oficial) + PageView automático
            - Carga una sola vez con next/script (afterInteractive)
            - Incluye <noscript> como fallback (solo si hay PIXEL_ID)
           ───────────────────────────────────────────────────────────── */}
        {PIXEL_ID && (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s){
                  if(f.fbq)return;
                  n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;
                  n.push=n; n.loaded=!0; n.version='2.0'; n.queue=[];
                  t=b.createElement(e); t.async=!0; t.src=v;
                  s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)
                }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>

            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* Analytics de Vercel (no bloqueante) */}
      </body>
    </html>
  );
}