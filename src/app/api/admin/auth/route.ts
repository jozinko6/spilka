import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/admin/auth — login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Meno a heslo sú povinné" },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({
      where: { username },
    });

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: "Neplatné meno alebo heslo" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: "spilka-admin-2026",
      admin: { id: admin.id, username: admin.username },
    });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri prihlasovaní" },
      { status: 500 }
    );
  }
}
