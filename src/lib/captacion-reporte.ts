import {
  brevoDisponible,
  estadisticasBrevoCaptacion,
  listarPlantillasCaptacion,
  type EstadisticaBrevo,
} from "@/lib/brevo";
import { contextoComoTexto } from "@/lib/captacion-contexto";
import {
  listarLeadsSecuencia,
  supabaseLeadsDisponible,
  type LeadSecuencia,
} from "@/lib/supabase-leads";

const ZONA = "America/Santiago";

export type LeadReporte = {
  email: string;
  creado: string;
  angulo: string;
  source: string;
  prueba: boolean;
  correo1: string;
  correo2: string;
  correo3: string;
  correo4: string;
};

export type ReporteCaptacion = {
  generado: string;
  desde: string;
  hasta: string;
  leads: {
    total: number;
    reales: number;
    pruebas: number;
    porAngulo: Record<string, number>;
    correo1: number;
    correo2: number;
    correo3: number;
    correo4: number;
    conLosCuatro: number;
    filas: LeadReporte[];
  };
  brevo: EstadisticaBrevo[] | null;
  plantillas: ReturnType<typeof listarPlantillasCaptacion>;
  errorLeads: string | null;
  errorBrevo: string | null;
};

function chile(fecha: Date | string) {
  return new Date(fecha).toLocaleString("es-CL", {
    timeZone: ZONA,
    dateStyle: "short",
    timeStyle: "short",
  });
}

function ocultarEmail(email: string) {
  const [usuario, dominio] = email.split("@");
  if (!dominio) return "***";
  const visible = usuario.slice(0, 2);
  return `${visible}***@${dominio}`;
}

export function esLeadPrueba(lead: Pick<LeadSecuencia, "email" | "source">) {
  const email = lead.email.toLowerCase();
  const source = (lead.source || "").toLowerCase();
  return (
    email.includes("ansiosamente") ||
    email.includes("+vercel") ||
    source === "manual" ||
    source === "simulado"
  );
}

function contar(filas: LeadSecuencia[], campo: keyof LeadSecuencia) {
  return filas.filter((fila) => fila[campo]).length;
}

export async function armarReporteCaptacion(): Promise<ReporteCaptacion> {
  const ahora = new Date();
  const hasta = ahora.toISOString().slice(0, 10);
  const desdeDate = new Date(ahora);
  desdeDate.setUTCDate(desdeDate.getUTCDate() - 30);
  const desde = desdeDate.toISOString().slice(0, 10);

  let leads: LeadSecuencia[] = [];
  let errorLeads: string | null = null;
  if (supabaseLeadsDisponible()) {
    try {
      leads = await listarLeadsSecuencia();
    } catch (error) {
      errorLeads = error instanceof Error ? error.message : "No se pudieron leer los leads";
    }
  } else {
    errorLeads = "Falta Supabase";
  }

  const reales = leads.filter((lead) => !esLeadPrueba(lead));
  const porAngulo: Record<string, number> = {};
  for (const lead of reales) {
    const angulo = lead.angulo || "sin-angulo";
    porAngulo[angulo] = (porAngulo[angulo] || 0) + 1;
  }

  let brevo: EstadisticaBrevo[] | null = null;
  let errorBrevo: string | null = null;
  if (brevoDisponible()) {
    try {
      brevo = await estadisticasBrevoCaptacion(desde, hasta);
    } catch (error) {
      errorBrevo = error instanceof Error ? error.message : "No se pudieron leer las métricas de Brevo";
    }
  } else {
    errorBrevo = "Falta Brevo";
  }

  return {
    generado: chile(ahora),
    desde,
    hasta,
    leads: {
      total: leads.length,
      reales: reales.length,
      pruebas: leads.length - reales.length,
      porAngulo,
      correo1: contar(leads, "correo_1_at"),
      correo2: contar(leads, "correo_2_at"),
      correo3: contar(leads, "correo_3_at"),
      correo4: contar(leads, "correo_4_at"),
      conLosCuatro: leads.filter((lead) => lead.correo_4_at).length,
      filas: leads.map((lead) => ({
        email: ocultarEmail(lead.email),
        creado: chile(lead.created_at),
        angulo: lead.angulo || "-",
        source: lead.source || "-",
        prueba: esLeadPrueba(lead),
        correo1: lead.correo_1_at ? chile(lead.correo_1_at) : "",
        correo2: lead.correo_2_at ? chile(lead.correo_2_at) : "",
        correo3: lead.correo_3_at ? chile(lead.correo_3_at) : "",
        correo4: lead.correo_4_at ? chile(lead.correo_4_at) : "",
      })),
    },
    brevo,
    plantillas: listarPlantillasCaptacion(),
    errorLeads,
    errorBrevo,
  };
}

