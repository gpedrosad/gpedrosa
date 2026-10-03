export const CONTEXTO_CAPTACION = {
  pedidoAlLector: [
    "Sugiere el siguiente paso del experimento con los datos de este reporte.",
    "No juzgues un paso con el del siguiente.",
    "No reescribas la landing si la conversión a email está sobre 20%.",
    "No declares que el email falló hasta tener 30 a 40 leads que recibieron los 4 correos.",
    "No inventes números de Meta, PostHog o respuestas.",
    "No propongas el programa de $250 ni meter el Kit en el anuncio.",
    "No uses voseo. Tú: puedes, deja, recibe, empieza.",
    "No prometas que la persona va a dejar de apostar.",
    "No hables de proteger la plata, las cuentas o las finanzas del lector.",
    "El programa no se ofrece por /perfil: el CTA es WhatsApp.",
  ],
  estado: {
    experimento: "Experimento 1 (control)",
    canal: "Meta Ads → /captacion → email → /captacion/gracias",
    promesaUnica: "7 decisiones importantes, gratis",
    presupuestoUsdDia: 2,
    anunciosActivosEnMeta: 1,
    testTresAngulosEnMeta: false,
    kitCheckout: false,
    programa250EnTest: false,
    telefonoEnFormulario: false,
    remitente: "Gonzalo Pedrosa <ansiosamente@gpedrosa.cl>",
    replyTo: "El mismo remitente. Las respuestas llegan a Gmail.",
    whatsapp: "+56 9 6825 7817",
    cron: "Correo 1 al enviar el form. Correo 2 al día siguiente. Correo 3 a los 3 días. Correo 4 a los 5. Cron 10:00 Chile.",
    pixelMeta: "Pixel + CAPI Lead en el form. La guía no tiene PostHog ni Pixel.",
  },
  metaObservado: {
    fecha: "2026-10-03",
    fuente: "Dicho por el operador, no hay API de Meta en este reporte",
    visitasLanding: 14,
    leads: 7,
    conversionAprox: "alrededor de 50%",
    nota: "Volumen chico y puede incluir pruebas. La dirección es que la landing rinde. No se toca.",
  },
  respuestasObservadas: {
    fecha: "2026-10-03",
    fuente: "No hay API. Se leen en Gmail y WhatsApp.",
    respuestasCorreo1Numero: 0,
    respuestasCorreo2Linea: 0,
    respuestasCorreo3Linea: 0,
    whatsapp: 0,
    nota: "Actualizar a mano cuando alguien responda. Es la mejor señal del email.",
  },
  angulosDisenados: [
    { id: "A", angulo: "general", linea: "Cuando las apuestas empiezan a afectar a una familia.", url: "/captacion?a=A" },
    { id: "B", angulo: "dinero", linea: "Ayudar económicamente no siempre significa ayudar.", url: "/captacion?a=B" },
    { id: "C", angulo: "confianza", linea: "Apuestas, deudas y promesas de cambio.", url: "/captacion?a=C" },
  ],
  anuncio: {
    headline: "Guía gratuita para familiares",
    cta: "Más información / Descargar",
    primaryText:
      "Cuando las apuestas empiezan a generar deudas, mentiras o conflictos, la familia suele enfrentarse a decisiones difíciles:\n\n¿Conviene ayudar con las deudas?\n¿Cómo se establecen límites?\n¿Cuándo tiene sentido volver a confiar?\n¿Qué hacer frente a una recaída?\n\nPreparé una guía gratuita con 7 decisiones importantes para familiares y personas cercanas a alguien con problemas relacionados con las apuestas.\n\nEs un material práctico y psicoeducativo para entender qué puede hacer la familia —y qué no está bajo su control.",
    textoImagen: "CUANDO LAS APUESTAS EMPIEZAN A AFECTAR A UNA FAMILIA. 7 decisiones importantes sobre dinero, límites, confianza y recaídas. GUÍA GRATUITA. Elaborada por psicólogo.",
  },
  landing: {
    url: "https://www.gpedrosa.cl/captacion",
    headline: "Ayudar a quien apuesta sin hacerte cargo de todo",
    subheadline:
      "Guía gratuita en PDF para parejas y familiares de alguien que apuesta. Las 7 decisiones que más cuestan: qué responder cuando pide plata, si cubrir una deuda, qué hacer con las mentiras y cómo actuar si recae.",
    cta: "Recibir la guía gratis",
    formulario: "Solo email. Sin teléfono.",
    validacionTitulo: "Querer ayudar y no saber por dónde empezar",
    validacion: [
      "Te pide plata para una deuda más, la última.",
      "Prometió que no iba a volver a pasar.",
      "Descubriste mentiras y no sabes qué creerle.",
      "Sientes que eres la única persona que lo sabe.",
    ],
    destacado:
      "Esta guía no va a hacer que deje de apostar. Eso no depende de ti. Lo que sí depende de ti es cómo ayudas, qué límites pones y qué dejas de cubrir.",
    decisionesTitulo: "Las 7 decisiones que vas a poder tomar con más claridad",
    decisiones: [
      "Ayudar o hacerte cargo. Cómo distinguir cuándo tu ayuda sostiene el problema.",
      "Prestar o no prestar. Qué pensar antes de pasar plata o cubrir una deuda, y qué hacer en su lugar.",
      "Qué límite poner. Uno que sirva sin convertirte en su policía.",
      "Creerle o no. En qué fijarte cuando promete cambiar después de mentiras o recaídas.",
      "Volver a confiar. Qué señales permiten hacerlo de a poco, y cuáles todavía no.",
      "Qué hacer si recae. Cómo responder sin volver al mismo ciclo de siempre.",
      "Qué hacer si no quiere ayuda. Lo que sí puedes hacer tú aunque no lo admita.",
    ],
    autoridad:
      "Soy Gonzalo Pedrosa, psicólogo. Escribí esta guía para parejas y familiares que quieren ayudar a alguien que apuesta y no saben por dónde empezar.",
  },
  thankyou: {
    url: "https://www.gpedrosa.cl/captacion/gracias",
    h1: "Listo. Tu guía va en camino.",
    kit: "Kit práctico para familiares — $27.990 CLP",
    distincion: "La guía gratis te ayuda a ver qué decisiones tomar. El kit te enseña cómo llevarlas a la práctica.",
    checkout: "El link de pago todavía no está. Este paso no se puede declarar andando.",
  },
  umbrales: [
    "Ad → clic: anda si CTR ≥ 1%. Con 1.000 impresiones, se corta un ángulo a la mitad o menos del mejor.",
    "Landing → email: anda si ≥ 20% de los clics deja el email. 10–20% se sigue midiendo. < 10% con 80 clics: no anda.",
    "Secuencia: con 30–40 leads que recibieron los 4 correos, < 3–5 señales (respuestas + clics de guía o WhatsApp) = problema del email.",
    "Kit: anda si ≥ 3% de las vistas compra y el CPA queda bajo $27. Sin checkout no se juzga.",
  ],
  posthog: {
    eventos: ["captacion_landing + angulo", "captacion_email + angulo", "captacion_gracias", "captacion_kit (cuando exista checkout)"],
    nota: "Filtrar simulado = true. El clic del anuncio se mira en Meta, no en PostHog. Este reporte no consulta PostHog: no hay API key de lectura en el servidor.",
  },
} as const;

