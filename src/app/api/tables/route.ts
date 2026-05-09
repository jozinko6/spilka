import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tables — public: list active tables (for ordering page validation)
export async function GET() {
  try {
    const tables = await db.table.findMany({
      where: { active: true },
      orderBy: { number: "asc" },
      select: {
        id: true,
        number: true,
        name: true,
        seats: true,
        area: true,
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Tables API error:", error);
    return NextResponse.json(
      { error: "Chyba pri načítavaní stolov" },
      { status: 500 }
    );
  }
}
