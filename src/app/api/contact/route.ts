import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Meno, e-mail a správa sú povinné polia." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Neplatný formát e-mailu." },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Správa musí mať aspoň 10 znakov." },
        { status: 400 }
      );
    }

    // In a production environment, you would:
    // 1. Send an email notification
    // 2. Store the message in a database
    // 3. Send to a CRM system
    // For now, we just log it and return success

    console.log("New contact form submission:", {
      name,
      email,
      phone: phone || "N/A",
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Správa bola úspešne odoslaná." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Nastala chyba pri spracovaní správy." },
      { status: 500 }
    );
  }
}
