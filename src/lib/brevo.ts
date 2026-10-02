const GUIA_URL = "https://www.gpedrosa.cl/captacion/guia";
const WHATSAPP = "https://wa.me/56968257817";

const SENDER = {
  name: process.env.BREVO_SENDER_NAME || "Gonzalo Pedrosa",
  email: process.env.BREVO_SENDER_EMAIL || "ansiosamente@gpedrosa.cl",
};

export type CorreoCaptacion = 1 | 2 | 3 | 4;

type Plantilla = {
  asunto: string;
  tag: string;
  idempotency: string;
  texto: string;
  html: string;
};

function whatsapp(texto: string) {
  return `${WHATSAPP}?text=${encodeURIComponent(texto)}`;
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

const PLANTILLAS: Record<CorreoCaptacion, Plantilla> = {
  1: {
    asunto: "Acá está tu guía: 7 decisiones",
    tag: "correo-1-guia",
    idempotency: "guia-7-decisiones",
    texto: `Hola,

Pediste la guía para familiares de alguien que apuesta. Acá está:

${GUIA_URL}

Son 7 decisiones y unos 15 minutos. No hace falta leerla de una. Empieza por la decisión que más te está costando ahora: si prestar, si creerle, o qué hacer si vuelve a pedir plata.

La escribí yo. Si algo no te calza con lo que estás viviendo, responde este correo.

${pie()}`,
    html: `<p>Hola,</p>
<p>Pediste la guía para familiares de alguien que apuesta. Acá está:</p>
<p><a href="${GUIA_URL}">${GUIA_URL}</a></p>
<p>Son 7 decisiones y unos 15 minutos. No hace falta leerla de una. Empieza por la decisión que más te está costando ahora: si prestar, si creerle, o qué hacer si vuelve a pedir plata.</p>
<p>La escribí yo. Si algo no te calza con lo que estás viviendo, responde este correo.</p>
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

Eso está en la decisión 2 de la guía:
${GUIA_URL}#decision-2

Si esto te está pasando ahora y quieres hablarlo, escríbeme:
${whatsapp("Hola Gonzalo, vengo del correo sobre prestar plata y quiero hablar.")}

${pie()}`,
    html: `<p>Hola,</p>
<p>Si te vuelve a pedir plata, no tienes que responder en el momento.</p>
<p>Antes de prestar, necesitas tres datos: para qué es, a nombre de quién está la deuda, y qué gasto tuyo queda sin pagar si no te la devuelven.</p>
<p>El “por última vez” casi nunca es la última. Si la deuda queda a tu nombre, la pagas tú.</p>
<p>Eso está en la decisión 2 de la guía:<br>
<a href="${GUIA_URL}#decision-2">${GUIA_URL}#decision-2</a></p>
<p>Si esto te está pasando ahora y quieres hablarlo, escríbeme:<br>
<a href="${whatsapp("Hola Gonzalo, vengo del correo sobre prestar plata y quiero hablar.")}">Escribirme por WhatsApp</a></p>
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

Eso está en la decisión 4 de la guía:
${GUIA_URL}#decision-4

Si esto te está pasando ahora, escríbeme:
${whatsapp("Hola Gonzalo, vengo del correo sobre creerle y quiero hablar.")}

${pie()}`,
    html: `<p>Hola,</p>
<p>Después de varias mentiras, quieres creer y también dudas. No tienes que saber si la promesa es sincera para decidir qué harás tú.</p>
<p>Fíjate en lo que hace, no solo en lo que dice: si pidió ayuda, si te cuenta antes de que lo descubras, si acepta que tengas dudas.</p>
<p>Vivir entre creer y dudar desgasta. Cada cargo nuevo te devuelve al mismo lugar.</p>
<p>Eso está en la decisión 4 de la guía:<br>
<a href="${GUIA_URL}#decision-4">${GUIA_URL}#decision-4</a></p>
<p>Si esto te está pasando ahora, escríbeme:<br>
<a href="${whatsapp("Hola Gonzalo, vengo del correo sobre creerle y quiero hablar.")}">Escribirme por WhatsApp</a></p>
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

Eso está en la decisión 6 de la guía:
${GUIA_URL}#decision-6

Si quieres hablarlo, escríbeme:
${whatsapp("Hola Gonzalo, vengo del correo si vuelve a apostar y quiero hablar.")}

${pie()}`,
    html: `<p>Hola,</p>
<p>Que haya vuelto a apostar no significa que tú hayas fallado ni que debas pagar.</p>
<p>Si reaccionas igual que la última vez, lo más probable es que pase lo mismo que la última vez.</p>
<p>Primero mira si alguien corre peligro. Si estás a salvo, puedes tomarte tiempo. No tienes que decidir toda la relación en la misma hora.</p>
<p>Eso está en la decisión 6 de la guía:<br>
<a href="${GUIA_URL}#decision-6">${GUIA_URL}#decision-6</a></p>
<p>Si quieres hablarlo, escríbeme:<br>
<a href="${whatsapp("Hola Gonzalo, vengo del correo si vuelve a apostar y quiero hablar.")}">Escribirme por WhatsApp</a></p>
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
