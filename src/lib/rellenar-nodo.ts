import { guardarCuerpo, guardarEvaluacionEnlace, leerEsquema } from "./esquema";
import type { Esquema, EvaluacionG, Nodo } from "./esquema-types";

type Relacion = {
  direccion: "entra" | "sale";
  otro: Nodo;
  criterio: Nodo;
};

const PROPOSITO = [
  "El flujo crea un anuncio coherente con una landing.",
  "El anuncio promete lo que la landing continúa. No contradigas el nivel de conciencia, la motivación ni el camino a la conversión.",
  "Los mensajes de la landing se escriben por componente: Hero (headline, subheadline, visual, CTA), Problema, Beneficios, Qué recibes, Autoridad, CTA final y Footer.",
  "No escribas la landing como un texto único. Si el nodo es un componente, el resultado es solo el mensaje de ese componente.",
].join(" ");

function pieza(nodo: Nodo) {
  return [`# ${nodo.titulo}`, nodo.cuerpo.trim() || "(vacío)"].join("\n");
}

function relacionesDe(esquema: Esquema, id: string) {
  const relaciones: Relacion[] = [];
  for (const enlace of esquema.enlaces) {
    const criterio = esquema.nodos.find((item) => item.id === enlace.criterio);
    if (!criterio) continue;
    if (enlace.hasta === id) {
      const otro = esquema.nodos.find((item) => item.id === enlace.desde);
      if (otro) relaciones.push({ direccion: "entra", otro, criterio });
    }
    if (enlace.desde === id) {
      const otro = esquema.nodos.find((item) => item.id === enlace.hasta);
      if (otro) relaciones.push({ direccion: "sale", otro, criterio });
    }
  }
  return relaciones;
}

function contextoAtras(esquema: Esquema, id: string) {
  const vistos = new Set<string>([id]);
  const criterios: Nodo[] = [];
  const anteriores: Nodo[] = [];
  const cola = [id];

  while (cola.length) {
    const actual = cola.shift() as string;
    for (const enlace of esquema.enlaces) {
      if (enlace.hasta !== actual) continue;
      const criterio = esquema.nodos.find((item) => item.id === enlace.criterio);
      const previo = esquema.nodos.find((item) => item.id === enlace.desde);
      if (criterio && !criterios.some((item) => item.id === criterio.id)) {
        criterios.push(criterio);
      }
      if (previo && !vistos.has(previo.id)) {
        vistos.add(previo.id);
        if (previo.tipo !== "criterio") anteriores.push(previo);
        cola.push(previo.id);
      }
    }
  }

  return { criterios, anteriores };
}

async function pedirOpenAI(
  mensajes: Array<{ role: "system" | "user"; content: string }>,
  json = false
) {
  const clave = process.env.OPENAI_API_KEY?.trim();
  if (!clave) throw new Error("Falta OPENAI_API_KEY en .env");

  const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clave}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: json ? 0.1 : 0.4,
      messages: mensajes,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  const data = (await respuesta.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };

  if (!respuesta.ok) {
    const detalle = data.error?.message || "OpenAI no pudo generar";
    if (/credits remaining|billing/i.test(detalle)) {
      throw new Error("OpenAI no tiene créditos. Cargá saldo en la cuenta.");
    }
    throw new Error(detalle);
  }

  const cuerpo = data.choices?.[0]?.message?.content?.trim();
  if (!cuerpo) throw new Error("OpenAI no devolvió texto");
  return cuerpo;
}

function puntuacion(valor: unknown) {
  const numero = typeof valor === "number" ? valor : Number(valor);
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(numero) ? numero : 0)));
}

function textos(valor: unknown) {
  return Array.isArray(valor)
    ? valor.filter((item): item is string => typeof item === "string").slice(0, 5)
    : [];
}

