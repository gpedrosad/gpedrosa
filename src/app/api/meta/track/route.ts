// src/app/api/meta/track/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // temporalmente sin uso
  return NextResponse.json({ ok: true, disabled: true });
}