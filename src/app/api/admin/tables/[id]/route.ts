import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/tables/[id] — get single table
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const table = await db.table.findUnique({ where: { id } });
    if (!table) {
      return NextResponse.json({ error: "Stôl nenájdený" }, { status: 404 });
    }
    return NextResponse.json(table);
  } catch {
    return NextResponse.json({ error: "Chyba" }, { status: 500 });
  }
}

// PUT /api/admin/tables/[id] — update table
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { number, name, seats, area, active } = body;

    const table = await db.table.update({
      where: { id },
      data: {
        ...(number !== undefined && { number: parseInt(number) }),
        ...(name !== undefined && { name: name || null }),
        ...(seats !== undefined && { seats: parseInt(seats) }),
        ...(area !== undefined && { area: area || null }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(table);
  } catch {
    return NextResponse.json({ error: "Chyba pri úprave stola" }, { status: 500 });
  }
}

// DELETE /api/admin/tables/[id] — delete table
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await db.table.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Chyba pri odstraňovaní stola" }, { status: 500 });
  }
}
