


import cloudinary from "@/lib/cloudinary";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const public_id = searchParams.get("public_id");

    if (!public_id) {
      return new Response(JSON.stringify({ error: "Missing public_id" }), { status: 400 });
    }

 
    let signedUrl;
    let response;

    for (const resourceType of ["image", "raw"]) {
      const url = cloudinary.utils.private_download_url(public_id, "pdf", {
        resource_type: resourceType,
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 600,
      });

      const res = await fetch(url);
      if (res.ok) {
        response = res;
        signedUrl = url;
        break;
      }
    }

    if (!response) {
      throw new Error("File not found in Cloudinary (both image/raw failed)");
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (err) {
    console.error("Error fetching PDF:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
