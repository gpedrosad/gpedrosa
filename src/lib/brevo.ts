const SITIO = "https://www.gpedrosa.cl";

const SENDER = {
  name: process.env.BREVO_SENDER_NAME || "Gonzalo Pedrosa",
  email: process.env.BREVO_SENDER_EMAIL || "ansiosamente@gpedrosa.cl",
};

export type CorreoCaptacion = 1 | 2 | 3 | 4;

export const UTM_CORREO = {
  1: "correo-1-guia",
  4: "correo-4-recaida",
} as const;

type Plantilla = {
  asunto: string;
  tag: string;
  idempotency: string;
  texto: string;
  html: string;
};

function utm(content: string) {
  return new URLSearchParams({
    utm_source: "brevo",
    utm_medium: "email",
    utm_campaign: "captacion-secuencia",
    utm_content: content,
  }).toString();
}

function enlaceGuia() {
  return `${SITIO}/captacion/guia?${utm(UTM_CORREO[1])}`;
}

function enlaceWhatsapp() {
  return `${SITIO}/captacion/wa?${utm(UTM_CORREO[4])}`;
}

function pie() {
  return `Gonzalo Pedrosa
Psicólogo · gpedrosa.cl

Si no quieres más correos sobre este tema, respóndeme y te saco de la lista.`;
}

function pieHtml() {
  return `<p>Gonzalo Pedrosa<br>Psicólogo · gpedrosa.cl</p>
<p>Si no quieres más correos sobre este tema, respóndeme y te saco de la lista.</p>`;
}

const GUIA = enlaceGuia();
const WA4 = enlaceWhatsapp();

const PLANTILLAS: Record<CorreoCaptacion, Plantilla> = {
  1: {
    asunto: "Acá está tu guía: 7 decisiones",
    tag: "correo-1-guia",
    idempotency: "guia-7-decisiones",
    texto: `Hola,

Pediste la guía para familiares de alguien que apuesta. Acá está:

${GUIA}

Son 7 decisiones y unos 15 minutos. No hace falta leerla de una.

Responde este correo con un número: 1 si te está costando prestar, 2 si creerle, o 3 si qué hacer si vuelve a pedir plata.

${pie()}`,
    html: `<p>Hola,</p>
<p>Pediste la guía para familiares de alguien que apuesta. Acá está:</p>
<p><a href="${GUIA}">${GUIA}</a></p>
<p>Son 7 decisiones y unos 15 minutos. No hace falta leerla de una.</p>
<p>Responde este correo con un número: 1 si te está costando prestar, 2 si creerle, o 3 si qué hacer si vuelve a pedir plata.</p>
${pieHtml()}`,
  },
  2: {
    asunto: "Antes de pasar plata otra vez",
    tag: "correo-2-plata",
    idempotency: "correo-2-plata",
    texto: `Hola,

Si te vuelve a pedir plata, no tienes que responder en el momento.

Antes de prestar, necesitas tres datos: para qué es, a nombre de quién está la deuda, y qué gasto tuyo queda sin pagar si no te la devuelven.

El “por última vez” casi nunca es la última. Si la deuda queda a tu nombre, la pagas tú.

Si te pide plata esta semana, ¿qué vas a hacer? Responde este correo con una línea.

${pie()}`,
    html: `<p>Hola,</p>
<p>Si te vuelve a pedir plata, no tienes que responder en el momento.</p>
<p>Antes de prestar, necesitas tres datos: para qué es, a nombre de quién está la deuda, y qué gasto tuyo queda sin pagar si no te la devuelven.</p>
<p>El “por última vez” casi nunca es la última. Si la deuda queda a tu nombre, la pagas tú.</p>
<p>Si te pide plata esta semana, ¿qué vas a hacer? Responde este correo con una línea.</p>
${pieHtml()}`,
  },
  3: {
    asunto: "Cuando promete que no va a volver a pasar",
    tag: "correo-3-creerle",
    idempotency: "correo-3-creerle",
    texto: `Hola,

Después de varias mentiras, quieres creer y también dudas. No tienes que saber si la promesa es sincera para decidir qué harás tú.

Fíjate en lo que hace, no solo en lo que dice: si pidió ayuda, si te cuenta antes de que lo descubras, si acepta que tengas dudas.

Vivir entre creer y dudar desgasta. Cada cargo nuevo te devuelve al mismo lugar.

La última vez que prometió que no iba a volver a pasar, ¿tú qué hiciste? Una línea.

${pie()}`,
    html: `<p>Hola,</p>
<p>Después de varias mentiras, quieres creer y también dudas. No tienes que saber si la promesa es sincera para decidir qué harás tú.</p>
<p>Fíjate en lo que hace, no solo en lo que dice: si pidió ayuda, si te cuenta antes de que lo descubras, si acepta que tengas dudas.</p>
<p>Vivir entre creer y dudar desgasta. Cada cargo nuevo te devuelve al mismo lugar.</p>
<p>La última vez que prometió que no iba a volver a pasar, ¿tú qué hiciste? Una línea.</p>
${pieHtml()}`,
  },
  4: {
    asunto: "Si vuelve a apostar",
    tag: "correo-4-recaida",
    idempotency: "correo-4-recaida",
    texto: `Hola,

Que haya vuelto a apostar no significa que tú hayas fallado ni que debas pagar.

Si reaccionas igual que la última vez, lo más probable es que pase lo mismo que la última vez.

Primero mira si alguien corre peligro. Si estás a salvo, puedes tomarte tiempo. No tienes que decidir toda la relación en la misma hora.

Si quieres hablarlo, escríbeme tu situación:
${WA4}

${pie()}`,
    html: `<p>Hola,</p>
<p>Que haya vuelto a apostar no significa que tú hayas fallado ni que debas pagar.</p>
<p>Si reaccionas igual que la última vez, lo más probable es que pase lo mismo que la última vez.</p>
<p>Primero mira si alguien corre peligro. Si estás a salvo, puedes tomarte tiempo. No tienes que decidir toda la relación en la misma hora.</p>
<p>Si quieres hablarlo, escríbeme tu situación:<br>
<a href="${WA4}">${WA4}</a></p>
${pieHtml()}`,
  },
};

