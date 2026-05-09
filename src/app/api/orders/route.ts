import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/orders — create a new order from customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableNumber, items, customerNote } = body;

    if (!tableNumber || !items || !items.length) {
      return NextResponse.json(
        { error: "Číslo stola a položky objednávky sú povinné" },
        { status: 400 }
      );
    }

    // Find the table
    const table = await db.table.findFirst({
      where: { number: parseInt(tableNumber), active: true },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Stôl nebol nájdený" },
        { status: 404 }
      );
    }

    // Validate items and calculate total
    const menuItemIds = items.map((i: { menuItemId: string }) => i.menuItemId);
    const menuItems = await db.menuItem.findMany({
      where: { id: { in: menuItemIds }, active: true },
    });

    const menuMap = new Map(menuItems.map((mi) => [mi.id, mi]));

    let totalItems = 0;
    let totalPriceNum = 0;
    const orderItemsData: { menuItemId: string; name: string; price: string; quantity: number; note: string | null }[] = [];

    for (const item of items) {
      const menuItem = menuMap.get(item.menuItemId);
      if (!menuItem) {
        return NextResponse.json(
          { error: `Položka ${item.menuItemId} nebola nájdená` },
          { status: 400 }
        );
      }
      const qty = item.quantity || 1;
      totalItems += qty;
      // Parse price "9,90" -> 9.90
      const priceNum = parseFloat(menuItem.price.replace(",", "."));
      totalPriceNum += priceNum * qty;

      orderItemsData.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: qty,
        note: item.note || null,
      });
    }

    // Format total price back to Slovak format
    const totalPriceStr = totalPriceNum.toFixed(2).replace(".", ",");

    // Create the order with items
    const order = await db.order.create({
      data: {
        tableId: table.id,
        tableNumber: table.number,
        status: "received",
        customerNote: customerNote || null,
        totalItems,
        totalPrice: totalPriceStr,
        items: {
          createMany: {
            data: orderItemsData,
          },
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Chyba pri vytváraní objednávky" },
      { status: 500 }
    );
  }
}

// GET /api/orders — list orders (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await db.order.findMany({
      where: status ? { status } : { status: { in: ["received", "preparing", "ready"] } },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Chyba pri načítavaní objednávok" },
      { status: 500 }
    );
  }
}
