const GUIA_URL = "https://www.gpedrosa.cl/captacion/guia";

const SENDER = {
  name: process.env.BREVO_SENDER_NAME || "Gonzalo Pedrosa",
  email: process.env.BREVO_SENDER_EMAIL || "ansiosamente@gpedrosa.cl",
};

const ASUNTO = "Acá está tu guía: 7 decisiones";

const TEXTO = `Hola,

Pediste la guía para familiares de alguien que apuesta. Acá está:

${GUIA_URL}

Son 7 decisiones y unos 15 minutos. No hace falta leerla de una. Empieza por la decisión que más te está costando ahora: si prestar, si creerle, o qué hacer si vuelve a pedir plata.

La escribí yo. Si algo no te calza con lo que estás viviendo, responde este correo.

Gonzalo Pedrosa
Psicólogo · gpedrosa.cl

Si no quieres más correos sobre este tema, respóndeme y te saco de la lista.
`;

const HTML = `<p>Hola,</p>
<p>Pediste la guía para familiares de alguien que apuesta. Acá está:</p>
<p><a href="${GUIA_URL}">${GUIA_URL}</a></p>
<p>Son 7 decisiones y unos 15 minutos. No hace falta leerla de una. Empieza por la decisión que más te está costando ahora: si prestar, si creerle, o qué hacer si vuelve a pedir plata.</p>
<p>La escribí yo. Si algo no te calza con lo que estás viviendo, responde este correo.</p>
<p>Gonzalo Pedrosa<br>Psicólogo · gpedrosa.cl</p>
<p>Si no quieres más correos sobre este tema, respóndeme y te saco de la lista.</p>
`;

export function brevoDisponible() {
  return Boolean(process.env.BREVO_API_KEY);
}

export async function enviarGuiaLead(email: string) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return;

  const destino = email.trim().toLowerCase();
  const respuesta = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": key,
      "idempotency-key": `guia-7-decisiones/${destino}`,
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: destino }],
      replyTo: SENDER,
      subject: ASUNTO,
      textContent: TEXTO,
      htmlContent: HTML,
      tags: ["captacion", "correo-1-guia"],
    }),
    cache: "no-store",
  });

  if (!respuesta.ok) {
    const crudo = await respuesta.text();
    throw new Error(`Brevo respondió ${respuesta.status}: ${crudo.slice(0, 280)}`);
  }
}
