import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = "spilka-admin-2026";

export function checkAdminAuth(request: NextRequest): NextResponse | null {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_TOKEN) {
    return NextResponse.json(
      { error: "Neoprávnený prístup" },
      { status: 401 }
    );
  }
  return null;
}
