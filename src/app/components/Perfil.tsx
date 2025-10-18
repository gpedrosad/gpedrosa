"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import SobreMi from "./SobreMi";
import Footer from "./Footer";

// Lazy de Feed (performance)
const Feed = dynamic(() => import("./Feed"), { ssr: false });

/* ────────────────────────────────────────────────────────────────────────────
   Tipos globales p/ depuración (sin any)
   ──────────────────────────────────────────────────────────────────────────── */
type LastSchedule = {
  ts: string;
  eventId: string;
  pixelParams: Record<string, unknown>;
  meta: Record<string, string>;
  fbqReady: boolean;
  pixelId: string;
};

declare global {
  interface Window {
    fbq?: FBQ;
    __lastSchedule?: LastSchedule;
  }
}

/* ────────────────────────────────────────────────────────────────────────────
   Pixel helpers (FRONT, usando el snippet oficial del layout)
   ──────────────────────────────────────────────────────────────────────────── */
type FBQ = (event: "init" | "track" | "trackCustom" | string, ...args: unknown[]) => void;
const getFbq = () => (globalThis as unknown as { fbq?: FBQ }).fbq;

const PIXEL_ID_CLIENT = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";
const DEBUG_PIXEL = true;

const makeEventId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/** Envia track si fbq está listo. No hace init (lo hace el layout). */
function trackNow(
  eventName: "ViewContent" | "Schedule" | string,
  params: Record<string, unknown>,
  eventId?: string
): boolean {
  const f = getFbq();
  if (DEBUG_PIXEL) {
    console.groupCollapsed(`[PIXEL] trackNow → ${eventName}`);
    console.log("fbq typeof:", typeof f);
    console.log("pixelId:", PIXEL_ID_CLIENT || "(vacío)");
    console.log("eventId:", eventId);
    console.log("params:", params);
    console.groupEnd();
  }
  if (typeof f !== "function") return false;
  try {
    if (eventId) f("track", eventName, params, { eventID: eventId });
    else f("track", eventName, params);
    console.info(`[PIXEL] ${eventName} ENVIADO`, { sentAsBoth: false, params, eventId });
    return true;
  } catch (e) {
    console.error(`[PIXEL] ${eventName} ERROR (now)`, e);
    return false;
  }
}

/** Reintenta enviar el track si fbq aún no está listo. */
function trackWithRetry(
  eventName: "ViewContent" | "Schedule" | string,
  params: Record<string, unknown>,
  eventId?: string,
  retries = 20,
  intervalMs = 150
) {
  let attempts = 0;
  const startedAt = performance.now();

  const trySend = () => {
    attempts++;
    const ok = trackNow(eventName, params, eventId);
    if (ok) {
      if (DEBUG_PIXEL) {
        console.debug(
          `[PIXEL] ${eventName} ENVIADO (reintento #${attempts}, +${Math.round(
            performance.now() - startedAt
          )}ms)`
        );
      }
      return;
    }
    if (attempts < retries) {
      setTimeout(trySend, intervalMs);
    } else {
      console.warn(
        `[PIXEL] ${eventName} cancelado tras ${attempts} intentos (fbq no disponible)`
      );
    }
  };

  trySend();
}

function collectAttribution(base: Record<string, string> = {}) {
  const meta: Record<string, string> = { ...base };
  try {
    const usp = new URLSearchParams(window.location.search);
    for (const k of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
    ]) {
      const v = usp.get(k);
      if (v) meta[k] = v;
    }
    const cs = document.cookie || "";
    const fbc = /(?:^|;\s*)_fbc=([^;]+)/.exec(cs)?.[1];
    const fbp = /(?:^|;\s*)_fbp=([^;]+)/.exec(cs)?.[1];
    if (fbc) meta.fbc = fbc;
    if (fbp) meta.fbp = fbp;
    meta.url = window.location.href;
    if (document.referrer) meta.referrer = document.referrer;
  } catch {
    // noop
  }
  return meta;
}

/* ────────────────────────────────────────────────────────────────────────────
   WhatsApp helpers
   ──────────────────────────────────────────────────────────────────────────── */
const WHATS_NUMBER = "56968257817"; // sin '+' para wa.me

function makeWhatsMessage(
  serviceName: string,
  priceStr: string,
  currency: string,
  source: "inline" | "sticky",
  eventId: string
): string {
  return `Hola Gonzalo, quiero agendar: ${serviceName} (${priceStr} ${currency}). Vengo desde la web. Fuente: ${source}. ID:${eventId}`;
}

