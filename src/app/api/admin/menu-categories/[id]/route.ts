import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/menu-categories/[id] — get single category with items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const category = await db.menuCategory.findUnique({
      where: { id },
      include: { items: { orderBy: { order: "asc" } } },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategória nenájdená" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní kategórie" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/menu-categories/[id] — update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, icon, order } = body;

    const category = await db.menuCategory.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri aktualizácii kategórie" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menu-categories/[id] — delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await db.menuCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri odstraňovaní kategórie" },
      { status: 500 }
    );
  }
}
