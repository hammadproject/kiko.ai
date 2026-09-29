"use server";

import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { neon } from "@neondatabase/serverless";
import {
  consultationInputFromFormData,
  consultationSchema,
  type ConsultationActionState,
} from "@/lib/consultation-schema";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

const rateLimits = new Map<string, number[]>();
const recentSubmissions = new Map<string, number>();

function checkRateLimit(identifier: string) {
  const now = Date.now();
  const recent = (rateLimits.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX_ATTEMPTS) return false;
  recent.push(now);
  rateLimits.set(identifier, recent);
  return true;
}

function submissionFingerprint(identifier: string, email: string, phone: string) {
  return createHash("sha256").update(`${identifier}:${email}:${phone}`).digest("hex");
}

export async function submitConsultation(
  _previousState: ConsultationActionState,
  formData: FormData,
): Promise<ConsultationActionState> {
  if (String(formData.get("kiko_form_guard") ?? "").trim()) {
    return { status: "error", message: "We couldn’t process that submission. Please try again." };
  }

  const requestHeaders = await headers();
  const clientIdentifier =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(clientIdentifier)) {
    return {
      status: "error",
      message: "Too many attempts were received. Please wait a while and try again.",
    };
  }

  const parsed = consultationSchema.safeParse(consultationInputFromFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const fingerprint = submissionFingerprint(
    clientIdentifier,
    parsed.data.email,
    parsed.data.phone_number,
  );
  const previousSubmission = recentSubmissions.get(fingerprint);
  if (previousSubmission && Date.now() - previousSubmission < DUPLICATE_WINDOW_MS) {
    return {
      status: "error",
      message: "This request was already received or is still being processed.",
    };
  }
  recentSubmissions.set(fingerprint, Date.now());

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    recentSubmissions.delete(fingerprint);
    console.error("Consultation submission is unavailable: DATABASE_URL is missing.");
    return {
      status: "error",
      message: "The consultation form is not configured yet. Please try again later.",
    };
  }

  try {
    const sql = neon(databaseUrl);
    await sql`
      insert into public.consultation_leads (
        full_name,
        email,
        phone_number,
        business_type,
        help_request,
        source
      ) values (
        ${parsed.data.full_name},
        ${parsed.data.email},
        ${parsed.data.phone_number},
        ${parsed.data.business_type ?? null},
        ${parsed.data.help_request ?? null},
        'website'
      )
    `;
  } catch (error) {
    recentSubmissions.delete(fingerprint);
    console.error(
      "Neon consultation insert failed:",
      error instanceof Error ? error.name : "unknown error",
    );
    return {
      status: "error",
      message: "We couldn’t save your details. Please try again in a moment.",
    };
  }

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  if (!bookingUrl) {
    return {
      status: "success",
      message: "Thanks for sharing your details. We received your request and will get back to you soon.",
    };
  }

  return {
    status: "success",
    message: "Thanks for sharing your details. We’ll get back to you soon. Opening the scheduling page now.",
    bookingUrl,
  };
}