export function reporteComoTexto(reporte: ReporteCaptacion) {
  const lineas: string[] = [];
  lineas.push("REPORTE FUNNEL CAPTACION — gpedrosa.cl");
  lineas.push(`Generado: ${reporte.generado} (Chile)`);
  lineas.push(`Ventana Brevo: ${reporte.desde} a ${reporte.hasta}`);
  lineas.push("");
  lineas.push(contextoComoTexto());
  lineas.push("");
  lineas.push("LEADS");
  lineas.push(`Total: ${reporte.leads.total}`);
  lineas.push(`Reales: ${reporte.leads.reales}`);
  lineas.push(`Pruebas: ${reporte.leads.pruebas}`);
  lineas.push(`Por angulo (reales): ${JSON.stringify(reporte.leads.porAngulo)}`);
  lineas.push(`Correo 1 enviado: ${reporte.leads.correo1}`);
  lineas.push(`Correo 2 enviado: ${reporte.leads.correo2}`);
  lineas.push(`Correo 3 enviado: ${reporte.leads.correo3}`);
  lineas.push(`Correo 4 enviado: ${reporte.leads.correo4}`);
  lineas.push(`Leads con los 4 correos: ${reporte.leads.conLosCuatro}`);
  if (reporte.errorLeads) lineas.push(`Error leads: ${reporte.errorLeads}`);
  lineas.push("");
  lineas.push("LEADS DETALLE (email enmascarado)");
  lineas.push("email\tprueba\tangulo\tsource\tcreado\tc1\tc2\tc3\tc4");
  for (const fila of reporte.leads.filas) {
    lineas.push(
      [
        fila.email,
        fila.prueba ? "si" : "no",
        fila.angulo,
        fila.source,
        fila.creado,
        fila.correo1 || "-",
        fila.correo2 || "-",
        fila.correo3 || "-",
        fila.correo4 || "-",
      ].join("\t")
    );
  }
  lineas.push("");
  lineas.push("BREVO (clics importan; aperturas no)");
  if (reporte.errorBrevo) lineas.push(`Error Brevo: ${reporte.errorBrevo}`);
  if (reporte.brevo) {
    lineas.push("tag\tentregados\tclics\tclics unicos\taperturas\taperturas unicas\trebotes duros\tbaja");
    for (const fila of reporte.brevo) {
      lineas.push(
        [
          fila.tag,
          fila.delivered,
          fila.clicks,
          fila.uniqueClicks,
          fila.opens,
          fila.uniqueOpens,
          fila.hardBounces,
          fila.unsubscribed,
        ].join("\t")
      );
    }
  }
  lineas.push("");
  lineas.push("CORREOS ACTUALES");
  for (const plantilla of reporte.plantillas) {
    lineas.push("");
    lineas.push(`--- Correo ${plantilla.paso} | ${plantilla.tag} ---`);
    lineas.push(`Asunto: ${plantilla.asunto}`);
    lineas.push(plantilla.texto);
  }
  lineas.push("");
  lineas.push("FIN");
  return lineas.join("\n");
}
