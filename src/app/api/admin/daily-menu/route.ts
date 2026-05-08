import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/daily-menu — list all daily menus
export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const dailyMenus = await db.dailyMenu.findMany({
      orderBy: { dayOfWeek: "asc" },
    });
    return NextResponse.json(dailyMenus);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní denného menu" },
      { status: 500 }
    );
  }
}

// POST /api/admin/daily-menu — create new daily menu entry
export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
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

    if (dayOfWeek === undefined || !soup || !main1 || !main2) {
      return NextResponse.json(
        { error: "Deň v týždni, polievka a hlavné jedlá sú povinné" },
        { status: 400 }
      );
    }

    const dailyMenu = await db.dailyMenu.create({
      data: {
        dayOfWeek,
        soup,
        soupAllergens: soupAllergens || null,
        main1,
        main1Allergens: main1Allergens || null,
        main2,
        main2Allergens: main2Allergens || null,
        special: special || null,
        specialAllergens: specialAllergens || null,
        active: active ?? true,
      },
    });

    return NextResponse.json(dailyMenu, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri vytváraní denného menu" },
      { status: 500 }
    );
  }
}
