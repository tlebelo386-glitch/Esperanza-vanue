import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { availabilityDates } from "@/lib/availability-schema";
import { getAvailabilityDb } from "@/lib/availability-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  status: z.enum(["open", "held", "booked", "limited"]),
});

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deleted] = await getAvailabilityDb()
      .delete(availabilityDates)
      .where(eq(availabilityDates.id, id))
      .returning({ id: availabilityDates.id });

    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Availability date not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[available-dates/[id]/DELETE]", error);
    return NextResponse.json({ ok: false, error: "Failed to remove venue availability" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const [date] = await getAvailabilityDb()
      .update(availabilityDates)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(availabilityDates.id, id))
      .returning();

    if (!date) {
      return NextResponse.json({ ok: false, error: "Availability date not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, date });
  } catch (error) {
    console.error("[available-dates/[id]/PATCH]", error);
    return NextResponse.json({ ok: false, error: "Failed to update venue availability" }, { status: 500 });
  }
}