function normalizarEvaluacion(raw: string): EvaluacionG {
  const data = JSON.parse(raw) as Record<string, unknown>;
  const score = puntuacion(data.puntuacion);
  const dimensiones = Array.isArray(data.dimensiones)
    ? data.dimensiones
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .slice(0, 5)
        .map((item) => ({
          nombre: typeof item.nombre === "string" ? item.nombre : "Dimensión",
          puntuacion: puntuacion(item.puntuacion),
          justificacion:
            typeof item.justificacion === "string" ? item.justificacion : "Sin justificación",
        }))
    : [];

  return {
    puntuacion: score,
    nivel: score >= 80 ? "alta" : score >= 55 ? "media" : "baja",
    resumen: typeof data.resumen === "string" ? data.resumen : "Evaluación completada.",
    dimensiones,
    aciertos: textos(data.aciertos),
    brechas: textos(data.brechas),
    recomendacion:
      typeof data.recomendacion === "string"
        ? data.recomendacion
        : "Ajustá el paso de destino para cumplir explícitamente el criterio.",
    evaluadoEn: new Date().toISOString(),
  };
}

export async function evaluarEnlace(id: string) {
  const esquema = await leerEsquema();
  const enlace = esquema.enlaces.find((item) => item.id === id);
  if (!enlace) throw new Error("No existe la conexión en el esquema");
  const origen = esquema.nodos.find((item) => item.id === enlace.desde);
  const destino = esquema.nodos.find((item) => item.id === enlace.hasta);
  const criterio = esquema.nodos.find((item) => item.id === enlace.criterio);
  if (!origen || !destino || !criterio) {
    throw new Error("La conexión está incompleta");
  }
  if (!criterio.cuerpo.trim()) {
    throw new Error(`Escribí el criterio entre ${origen.titulo} y ${destino.titulo}`);
  }

  const raw = await pedirOpenAI(
    [
      {
        role: "system",
        content: [
          "Sos un juez G-Eval para flujos de marketing.",
          PROPOSITO,
          "Evaluá cuánto el paso de destino continúa al paso de origen y cumple el criterio que los conecta. Si uno es el anuncio y el otro un componente de la landing, la nota mide si el mensaje del componente sigue la promesa del anuncio.",
          "Usá una rúbrica explícita: cumplimiento del criterio 35%, continuidad semántica 25%, claridad del avance 20%, consistencia de audiencia/tono 10% y ausencia de contradicciones o fricción 10%.",
          "Las ponderaciones sirven solo para calcular la puntuación global. Cada dimensión debe recibir su propia nota de 0 a 100 (por ejemplo 80), nunca el valor de su ponderación (35, 25, 20 o 10).",
          "Basate únicamente en los textos provistos. Un criterio vacío, una promesa no respaldada o un cambio brusco debe bajar el puntaje.",
          "Devolvé solo JSON válido con: puntuacion (0-100), resumen (máximo 2 frases), dimensiones (exactamente cinco objetos, uno por cada dimensión de la rúbrica, con nombre, puntuacion 0-100 y justificacion breve), aciertos (array), brechas (array) y recomendacion (un cambio concreto y prioritario).",
        ].join(" "),
      },
      {
        role: "user",
        content: [
          "PASO DE ORIGEN",
          pieza(origen),
          "CRITERIO DE CONEXIÓN",
          pieza(criterio),
          "PASO DE DESTINO",
          pieza(destino),
          "Puntuá la coherencia real de esta transición. No premies solo palabras repetidas: verificá intención, promesa y función dentro del flujo.",
        ].join("\n\n"),
      },
    ],
    true
  );

  const evaluacion = normalizarEvaluacion(raw);
  await guardarEvaluacionEnlace(id, evaluacion);
  return evaluacion;
}

