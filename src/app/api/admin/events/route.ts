import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/events — list all events
export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const events = await db.event.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní udalostí" },
      { status: 500 }
    );
  }
}

// POST /api/admin/events — create new event
export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, date, time, description, organizer, type, active } = body;

    if (!title || !date || !type) {
      return NextResponse.json(
        { error: "Názov, dátum a typ sú povinné" },
        { status: 400 }
      );
    }

    const event = await db.event.create({
      data: {
        title,
        date,
        time: time || null,
        description: description || null,
        organizer: organizer || null,
        type,
        active: active ?? true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri vytváraní udalosti" },
      { status: 500 }
    );
  }
}
