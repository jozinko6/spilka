import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// GET /api/admin/orders — list all orders with filters
export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const tableNumber = searchParams.get("table");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (tableNumber) {
      where.tableNumber = parseInt(tableNumber);
    }

    const orders = await db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní objednávok" },
      { status: 500 }
    );
  }
}