export function contextoComoTexto() {
  const c = CONTEXTO_CAPTACION;
  const lineas: string[] = [];
  lineas.push("PEDIDO AL LECTOR");
  for (const item of c.pedidoAlLector) lineas.push(`- ${item}`);
  lineas.push("");
  lineas.push("ESTADO DEL EXPERIMENTO");
  lineas.push(`Experimento: ${c.estado.experimento}`);
  lineas.push(`Canal: ${c.estado.canal}`);
  lineas.push(`Promesa: ${c.estado.promesaUnica}`);
  lineas.push(`Presupuesto: USD ${c.estado.presupuestoUsdDia} / día`);
  lineas.push(`Anuncios activos en Meta: ${c.estado.anunciosActivosEnMeta}`);
  lineas.push(`Test A/B/C en Meta: ${c.estado.testTresAngulosEnMeta ? "sí" : "no. En el sitio existen ?a=A|B|C, pero hoy corre un solo anuncio."}`);
  lineas.push(`Kit checkout: ${c.estado.kitCheckout ? "sí" : "no"}`);
  lineas.push(`Programa $250 en este test: ${c.estado.programa250EnTest ? "sí" : "no"}`);
  lineas.push(`Teléfono en el form: ${c.estado.telefonoEnFormulario ? "sí" : "no"}`);
  lineas.push(`Remitente: ${c.estado.remitente}`);
  lineas.push(`Reply-to: ${c.estado.replyTo}`);
  lineas.push(`WhatsApp: ${c.estado.whatsapp}`);
  lineas.push(`Secuencia: ${c.estado.cron}`);
  lineas.push(`Pixel: ${c.estado.pixelMeta}`);
  lineas.push("");
  lineas.push("META (dato del operador, no API)");
  lineas.push(`Fecha: ${c.metaObservado.fecha}`);
  lineas.push(`Visitas landing: ${c.metaObservado.visitasLanding}`);
  lineas.push(`Leads: ${c.metaObservado.leads}`);
  lineas.push(`Conversión: ${c.metaObservado.conversionAprox}`);
  lineas.push(c.metaObservado.nota);
  lineas.push("");
  lineas.push("RESPUESTAS (dato del operador, no API)");
  lineas.push(`Fecha: ${c.respuestasObservadas.fecha}`);
  lineas.push(`Correo 1 (número 1/2/3): ${c.respuestasObservadas.respuestasCorreo1Numero}`);
  lineas.push(`Correo 2 (una línea): ${c.respuestasObservadas.respuestasCorreo2Linea}`);
  lineas.push(`Correo 3 (una línea): ${c.respuestasObservadas.respuestasCorreo3Linea}`);
  lineas.push(`WhatsApp: ${c.respuestasObservadas.whatsapp}`);
  lineas.push(c.respuestasObservadas.nota);
  lineas.push("");
  lineas.push("ANGULOS DISEÑADOS (no todos están al aire)");
  for (const ad of c.angulosDisenados) {
    lineas.push(`${ad.id} · ${ad.angulo} · ${ad.linea} · ${ad.url}`);
  }
  lineas.push("");
  lineas.push("ANUNCIO");
  lineas.push(`Headline: ${c.anuncio.headline}`);
  lineas.push(`CTA: ${c.anuncio.cta}`);
  lineas.push(`Texto imagen: ${c.anuncio.textoImagen}`);
  lineas.push("Primary text:");
  lineas.push(c.anuncio.primaryText);
  lineas.push("");
  lineas.push("LANDING");
  lineas.push(`URL: ${c.landing.url}`);
  lineas.push(`Headline: ${c.landing.headline}`);
  lineas.push(`Subheadline: ${c.landing.subheadline}`);
  lineas.push(`CTA: ${c.landing.cta}`);
  lineas.push(`Formulario: ${c.landing.formulario}`);
  lineas.push(`Validación: ${c.landing.validacionTitulo}`);
  for (const linea of c.landing.validacion) lineas.push(`- ${linea}`);
  lineas.push(`Destacado: ${c.landing.destacado}`);
  lineas.push(c.landing.decisionesTitulo);
  c.landing.decisiones.forEach((item, i) => lineas.push(`${i + 1}. ${item}`));
  lineas.push(`Autoridad: ${c.landing.autoridad}`);
  lineas.push("");
  lineas.push("THANK-YOU / KIT");
  lineas.push(`URL: ${c.thankyou.url}`);
  lineas.push(`H1: ${c.thankyou.h1}`);
  lineas.push(`Kit: ${c.thankyou.kit}`);
  lineas.push(c.thankyou.distincion);
  lineas.push(c.thankyou.checkout);
  lineas.push("");
  lineas.push("UMBRALES");
  for (const item of c.umbrales) lineas.push(`- ${item}`);
  lineas.push("");
  lineas.push("POSTHOG");
  lineas.push(`Eventos: ${c.posthog.eventos.join("; ")}`);
  lineas.push(c.posthog.nota);
  return lineas.join("\n");
}
