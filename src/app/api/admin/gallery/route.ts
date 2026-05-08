import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/gallery — list all gallery images
export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const images = await db.galleryImage.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní galérie" },
      { status: 500 }
    );
  }
}

// POST /api/admin/gallery — create new gallery image
export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { src, alt, label, order, active } = body;

    if (!src || !alt) {
      return NextResponse.json(
        { error: "Zdroj a alt text sú povinné" },
        { status: 400 }
      );
    }

    const image = await db.galleryImage.create({
      data: {
        src,
        alt,
        label: label || null,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri vytváraní obrázku galérie" },
      { status: 500 }
    );
  }
}
