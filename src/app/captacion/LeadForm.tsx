"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { captar } from "@/lib/posthog-captacion";
import { guardarEventos, leerEventos } from "./eventos";

type FormState = "idle" | "sending" | "sent" | "error";

type Props = {
  id?: string;
  resource?: string;
  angulo?: "A" | "B" | "C";
  button?: string;
};

export default function LeadForm({
  id = "lead",
  resource = "7-decisiones",
  angulo = "B",
  button = "Recibir la guía gratis",
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/captacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"),
          resource,
          angulo,
        }),
      });
      const result = (await response.json()) as { message?: string; simulado?: boolean };
      if (!response.ok) throw new Error(result.message || "No pudimos enviar la guía.");

      if (typeof window !== "undefined") {
        const eventos = leerEventos();
        eventos.unshift({
          t: new Date().toISOString(),
          evento: "captacion_email",
          angulo,
          simulado: Boolean(result.simulado),
        });
        guardarEventos(eventos.slice(0, 50));
        captar("captacion_email", { angulo, simulado: Boolean(result.simulado) });
        if (!result.simulado && "fbq" in window) {
          (window as typeof window & { fbq: (...args: unknown[]) => void }).fbq("track", "Lead");
        }
      }
      setState("sent");
      router.push("/captacion/gracias");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No pudimos enviar la guía. Intenta de nuevo.");
    }
  }

  return (
    <form method="post" action="/api/captacion" onSubmit={submit} className="space-y-2.5">
      <label htmlFor={`${id}-email`} className="block text-sm font-medium text-neutral-800">
        Tu email
      </label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        required
        autoComplete="email"
        className="h-11 w-full border border-neutral-500 bg-white px-3 text-base outline-none focus:border-neutral-900"
      />
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="angulo" value={angulo} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Sitio web</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={state === "sending" || state === "sent"}
        className="flex h-11 w-full items-center justify-center bg-neutral-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {state === "sending" ? "Enviando…" : state === "sent" ? "Guía enviada" : button}
      </button>
      <p className="text-xs leading-4 text-neutral-600">
        La guía te llega por correo desde Gonzalo Pedrosa. Después te escribo sobre este tema y puedes
        darte de baja con un clic.{" "}
        <Link href="/privacidad" prefetch={false} className="underline underline-offset-2">
          Privacidad</Link>.
      </p>
      <div
        aria-live="polite"
        className={`text-sm ${state === "error" ? "text-red-700" : "text-neutral-700"}`}
      >
        {message}
      </div>
    </form>
  );
}
