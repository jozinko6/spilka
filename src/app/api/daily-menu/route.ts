import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/daily-menu — public: all active daily menus
export async function GET() {
  try {
    const dailyMenus = await db.dailyMenu.findMany({
      where: { active: true },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(dailyMenus);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní denného menu" },
      { status: 500 }
    );
  }
}
