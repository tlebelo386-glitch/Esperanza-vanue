import { randomUUID } from "node:crypto";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { availabilityDates, type AvailabilityStatus } from "@/lib/availability-schema";
import { getAvailabilityDb } from "@/lib/availability-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_VALUES = ["open", "held", "booked", "limited"] as const;
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Enter a valid calendar date");

const createSchema = z.object({
  date: dateSchema,
  status: z.enum(STATUS_VALUES).optional(),
  isWeekend: z.boolean().optional(),
  discount: z.number().int().min(0).max(100).nullable().optional(),
  note: z.string().trim().max(500).nullable().optional(),
});

function dateKeyInSouthAfrica(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isVenueWeekend(dateKey: string) {
  const weekday = new Date(`${dateKey}T00:00:00.000Z`).getUTCDay();
  return weekday === 5 || weekday === 6;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "open";
    if (status !== "all" && !STATUS_VALUES.includes(status as AvailabilityStatus)) {
      return NextResponse.json({ ok: false, error: "Invalid availability status" }, { status: 400 });
    }

    const requestedWeeks = Number(searchParams.get("weeks") ?? 12);
    const weeks = Number.isFinite(requestedWeeks)
      ? Math.min(52, Math.max(1, Math.floor(requestedWeeks)))
      : 12;
    const from = dateKeyInSouthAfrica(new Date());
    const through = addDays(from, weeks * 7);
    const db = getAvailabilityDb();
    const dates = await db
      .select()
      .from(availabilityDates)
      .where(
        and(
          gte(availabilityDates.date, from),
          lte(availabilityDates.date, through),
          status === "all" ? undefined : eq(availabilityDates.status, status as AvailabilityStatus)
        )
      )
      .orderBy(asc(availabilityDates.date));

    return NextResponse.json(
      { ok: true, dates, source: "database" },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("[available-dates/GET]", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch venue availability" },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const input = parsed.data;
    const db = getAvailabilityDb();
    const [date] = await db
      .insert(availabilityDates)
      .values({
        id: randomUUID(),
        date: input.date,
        status: input.status ?? "open",
        isWeekend: input.isWeekend ?? isVenueWeekend(input.date),
        discount: input.discount ?? null,
        note: input.note ?? null,
      })
      .onConflictDoUpdate({
        target: availabilityDates.date,
        set: {
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.isWeekend !== undefined ? { isWeekend: input.isWeekend } : {}),
          ...(input.discount !== undefined ? { discount: input.discount } : {}),
          ...(input.note !== undefined ? { note: input.note } : {}),
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({ ok: true, date }, { status: 200 });
  } catch (error) {
    console.error("[available-dates/POST]", error);
    return NextResponse.json({ ok: false, error: "Failed to save venue availability" }, { status: 500 });
  }
}
