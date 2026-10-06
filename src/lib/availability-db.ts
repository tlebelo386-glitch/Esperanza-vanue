import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { boolean, date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const availabilityDates = pgTable("availability_dates", {
  id: text("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull().unique(),
  status: text("status").notNull().default("open"),
  isWeekend: boolean("is_weekend").notNull().default(false),
  discount: integer("discount"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const globalForAvailability = globalThis as typeof globalThis & {
  availabilityPool?: Pool;
  availabilityDb?: ReturnType<typeof drizzle>;
};

const pool = globalForAvailability.availabilityPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30_000,
});

if (process.env.NODE_ENV !== "production") {
  globalForAvailability.availabilityPool = pool;
}

export const availabilityDb = globalForAvailability.availabilityDb ?? drizzle(pool);

if (process.env.NODE_ENV !== "production") {
  globalForAvailability.availabilityDb = availabilityDb;
}

export const availabilityDateTable = availabilityDates;
export const createAvailabilityId = () => randomUUID();

export type AvailabilityStatus = "open" | "held" | "booked" | "limited";
export type AvailabilityDateRecord = typeof availabilityDates.$inferSelect;
export type NewAvailabilityDate = typeof availabilityDates.$inferInsert;
export { availabilityDates };
export { asc, eq, gte, lte } from "drizzle-orm";
export { and } from "drizzle-orm";
export { sql } from "drizzle-orm";
export { desc } from "drizzle-orm";
export { Pool };
export { drizzle };
export { pgTable, text, date, integer, boolean, timestamp } from "drizzle-orm/pg-core";
export { randomUUID };

export const availabilityPool = pool;
export const availabilityConnectionStringConfigured = Boolean(process.env.DATABASE_URL);
export const availabilityStatusValues: AvailabilityStatus[] = ["open", "held", "booked", "limited"];
export const availabilityDbSchema = availabilityDates;

export type { Pool as PgPool };
export type { NodePgDatabase } from "drizzle-orm/node-postgres";
export type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const availabilityDateColumns = {
  id: availabilityDates.id,
  date: availabilityDates.date,
  status: availabilityDates.status,
  isWeekend: availabilityDates.isWeekend,
  discount: availabilityDates.discount,
  note: availabilityDates.note,
  createdAt: availabilityDates.createdAt,
  updatedAt: availabilityDates.updatedAt,
};

export type AvailabilityDateStatus = AvailabilityStatus;

export const isAvailabilityStatus = (value: string): value is AvailabilityStatus =>
  availabilityStatusValues.includes(value as AvailabilityStatus);

export const toAvailabilityDate = (record: AvailabilityDateRecord) => ({
  ...record,
  date: record.date.slice(0, 10),
});

export const toAvailabilityDateInput = (dateValue: string, values: Partial<NewAvailabilityDate> = {}) => ({
  id: values.id ?? createAvailabilityId(),
  date: dateValue,
  status: values.status ?? "open",
  isWeekend: values.isWeekend ?? isWeekendDate(dateValue),
  discount: values.discount ?? null,
  note: values.note ?? null,
});

function isWeekendDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  return dayOfWeek === 5 || dayOfWeek === 6;
}

export const toLocalDateKey = (value: Date) => {
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
};
