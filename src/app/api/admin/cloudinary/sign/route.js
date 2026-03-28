import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const ALLOWED_ACCESS_MODES = new Set(["public"]);

export async function POST(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const folder = typeof body?.folder === "string" ? body.folder : "";
    const accessMode =
      typeof body?.accessMode === "string" ? body.accessMode : "";

    if (!folder) {
      return NextResponse.json(
        { error: "folder is required" },
        { status: 400 }
      );
    }

    if (accessMode && !ALLOWED_ACCESS_MODES.has(accessMode)) {
      return NextResponse.json(
        { error: "Invalid accessMode" },
        { status: 400 }
      );
    }

    const { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret } =
      cloudinary.config();

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server" },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      timestamp,
      folder,
      ...(accessMode ? { access_mode: accessMode } : {}),
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
      ...(accessMode ? { accessMode } : {}),
    });
  } catch (error) {
    console.error("Cloudinary sign error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

