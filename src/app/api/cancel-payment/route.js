import { NextResponse } from "next/server";

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl = `${baseUrl}/cart`;

    return NextResponse.redirect(new URL(redirectUrl), 303);
  } catch (error) {
    // // // console.error("Redirect Failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
