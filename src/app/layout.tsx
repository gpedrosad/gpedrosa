import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://gpedrosa.cl"),
  title: "Gonzalo Pedrosa |",
  description: "Acompañamiento Online",
  alternates: { canonical: "/", languages: { "es-CL": "/" } },
  openGraph: {
    type: "website",
    url: "https://gpedrosa.cl/",
    title: "Gonzalo Pedrosa",
    description: "Acompañamiento Online",
    siteName: "Gonzalo Pedrosa",
    locale: "es_CL",
    images: [{ url: "/yo.png", width: 1200, height: 630, alt: "Orientación online con Gonzalo Pedrosa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gonzalo Pedrosa | Agendamiento Online",
    description: "Agendamiento Online",
    images: ["/yo.png"],
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const PIXEL_ID =
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ??
    process.env.FACEBOOK_PIXEL_ID ??
    "";

  return (
    <html lang="es-CL">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Pixel de Meta: init UNA VEZ (sin PageView) y carga del script en el primer uso */}
        <Script id="fbq-lazy" strategy="afterInteractive">
          {`
            (function (w, d, pid) {
              if (!pid) return;

              // Si ya existe fbq y ya está inicializado con este pid, no hacer nada
              if (w.fbq && w.fbq.__pid === pid) return;

              // Si existe fbq pero sin __pid (p.ej. otro stub), sólo inicializa una vez
              if (w.fbq && !w.fbq.__pid) {
                try { w.fbq('init', pid); w.fbq.__pid = pid; } catch(e) {}
                return;
              }

              // Stub minimal con cola + carga en primer uso
              var loadLib = function() {
                if (n.__loading) return;
                n.__loading = true;
                var s = d.createElement('script');
                s.async = true;
                s.src = 'https://connect.facebook.net/en_US/fbevents.js';
                var x = d.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
              };

              var n = function() {
                n.queue.push(arguments);
                // en el primer uso, cargar la librería real
                loadLib();
              };

              n.queue = [];
              n.version = '2.0';
              n.loaded = true;
              n.__pid = pid;

              w.fbq = n;
              if (!w._fbq) w._fbq = n;

              // IMPORTANTE: init solo UNA VEZ, aquí.
              n('init', pid);
            })(window, document, '${PIXEL_ID}');
          `}
        </Script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}