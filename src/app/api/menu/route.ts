import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/menu — public: all active categories with active items
export async function GET() {
  try {
    const categories = await db.menuCategory.findMany({
      where: { items: { some: { active: true } } },
      include: {
        items: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní menu" },
      { status: 500 }
    );
  }
}
