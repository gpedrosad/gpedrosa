// app/api/meta/track/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// ENV requeridas
const PIXEL_ID =
  process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";
const ACCESS_TOKEN =
  process.env.META_ACCESS_TOKEN ?? process.env.FACEBOOK_ACCESS_TOKEN ?? "";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v19.0";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos (front -> server)
// ─────────────────────────────────────────────────────────────────────────────
type CurrencyISO = string; // "CLP" | "ARS" | "USD"...

interface FrontMeta {
  url?: string;      // se sanitiza a origin+pathname
  referrer?: string; // idem
  fbc?: string;
  fbp?: string;
  // otros campos (utm, etc.) se ignoran
}

interface FrontBody {
  event_name?: string;      // por defecto "ViewContent"
  event_id?: string;        // para deduplicación con el del navegador
  value?: number;
  currency?: CurrencyISO;
  content_ids?: string[];
  content_type?: string;    // ej. "service"
  source?: string;          // etiqueta propia (inline/sticky/etc.)
  meta?: FrontMeta;         // { url, referrer, fbc, fbp }
  client_ts?: number;       // timestamp del cliente (ms)
  // ⚠️ PII (email/phone/external_id) si vinieran, se ignoran
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos (Graph API)
// ─────────────────────────────────────────────────────────────────────────────
interface UserData {
  client_user_agent?: string;
  // ⚠️ NO enviamos IP
  fbc?: string;
  fbp?: string;
  // ⚠️ NO enviamos PII (em/ph/external_id)
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
  event_source_url?: string; // sanitizada
  user_data: UserData;  
  custom_data?: CustomData;
}

interface GraphPayload {
  data: GraphEvent[];
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
// Utils
// ─────────────────────────────────────────────────────────────────────────────
function asRecord(v: unknown): Record<string, unknown> | null {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
}

function stringArrayOrUndef(v: unknown): string[] | undefined {
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  return undefined;
}

function sanitizeUrl(u?: string | null): string | undefined {
  if (!u) return undefined;
  try {
    const url = new URL(u);
    return `${url.origin}${url.pathname}`; // sin query ni hash
  } catch {
    return undefined;
  }
}

function toFrontBody(raw: unknown): FrontBody {
  const r = asRecord(raw) ?? {};
  const metaRec = asRecord(r.meta) ?? {};
  const meta: FrontMeta = {};
  for (const [k, v] of Object.entries(metaRec)) {
    if (typeof v === "string") meta[k as keyof FrontMeta] = v as string;
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
    // PII potencial (email/phone/external_id) se ignoran a propósito
  };
}

// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return NextResponse.json(
        { ok: false, error: "Faltan PIXEL_ID o ACCESS_TOKEN en variables de entorno" },
        { status: 500 }
      );
    }

    const body = toFrontBody(await req.json());

    const event_name = body.event_name ?? "ViewContent";
    const event_time = Math.floor(Number(body.client_ts ?? Date.now()) / 1000);
    const event_id = body.event_id; // dedup con el del navegador

    // user_data mínimo y seguro
    const user_data: UserData = {
      client_user_agent: req.headers.get("user-agent") ?? undefined,
      fbc: body.meta?.fbc,
      fbp: body.meta?.fbp,
    };

    // custom_data opcional
    const custom_data: CustomData = {
      currency: body.currency,
      value: typeof body.value === "number" ? body.value : undefined,
      content_ids: body.content_ids,
      content_type: body.content_type,
    };

    // event_source_url: siempre sanitizada
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

    const payload: GraphPayload = { data: [graphEvent] };

    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
      ACCESS_TOKEN
    )}`;

    const fbRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const fbJson = (await fbRes.json()) as GraphResponse;
    const ok = fbRes.ok && (fbJson.events_received ?? 0) >= 1;

    return NextResponse.json(
      {
        ok,
        fb: fbJson,
        sent: {
          event_name,
          event_id,
          event_time,
          source: body.source ?? null,
          meta: {
            url: event_source_url,
            ...(body.meta?.referrer ? { referrer: sanitizeUrl(body.meta.referrer) } : {}),
            fbc: body.meta?.fbc ?? null,
            fbp: body.meta?.fbp ?? null,
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