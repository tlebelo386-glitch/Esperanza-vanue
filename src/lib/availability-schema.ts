import { boolean, date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export type AvailabilityStatus = "open" | "held" | "booked" | "limited";

export const availabilityDates = pgTable("availability_dates", {
  id: text("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull().unique(),
  status: text("status").$type<AvailabilityStatus>().notNull().default("open"),
  isWeekend: boolean("is_weekend").notNull().default(false),
  discount: integer("discount"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AvailabilityDate = typeof availabilityDates.$inferSelect;
export type NewAvailabilityDate = typeof availabilityDates.$inferInsert;
