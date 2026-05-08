import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/events — public: all active events ordered by date desc
export async function GET() {
  try {
    const events = await db.event.findMany({
      where: { active: true },
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