function apiKey() {
  return process.env.BREVO_API_KEY;
}

export function brevoDisponible() {
  return Boolean(apiKey());
}

async function brevo(path: string, init: RequestInit) {
  const key = apiKey();
  if (!key) throw new Error("Falta BREVO_API_KEY");
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  headers.set("api-key", key);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const respuesta = await fetch(`https://api.brevo.com/v3${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!respuesta.ok) {
    const crudo = await respuesta.text();
    throw new Error(`Brevo ${path} respondió ${respuesta.status}: ${crudo.slice(0, 280)}`);
  }
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}

export async function guardarContactoLead(email: string) {
  if (!apiKey()) return;
  await brevo("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      updateEnabled: true,
    }),
  });
}

export async function enviarCorreoCaptacion(paso: CorreoCaptacion, email: string) {
  if (!apiKey()) return;
  const destino = email.trim().toLowerCase();
  const plantilla = PLANTILLAS[paso];
  await brevo("/smtp/email", {
    method: "POST",
    headers: {
      "idempotency-key": `${plantilla.idempotency}/${destino}`,
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: destino }],
      replyTo: SENDER,
      subject: plantilla.asunto,
      textContent: plantilla.texto,
      htmlContent: plantilla.html,
      tags: ["captacion", plantilla.tag],
    }),
  });
}

export async function enviarGuiaLead(email: string) {
  await enviarCorreoCaptacion(1, email);
}

export function listarPlantillasCaptacion() {
  return ([1, 2, 3, 4] as CorreoCaptacion[]).map((paso) => {
    const plantilla = PLANTILLAS[paso];
    return {
      paso,
      asunto: plantilla.asunto,
      tag: plantilla.tag,
      texto: plantilla.texto,
    };
  });
}

export type EstadisticaBrevo = {
  tag: string;
  requests: number;
  delivered: number;
  clicks: number;
  uniqueClicks: number;
  opens: number;
  uniqueOpens: number;
  hardBounces: number;
  softBounces: number;
  unsubscribed: number;
};

function numero(valor: unknown) {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : 0;
}

function leerEstadistica(tag: string, crudo: Record<string, unknown> | null): EstadisticaBrevo {
  return {
    tag,
    requests: numero(crudo?.requests),
    delivered: numero(crudo?.delivered),
    clicks: numero(crudo?.clicks),
    uniqueClicks: numero(crudo?.uniqueClicks),
    opens: numero(crudo?.opens),
    uniqueOpens: numero(crudo?.uniqueOpens),
    hardBounces: numero(crudo?.hardBounces),
    softBounces: numero(crudo?.softBounces),
    unsubscribed: numero(crudo?.unsubscribed),
  };
}

export async function estadisticasBrevoCaptacion(desde: string, hasta: string) {
  const tags = [
    "captacion",
    "correo-1-guia",
    "correo-2-plata",
    "correo-3-creerle",
    "correo-4-recaida",
  ];
  const porTag: EstadisticaBrevo[] = [];
  for (const tag of tags) {
    const crudo = (await brevo(
      `/smtp/statistics/aggregatedReport?startDate=${desde}&endDate=${hasta}&tag=${encodeURIComponent(tag)}`,
      { method: "GET" }
    )) as Record<string, unknown> | null;
    porTag.push(leerEstadistica(tag, crudo));
  }
  return porTag;
}
