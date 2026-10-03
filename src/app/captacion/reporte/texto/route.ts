import { armarReporteCaptacion, reporteComoTexto } from "@/lib/captacion-reporte";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const reporte = await armarReporteCaptacion();
  return new Response(reporteComoTexto(reporte), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
}
