import { leerEsquema } from "./esquema";
import { evaluarEnlace } from "./rellenar-nodo";

export async function feedbackConexiones(tocados?: ReadonlySet<string>) {
  const esquema = await leerEsquema();
  const salida = [];
  for (const enlace of esquema.enlaces) {
    const toca = !tocados || tocados.has(enlace.desde) || tocados.has(enlace.hasta);
    if (!toca) {
      salida.push({
        desde: enlace.desde,
        hasta: enlace.hasta,
        puntuacion: enlace.evaluacion?.puntuacion ?? null,
        resumen: enlace.evaluacion?.resumen ?? "",
        recomendacion: enlace.evaluacion?.recomendacion ?? "",
        brechas: enlace.evaluacion?.brechas ?? [],
      });
      continue;
    }
    try {
      const evaluacion = await evaluarEnlace(enlace.id);
      salida.push({
        desde: enlace.desde,
        hasta: enlace.hasta,
        puntuacion: evaluacion.puntuacion,
        resumen: evaluacion.resumen,
        recomendacion: evaluacion.recomendacion,
        brechas: evaluacion.brechas,
      });
    } catch (error) {
      salida.push({
        desde: enlace.desde,
        hasta: enlace.hasta,
        error: error instanceof Error ? error.message : "No se pudo evaluar",
      });
    }
  }
  return salida;
}
