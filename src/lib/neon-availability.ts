import { boolean, date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const availabilityDates = pgTable("availability_dates", {
  id: text("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull().unique(),
  status: text("status").notNull().default("open"),
  isWeekend: boolean("is_weekend").notNull().default(false),
  discount: integer("discount"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

const globalForAvailability = globalThis as typeof globalThis & {
  availabilityPool?: Pool;
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to read venue availability");
}

const pool =
  globalForAvailability.availabilityPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 4 });

globalForAvailability.availabilityPool = pool;

export const availabilityDb = drizzle(pool);
export type AvailabilityDateRecord = typeof availabilityDates.$inferSelect;
export type NewAvailabilityDateRecord = typeof availabilityDates.$inferInsert;

export function dateKey(dateValue: Date) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isVenueWeekend(dateValue: string) {
  const day = new Date(`${dateValue}T12:00:00`).getDay();
  return day === 5 || day === 6;
}

export function isAvailabilityStatus(value: unknown): value is "open" | "held" | "booked" | "limited" {
  return value === "open" || value === "held" || value === "booked" || value === "limited";
}

export function newAvailabilityId() {
  return crypto.randomUUID();
}

export function toClientAvailability(record: AvailabilityDateRecord) {
  return {
    id: record.id,
    date: record.date,
    status: record.status,
    isWeekend: record.isWeekend,
    discount: record.discount,
    note: record.note,
  };
}

export type ClientAvailabilityDate = ReturnType<typeof toClientAvailability>;

export function getAvailabilityDatabase() {
  return availabilityDb;
}

export function getAvailabilityTable() {
  return availabilityDates;
}

export function getAvailabilityPool() {
  return pool;
}

export function serializeAvailabilityRecord(record: AvailabilityDateRecord): ClientAvailabilityDate {
  return toClientAvailability(record);
}

export function serializeAvailabilityRecords(records: AvailabilityDateRecord[]): ClientAvailabilityDate[] {
  return records.map(serializeAvailabilityRecord);
}

export function statusOptions() {
  return ["open", "held", "booked", "limited"] as const;
}

export function availabilityStatus(value: unknown): "open" | "held" | "booked" | "limited" | null {
  return isAvailabilityStatus(value) ? value : null;
}

export function validateAvailabilityDate(dateValue: string) {
  const parsed = new Date(`${dateValue}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && dateKey(parsed) === dateValue;
}

export function isDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && validateAvailabilityDate(value);
}

export function dateKeyNow() {
  return dateKey(new Date());
}

export function dateCutoff(weeks: number) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + weeks * 7);
  return dateKey(cutoff);
}

export function getDateRange(weeks: number) {
  return { from: dateKeyNow(), through: dateCutoff(weeks) };
}

export function makeAvailabilityRecord(input: {
  date: string;
  status?: "open" | "held" | "booked" | "limited";
  isWeekend?: boolean;
  discount?: number;
  note?: string;
}): NewAvailabilityDateRecord {
  const now = new Date();
  return {
    id: newAvailabilityId(),
    date: input.date,
    status: input.status ?? "open",
    isWeekend: input.isWeekend ?? isVenueWeekend(input.date),
    discount: input.discount ?? null,
    note: input.note ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export function availabilityUpdateFields(input: {
  status?: "open" | "held" | "booked" | "limited";
  isWeekend?: boolean;
  discount?: number;
  note?: string;
}) {
  return {
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.isWeekend !== undefined ? { isWeekend: input.isWeekend } : {}),
    ...(input.discount !== undefined ? { discount: input.discount } : {}),
    ...(input.note !== undefined ? { note: input.note } : {}),
    updatedAt: new Date(),
  };
}
