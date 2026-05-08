import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// PUT /api/admin/gallery/[id] — update gallery image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { src, alt, label, order, active } = body;

    const image = await db.galleryImage.update({
      where: { id },
      data: {
        ...(src !== undefined && { src }),
        ...(alt !== undefined && { alt }),
        ...(label !== undefined && { label }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(image);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri aktualizácii obrázku galérie" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gallery/[id] — delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await db.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Chyba pri odstraňovaní obrázku galérie" },
      { status: 500 }
    );
  }
}
