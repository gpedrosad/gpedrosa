import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: {
    email?: unknown;
    website?: unknown;
    resource?: unknown;
    angulo?: unknown;
    simular?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Los datos enviados no son válidos." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.length > 0) return NextResponse.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ message: "Ingresa un email válido." }, { status: 400 });
  }

  const webhookUrl = process.env.CAPTACION_WEBHOOK_URL;
  const simular = body.simular === true || !webhookUrl;
  if (simular) {
    return NextResponse.json({ ok: true, simulado: true });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CAPTACION_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CAPTACION_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        email,
        resource:
          typeof body.resource === "string" && body.resource.trim()
            ? body.resource.trim().slice(0, 64)
            : "7-decisiones",
        source: "landing-captacion",
        angulo: body.angulo === "B" || body.angulo === "C" ? body.angulo : "A",
        createdAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("captacion webhook error", error);
    return NextResponse.json({ message: "No pudimos enviar la guía. Intenta de nuevo en unos minutos." }, { status: 502 });
  }
}
