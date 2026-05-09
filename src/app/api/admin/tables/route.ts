import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/tables — list all tables
export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const tables = await db.table.findMany({
      orderBy: { number: "asc" },
      include: {
        _count: { select: { orders: { where: { status: { in: ["received", "preparing", "ready"] } } } } },
      },
    });

    return NextResponse.json(tables);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní stolov" },
      { status: 500 }
    );
  }
}

// POST /api/admin/tables — create a new table
export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { number, name, seats, area, active } = body;

    if (!number || !seats) {
      return NextResponse.json(
        { error: "Číslo stola a počet miest sú povinné" },
        { status: 400 }
      );
    }

    const table = await db.table.create({
      data: {
        number: parseInt(number),
        name: name || null,
        seats: parseInt(seats),
        area: area || null,
        active: active ?? true,
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri vytváraní stola" },
      { status: 500 }
    );
  }
}
