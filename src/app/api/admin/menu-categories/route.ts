import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/menu-categories — list all categories with items
export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const categories = await db.menuCategory.findMany({
      include: { items: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní kategórií" },
      { status: 500 }
    );
  }
}

// POST /api/admin/menu-categories — create new category
export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, slug, icon, order } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Názov a slug sú povinné" },
        { status: 400 }
      );
    }

    const category = await db.menuCategory.create({
      data: {
        title,
        slug,
        icon: icon || "Utensils",
        order: order ?? 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri vytváraní kategórie" },
      { status: 500 }
    );
  }
}
