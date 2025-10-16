// app/api/meta/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

// ─────────────────────────────────────────────────────────────────────────────
// ENV
// ─────────────────────────────────────────────────────────────────────────────
const PIXEL_ID =
  process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";
const ACCESS_TOKEN =
  process.env.META_ACCESS_TOKEN ?? process.env.FACEBOOK_ACCESS_TOKEN ?? "";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v19.0";
const ENV_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const ENV_TEST_ENABLED = process.env.META_TEST_EVENTS_ENABLED === "1"; // Test Events global

// ─────────────────────────────────────────────────────────────────────────────
// Tipos (front -> server)
// ─────────────────────────────────────────────────────────────────────────────
type CurrencyISO = string; // p.ej. "CLP" | "ARS" | "USD"

interface FrontMeta {
  url?: string;
  referrer?: string;
  fbc?: string;
  fbp?: string;
  // UTM / ads allowed
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
}

interface FrontBody {
  event_name?: string;      // por defecto "InitiateCheckout"
  event_id?: string;        // para deduplicación
  value?: number;
  currency?: CurrencyISO;
  content_ids?: string[];
  content_type?: string;
  source?: string;          // etiqueta propia (inline/sticky/etc.)
  meta?: FrontMeta;         // { url, referrer, utms..., fbc, fbp }
  client_ts?: number;       // timestamp del cliente (ms)
  // PII opcional (se hashea aquí):
  email?: string;
  phone?: string;
  external_id?: string;
  // Test Events (para Events Manager)
  test_event_code?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos (Graph API)
// ─────────────────────────────────────────────────────────────────────────────
interface UserData {
  client_user_agent?: string;
  client_ip_address?: string;
  fbc?: string;
  fbp?: string;
  em?: string[];        // emails hasheados
  ph?: string[];        // teléfonos hasheados
  external_id?: string; // id externo hasheado
}

interface CustomData {
  currency?: CurrencyISO;
  value?: number;
  content_ids?: string[];
  content_type?: string;
}

interface GraphEvent {
  event_name: string;
  event_time: number; // unix seconds
  event_id?: string;
  action_source: "website";
  event_source_url?: string;
  user_data: UserData;
  custom_data?: CustomData;
}

interface GraphPayload {
  data: GraphEvent[];
  test_event_code?: string;
}

interface GraphResponse {
  events_received?: number;
  fbtrace_id?: string;
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
  [k: string]: unknown;
}

// ─────────────────────────────────────────────────────────────────────────────
/** Utils */
// ─────────────────────────────────────────────────────────────────────────────
function sha256(v: string): string {
  return crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
}

function getClientIp(req: NextRequest): string | undefined {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim();
  const xr = req.headers.get("x-real-ip");
  if (xr) return xr.trim();
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return undefined;
}

function getCountryFromHeaders(req: NextRequest): "CL" | "AR" | undefined {
  const cc =
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-country");
  const up = cc?.toUpperCase();
  if (up === "CL" || up === "AR") return up as "CL" | "AR";
  return undefined;
}

function toE164(raw: string, country: "CL" | "AR" = "CL"): string {
  // Implementación simple (ideal: libphonenumber-js)
  let d = raw;
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("+")) return d.replace(/[^\d+]/g, "");
  d = d.replace(/[^\d]/g, "");
  if (country === "CL" && !d.startsWith("56")) d = "56" + d.replace(/^0+/, "");
  if (country === "AR" && !d.startsWith("54")) d = "54" + d.replace(/^0+/, "");
  return `+${d}`;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
}

function stringArrayOrUndef(v: unknown): string[] | undefined {
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  return undefined;
}

// Sanitiza URL: deja solo UTM/fbclid/gclid, borra hash
function sanitizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    const keep = new Set([
      "fbclid",
      "gclid",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ]);
    for (const k of Array.from(u.searchParams.keys())) {
      if (!keep.has(k)) u.searchParams.delete(k);
    }
    u.hash = "";
    return u.toString();
  } catch {
    return raw;
  }
}

// Whitelist de meta permitido (evita fuga de campos arbitrarios)
const ALLOWED_META = new Set([
  "url",
  "referrer",
  "fbc",
  "fbp",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
]);

