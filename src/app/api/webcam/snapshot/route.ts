/**
 * Proxy API for BellaAI Webcam Snapshot
 * Forwards authenticated requests to bella.rafaelcardoso.co.uk
 */

import { NextRequest, NextResponse } from "next/server";

const BELLA_API = "https://bella.rafaelcardoso.co.uk/api";

export async function GET(request: NextRequest) {
  try {
    // Check local admin authentication
    const sessionCookie = request.cookies.get("admin_session");
    if (!sessionCookie || !sessionCookie.value || sessionCookie.value.length !== 64) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const device = searchParams.get("device") || "/dev/video0";
    const resolution = searchParams.get("resolution") || "1280x720";

    // Forward to BellaAI API with API key authentication
    const response = await fetch(
      `${BELLA_API}/webcam/snapshot?device=${encodeURIComponent(device)}&resolution=${encodeURIComponent(resolution)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.BELLA_WEBCAM_API_KEY || "",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Webcam Snapshot Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to capture webcam snapshot" },
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

    const body = await request.json();

    // Forward to BellaAI API with API key authentication
    const response = await fetch(`${BELLA_API}/webcam/snapshot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BELLA_WEBCAM_API_KEY || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Webcam Snapshot Proxy POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to process webcam snapshot" },
      { status: 500 }
    );
  }
}
