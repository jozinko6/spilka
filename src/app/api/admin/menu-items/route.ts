import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/menu-items — list all menu items (optional ?categoryId=xxx)
export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const items = await db.menuItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: [{ categoryId: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní položiek menu" },
      { status: 500 }
    );
  }
}

// POST /api/admin/menu-items — create new menu item
export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      categoryId,
      name,
      description,
      price,
      weight,
      allergens,
      badge,
      isNew,
      order,
      active,
    } = body;

    if (!categoryId || !name || !description || !price) {
      return NextResponse.json(
        { error: "Kategória, názov, popis a cena sú povinné" },
        { status: 400 }
      );
    }

    const item = await db.menuItem.create({
      data: {
        categoryId,
        name,
        description,
        price,
        weight: weight || null,
        allergens: allergens || null,
        badge: badge || null,
        isNew: isNew ?? false,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri vytváraní položky menu" },
      { status: 500 }
    );
  }
}