function toFrontBody(raw: unknown): FrontBody {
  const r = asRecord(raw) ?? {};
  const metaRec = asRecord(r.meta) ?? {};
  const meta: FrontMeta = {};
  for (const [k, v] of Object.entries(metaRec)) {
    if (typeof v === "string" && ALLOWED_META.has(k)) {
      (meta as any)[k] = v;
    }
  }
  return {
    event_name: typeof r.event_name === "string" ? r.event_name : undefined,
    event_id: typeof r.event_id === "string" ? r.event_id : undefined,
    value: typeof r.value === "number" ? r.value : undefined,
    currency: typeof r.currency === "string" ? (r.currency as string) : undefined,
    content_ids: stringArrayOrUndef(r.content_ids),
    content_type: typeof r.content_type === "string" ? r.content_type : undefined,
    source: typeof r.source === "string" ? r.source : undefined,
    meta,
    client_ts: typeof r.client_ts === "number" ? r.client_ts : undefined,
    email: typeof r.email === "string" ? r.email : undefined,
    phone: typeof r.phone === "string" ? r.phone : undefined,
    external_id: typeof r.external_id === "string" ? r.external_id : undefined,
    test_event_code: typeof r.test_event_code === "string" ? r.test_event_code : undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return NextResponse.json(
        { ok: false, error: "Faltan PIXEL_ID o ACCESS_TOKEN en variables de entorno" },
        { status: 500 }
      );
    }

    // Lee el body una sola vez y tipa seguro
    const raw = await req.json();
    const body = toFrontBody(raw);
    const qs = req.nextUrl.searchParams;

    // Mostrar explícitamente “Servidor” en Test Events (evita dedupe con browser)
    const showServer = qs.get("showServer") === "1";

    // Toggle de Test Events
    const testParam = qs.get("test");
    let test_event_code: string | undefined;
    if (testParam === "1") {
      test_event_code = body.test_event_code ?? ENV_TEST_EVENT_CODE;
    } else if (testParam === "0") {
      test_event_code = undefined;
    } else {
      test_event_code = body.test_event_code ?? (ENV_TEST_ENABLED ? ENV_TEST_EVENT_CODE : undefined);
    }

    const event_name = body.event_name ?? "InitiateCheckout";
    const original_event_id = body.event_id;
    const event_time = Math.floor(Number(body.client_ts ?? Date.now()) / 1000);

    // event_id (marca -srv si se quiere ver el evento Server por separado)
    const event_id = showServer
      ? original_event_id
        ? `${original_event_id}-srv`
        : `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      : original_event_id;

    // user_data
    const user_data: UserData = {
      client_user_agent: req.headers.get("user-agent") ?? undefined,
      client_ip_address: getClientIp(req),
      fbc: body.meta?.fbc,
      fbp: body.meta?.fbp,
    };

    // PII opcional hasheada (recomendado por Meta)
    if (body.email) user_data.em = [sha256(body.email)];
    if (body.phone) {
      const cc = getCountryFromHeaders(req) ?? "CL"; // ajusta default según tu tráfico
      const e164 = toE164(body.phone, cc);
      user_data.ph = [sha256(e164)];
    }
    if (body.external_id) user_data.external_id = sha256(body.external_id);

    // custom_data
    const custom_data: CustomData = {
      currency: body.currency,
      value: typeof body.value === "number" ? body.value : undefined,
      content_ids: body.content_ids,
      content_type: body.content_type,
    };

    // URL de origen (sanitizada)
    const rawUrl = body.meta?.url ?? req.nextUrl.toString();
    const event_source_url = sanitizeUrl(rawUrl);

    const graphEvent: GraphEvent = {
      event_name,
      event_time,
      event_id,
      action_source: "website",
      event_source_url,
      user_data,
      custom_data,
    };

    const payload: GraphPayload = {
      data: [graphEvent],
      ...(test_event_code ? { test_event_code } : {}),
    };

    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
      ACCESS_TOKEN
    )}`;

    const fbRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const fbJson = (await fbRes.json()) as GraphResponse;
    const ok = fbRes.ok && (fbJson.events_received ?? 0) >= 1;

    // Respuesta: minimal, sin exponer ip/ua/PII
    return NextResponse.json(
      {
        ok,
        fb: fbJson,
        sent: {
          event_name,
          event_id,
          event_time,
          source: body.source,
          test_event_code: test_event_code ?? null,
          meta: {
            // solo eco de campos “seguros”
            referrer: body.meta?.referrer,
            url: event_source_url,
            utm_source: body.meta?.utm_source,
            utm_medium: body.meta?.utm_medium,
            utm_campaign: body.meta?.utm_campaign,
            utm_term: body.meta?.utm_term,
            utm_content: body.meta?.utm_content,
            fbclid: body.meta?.fbclid,
            gclid: body.meta?.gclid,
          },
        },
      },
      { status: ok ? 200 : 502 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}