export async function rellenarNodo(id: string) {
  const esquema = await leerEsquema();
  const nodo = esquema.nodos.find((item) => item.id === id);
  if (!nodo) throw new Error("No existe en el esquema");
  if (nodo.tipo === "criterio") {
    throw new Error("El criterio se escribe a mano");
  }

  const relaciones = relacionesDe(esquema, id);
  if (relaciones.length === 0) {
    throw new Error("Uní este nodo a otro para listar qué incluir");
  }

  const hayBase = relaciones.some(
    (relacion) => relacion.otro.cuerpo.trim() || relacion.criterio.cuerpo.trim()
  );
  if (!hayBase) {
    throw new Error("Escribí el criterio o el nodo conectado primero");
  }

  const entra = relaciones.filter((relacion) => relacion.direccion === "entra");
  const usadas = entra.length ? entra : relaciones;

  const contexto = usadas
    .map((relacion) =>
      [
        relacion.direccion === "entra" ? "Nodo de origen" : "Nodo de destino",
        pieza(relacion.otro),
        "Criterio de la relación",
        pieza(relacion.criterio),
      ].join("\n\n")
    )
    .join("\n\n---\n\n");

  const cuerpo = await pedirOpenAI([
    {
      role: "system",
      content:
        [
          "Listás qué tiene que tener este nodo. No escribas el copy ni el contenido final.",
          PROPOSITO,
          "A partir de qué es el nodo, del nodo al que se une y de los criterios de esa relación, armá una lista de piezas, campos o condiciones.",
          "Si el nodo es un componente de la landing, las piezas son los campos de ese componente y cómo cada uno sigue al anuncio.",
          "Cada ítem tiene que decir para qué criterio o para qué parte del nodo conectado existe.",
          "No inventes hechos, ofertas ni credenciales. Si falta info, anotalo como pendiente. Respondé solo markdown, sin explicación.",
        ].join(" "),
    },
    {
      role: "user",
      content: [
        `Qué es este nodo: ${nodo.titulo}`,
        nodo.cuerpo.trim()
          ? `Notas actuales del nodo:\n${nodo.cuerpo}`
          : "El nodo todavía no dice qué debería tener.",
        contexto,
        "Pedí: qué cosas debería tener este nodo para ser lo que es, cumplir los criterios y seguir al nodo con el que se une.",
      ].join("\n\n"),
    },
  ]);

  await guardarCuerpo("nodo", id, cuerpo);
  return cuerpo;
}

export async function generarNodo(id: string) {
  const esquema = await leerEsquema();
  const nodo = esquema.nodos.find((item) => item.id === id);
  if (!nodo) throw new Error("No existe en el esquema");
  if (nodo.tipo === "criterio") {
    throw new Error("El criterio se escribe a mano");
  }

  const atras = contextoAtras(esquema, id);
  let criterios = atras.criterios.filter((item) => item.cuerpo.trim());
  let anteriores = atras.anteriores.filter((item) => item.cuerpo.trim());

  if (!criterios.length && !anteriores.length) {
    const salida = relacionesDe(esquema, id).filter((relacion) => relacion.direccion === "sale");
    criterios = salida.map((relacion) => relacion.criterio).filter((item) => item.cuerpo.trim());
    anteriores = salida.map((relacion) => relacion.otro).filter((item) => item.cuerpo.trim());
  }

  if (!criterios.length && !anteriores.length) {
    throw new Error("Escribí los criterios de atrás o el nodo que alimenta a este");
  }

  const cuerpo = await pedirOpenAI([
    {
      role: "system",
      content:
        [
          "Generás el mensaje de un nodo.",
          PROPOSITO,
          "El título dice si es el anuncio o cuál componente de la landing es.",
          "Si es el anuncio, escribí el anuncio de modo que la landing pueda continuarlo.",
          "Si es un componente, escribí solo el mensaje de ese componente, coherente con el anuncio y con los criterios de atrás.",
          "Usá los nodos anteriores si hay texto. No inventes hechos, ofertas ni credenciales que no estén en ese contexto.",
          "Respondé solo el markdown del contenido, sin explicar el proceso.",
        ].join(" "),
    },
    {
      role: "user",
      content: [
        `Título del nodo a generar: ${nodo.titulo}`,
        criterios.length
          ? `Criterios hacia atrás:\n${criterios.map(pieza).join("\n\n")}`
          : "No hay criterios escritos hacia atrás.",
        anteriores.length
          ? `Nodos anteriores:\n${anteriores.map(pieza).join("\n\n")}`
          : "No hay nodos anteriores con texto.",
        "Generá el contenido de este nodo.",
      ].join("\n\n"),
    },
  ]);

  await guardarCuerpo("nodo", id, cuerpo);
  return cuerpo;
}
