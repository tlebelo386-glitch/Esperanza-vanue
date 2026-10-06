import { drizzle } from "drizzle-orm/node-postgres";
import { boolean, date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Pool } from "pg";

export type AvailabilityStatus = "open" | "held" | "booked" | "limited";

export const availabilityDates = pgTable("availability_dates", {
  id: text("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull(),
  status: text("status").$type<AvailabilityStatus>().notNull(),
  isWeekend: boolean("is_weekend").notNull(),
  discount: integer("discount"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

const globalForAvailability = globalThis as typeof globalThis & {
  availabilityPool?: Pool;
};

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("The Neon DATABASE_URL environment variable is not configured.");
  }

  if (!globalForAvailability.availabilityPool) {
    globalForAvailability.availabilityPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
    });
  }

  return globalForAvailability.availabilityPool;
}

export function getAvailabilityDb() {
  return drizzle(getPool(), { schema: { availabilityDates } });
}

export function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isVenueWeekend(dateKey: string) {
  const weekday = new Date(`${dateKey}T00:00:00`).getDay();
  return weekday === 5 || weekday === 6;
}

export function getDateWindow(weeks: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + weeks * 7);
  return { startDate: toLocalDateKey(start), endDate: toLocalDateKey(end) };
}

export function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function createAvailabilityId() {
  return crypto.randomUUID();
}

export const currentAvailabilityTimestamp = () => new Date();
export { and, asc, eq, gte, lte, sql } from "drizzle-orm";
export { desc } from "drizzle-orm";
export type { InferSelectModel } from "drizzle-orm";
export type AvailabilityDateRecord = typeof availabilityDates.$inferSelect;
export type NewAvailabilityDateRecord = typeof availabilityDates.$inferInsert;
