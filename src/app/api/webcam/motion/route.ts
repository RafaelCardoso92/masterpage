/**
 * Proxy API for BellaAI Webcam Motion Detection
 * Forwards authenticated requests to bella.rafaelcardoso.co.uk
 */

import { NextRequest, NextResponse } from "next/server";

const BELLA_API = "https://bella.rafaelcardoso.co.uk/api";
const BELLA_AUTH_EMAIL = process.env.BELLA_AUTH_EMAIL || "admin@rafaelcardoso.co.uk";

export async function GET(request: NextRequest) {
  try {
    // Check local admin authentication
    const sessionCookie = request.cookies.get("admin_session");
    if (!sessionCookie || !sessionCookie.value || sessionCookie.value.length !== 64) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Forward to BellaAI API with API key authentication
    const response = await fetch(`${BELLA_API}/webcam/motion`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BELLA_WEBCAM_API_KEY || "",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Webcam Motion Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch motion detection status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check local admin authentication
    const sessionCookie = request.cookies.get("admin_session");
    if (!sessionCookie || !sessionCookie.value || sessionCookie.value.length !== 64) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Forward to BellaAI API with API key authentication
    const response = await fetch(`${BELLA_API}/webcam/motion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BELLA_WEBCAM_API_KEY || "",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Webcam Motion Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to run motion detection" },
      { status: 500 }
    );
  }
}
