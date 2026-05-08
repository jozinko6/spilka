import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// PUT /api/admin/events/[id] — update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, date, time, description, organizer, type, active } = body;

    const event = await db.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(date !== undefined && { date }),
        ...(time !== undefined && { time }),
        ...(description !== undefined && { description }),
        ...(organizer !== undefined && { organizer }),
        ...(type !== undefined && { type }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(event);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri aktualizácii udalosti" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events/[id] — delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await db.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri odstraňovaní udalosti" },
      { status: 500 }
    );
  }
}
