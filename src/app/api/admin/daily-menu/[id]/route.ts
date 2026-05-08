import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// PUT /api/admin/daily-menu/[id] — update daily menu entry
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
      dayOfWeek,
      soup,
      soupAllergens,
      main1,
      main1Allergens,
      main2,
      main2Allergens,
      special,
      specialAllergens,
      active,
    } = body;

    const dailyMenu = await db.dailyMenu.update({
      where: { id },
      data: {
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(soup !== undefined && { soup }),
        ...(soupAllergens !== undefined && { soupAllergens }),
        ...(main1 !== undefined && { main1 }),
        ...(main1Allergens !== undefined && { main1Allergens }),
        ...(main2 !== undefined && { main2 }),
        ...(main2Allergens !== undefined && { main2Allergens }),
        ...(special !== undefined && { special }),
        ...(specialAllergens !== undefined && { specialAllergens }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(dailyMenu);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri aktualizácii denného menu" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/daily-menu/[id] — delete daily menu entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await db.dailyMenu.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri odstraňovaní denného menu" },
      { status: 500 }
    );
  }
}
