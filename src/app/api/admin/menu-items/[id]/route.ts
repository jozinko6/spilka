import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/menu-items/[id] — get single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const item = await db.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Položka menu nenájdená" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní položky menu" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/menu-items/[id] — update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
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

    const item = await db.menuItem.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(weight !== undefined && { weight }),
        ...(allergens !== undefined && { allergens }),
        ...(badge !== undefined && { badge }),
        ...(isNew !== undefined && { isNew }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri aktualizácii položky menu" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menu-items/[id] — delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await db.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri odstraňovaní položky menu" },
      { status: 500 }
    );
  }
}
