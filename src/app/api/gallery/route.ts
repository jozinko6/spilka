import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/gallery — public: all active gallery images ordered by order
export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      where: { active: true },
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