function makeWhatsUrl(message: string): string {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Abre WhatsApp (nuevo tab; si está bloqueado, redirige misma pestaña) */
function openWhatsApp(url: string) {
  try {
    const newWin = window.open(url, "_blank", "noopener,noreferrer");
    if (!newWin) {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
}

// Marca interacción humana (sólo para habilitar ciertas acciones)
function useHumanInteraction(delayMs = 350) {
  const [interacted, setInteracted] = React.useState(false);
  React.useEffect(() => {
    const timer = window.setTimeout(() => setInteracted(true), delayMs);
    const mark = () => {
      setInteracted(true);
      clearTimeout(timer);
    };
    window.addEventListener("pointerdown", mark, { once: true, passive: true });
    window.addEventListener("keydown", mark, { once: true, passive: true });
    window.addEventListener("scroll", mark, { once: true, passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
      window.removeEventListener("scroll", mark);
    };
  }, [delayMs]);
  return interacted;
}

/* ────────────────────────────────────────────────────────────────────────────
   Tipos y datos
   ──────────────────────────────────────────────────────────────────────────── */
type Dias =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";
type HorariosSeleccionados = Record<Dias, string[]>;

interface ProfileData {
  name: string;
  description: string;
  topics: string[];
  photo: string;
  services: Array<{
    id: string;
    name: string;
    priceCLP: number;
    duration: number;
    selected_slots: HorariosSeleccionados;
  }>;
}

const Profile: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const interacted = useHumanInteraction(400);
  const lastScheduleTsRef = React.useRef(0);

  React.useEffect(() => setMounted(true), []);

  const currency = "CLP" as const;
  const moneyLocale = "es-CL";
  const formatMoney = (n: number) => n.toLocaleString(moneyLocale);

  // Contenido estático
  const profileData: ProfileData = {
    name: "Gonzalo Pedrosa",
    description:
      "Acompañamiento para organizar ideas y tomar decisiones con claridad. Espacio cercano, privado y en formato online.",
    topics: ["Hábitos y organización", "Límites"],
    photo: "/yo.png",
    services: [
      {
        id: "service1",
        name: "Sesión online",
        priceCLP: 35000,
        duration: 50,
        selected_slots: {
          Lunes: ["11:00 - 11:45"],
          Martes: ["12:00 - 12:45"],
          Miércoles: ["10:00 - 10:45"],
          Jueves: ["14:00 - 14:45"],
          Viernes: ["16:00 - 16:45"],
          Sábado: [],
          Domingo: [],
        },
      },
    ],
  };

  const primaryService = profileData.services[0];
  const averageRating = 4.8;
  const NumerodeExperiencias = 281;

  // ViewContent cuando ya hubo interacción (usamos el snippet oficial, sin init acá)
  React.useEffect(() => {
    if (!mounted || !interacted) return;
    const eventId = makeEventId("vc-profile");
    const params: Record<string, unknown> = {
      content_type: "service",
      content_ids: [primaryService.id],
      value: primaryService.priceCLP,
      currency,
    };
    const t = window.setTimeout(() => {
      const sent = trackNow("ViewContent", params, eventId);
      if (!sent) trackWithRetry("ViewContent", params, eventId);
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, interacted, primaryService.id, primaryService.priceCLP, currency]);

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex text-[#FFB703]">
        {Array.from({ length: 5 }, (_, i) =>
          i < rounded ? <AiFillStar key={i} size={30} /> : <AiOutlineStar key={i} size={30} />
        )}
      </div>
    );
  };

  // CLICK CTA -> Schedule (SOLO PIXEL FRONT) + abrir WhatsApp (debounce)
  const handleAgendarClick = (source: "inline" | "sticky" = "inline") => {
    const now = Date.now();
    if (now - lastScheduleTsRef.current < 600) {
      console.debug("[CTA] Schedule ignorado por debounce", {
        deltaMs: now - lastScheduleTsRef.current,
      });
      return;
    }
    lastScheduleTsRef.current = now;

    console.group("[CTA] Agendar click");
    console.log("source:", source);

    const eventId = makeEventId("schedule-profile");
    const pixelParams: Record<string, unknown> = {
      content_type: "service",
      content_ids: [primaryService.id],
      value: primaryService.priceCLP,
      currency,
      source,
    };

    // WhatsApp: mensaje y URL
    const priceStr = formatMoney(primaryService.priceCLP);
    const waMessage = makeWhatsMessage(
      primaryService.name,
      priceStr,
      currency,
      source,
      eventId
    );
    const waUrl = makeWhatsUrl(waMessage);

    // Para ayudarte a depurar attribution y contexto de página
    const meta = collectAttribution({ page: "profile", source });
    console.log("attribution/meta:", meta);

    // Estado actual del fbq antes de enviar
    const f = getFbq();
    console.table({
      hasFbq: typeof f === "function",
      hasPixelId: Boolean(PIXEL_ID_CLIENT),
      eventId,
    });

    // 1) Browser Pixel (normal)
    const sent = trackNow("Schedule", pixelParams, eventId);
    if (!sent) trackWithRetry("Schedule", pixelParams, eventId);

    // 2) Abrir WhatsApp inmediatamente tras el click (para evitar bloqueos)
    openWhatsApp(waUrl);

    // 3) Exponer último intento en window para inspección manual
    window.__lastSchedule = {
      ts: new Date().toISOString(),
      eventId,
      pixelParams,
      meta,
      fbqReady: typeof f === "function",
      pixelId: PIXEL_ID_CLIENT,
    };
    console.log("window.__lastSchedule:", window.__lastSchedule);
    console.groupEnd();
  };

  // Carga perezosa de Feed: tras scroll
  const [showFeed, setShowFeed] = React.useState(false);
  React.useEffect(() => {
    if (!interacted) return;
    const onScroll = () => {
      if (window.scrollY > 480) {
        setShowFeed(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [interacted]);

  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="w-full bg-white rounded-lg shadow-lg p-10 md:p-16">
        <div className="mb-4">
          <span className="inline-block bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            Valorados por quienes reservaron
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Image
            src={profileData.photo}
            alt={profileData.name}
            width={240}
            height={240}
            priority
            className="rounded-lg mb-4 object-cover"
          />
          <h2 className="text-2xl md:text-4xl font-bold">{profileData.name}</h2>

          <div className="flex flex-col items-center mt-4 space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-gray-800 text-2xl md:text-3xl font-semibold">
                {averageRating.toFixed(1)}
              </p>
              {renderStars(averageRating)}
            </div>
            <p className="text-gray-500 text-md md:text-lg">
              ({NumerodeExperiencias} experiencias)
            </p>
          </div>
        </div>

        {/* Sección “Sobre mí” */}
        <SobreMi content={profileData.description} />

        <div className="mt-12">
          <hr className="my-6 border-gray-300" />
          <h3 className="text-xl md:text-3xl font-semibold mb-4 text-left">
            Áreas de enfoque
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {profileData.topics.map((topic, index) => (
              <span
                key={index}
                className="bg-[#023047] text-white text-sm md:text-xl font-medium px-3 py-1 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
          <hr className="my-6 border-gray-300" />
        </div>

        <div className="mt-12">
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">Servicios disponibles</h3>
          {profileData.services.map((service) => (
            <div
              key={service.id}
              className="p-6 bg-white border-l-4 border-[#023047] rounded-lg mb-6 w-full max-w-md shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex flex-col space-y-4">
                <h4 className="text-xl font-bold text-[#023047]">{service.name}</h4>

                <div className="flex flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    {/* duración */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{service.duration} minutos</span>
                  </div>

                  <div className="flex items-center">
                    {/* precio */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-lg text-[#023047]">
                      {formatMoney(service.priceCLP)} {currency}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAgendarClick("inline")}
                  className="flex w-full bg-[#023047] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#03506f] active:scale-95 transition-all duration-200 justify-center items-center space-x-2"
                  data-cta="agendar-inline"
                >
                  {/* ícono calendario */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Agendar sesión (WhatsApp)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-24 md:hidden" aria-hidden />

      {/* Feed: carga perezosa tras scroll */}
      {showFeed && <Feed />}

      <hr className="w-full border-gray-300 mt-12 mb-8" />

      <Footer />

      {/* CTA sticky mobile */}
      {primaryService && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-xl flex items-center gap-3 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{primaryService.name}</span>
              <span className="text-base font-semibold text-[#023047]">
                {formatMoney(primaryService.priceCLP)} {currency}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleAgendarClick("sticky")}
              className="ml-auto inline-flex items-center justify-center rounded-xl bg-[#023047] text-white px-5 py-3 font-semibold shadow-sm hover:bg-[#03506f] active:scale-95 transition"
              data-cta="agendar-sticky"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agendar por WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;