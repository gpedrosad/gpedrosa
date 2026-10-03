const WHATSAPP = "https://wa.me/56968257817";

const TEXTOS: Record<string, string> = {
  "correo-2-plata": "Hola Gonzalo, vengo del correo 2. Me está pasando esto:",
  "correo-3-creerle": "Hola Gonzalo, vengo del correo 3. Me está pasando esto:",
  "correo-4-recaida": "Hola Gonzalo, vengo del correo 4. Me está pasando esto:",
};

export function GET(request: Request) {
  const content = new URL(request.url).searchParams.get("utm_content") || "";
  const texto = TEXTOS[content] || "Hola Gonzalo, vengo de un correo. Me está pasando esto:";
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${WHATSAPP}?text=${encodeURIComponent(texto)}`,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
}
