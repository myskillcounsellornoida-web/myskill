import { readImage } from "@/lib/imageStorage";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{64}$/.test(id)) return new Response(null, { status: 404 });
  try {
    const data = await readImage(id);
    if (!data) return new Response(null, { status: 404 });
    const headers = {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Vercel-CDN-Cache-Control": "public, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ETag: `"${id}"`,
    };
    if (request.headers.get("if-none-match") === headers.ETag) return new Response(null, { status: 304, headers });
    return new Response(new Uint8Array(data), { headers });
  } catch (error) {
    console.error("Image read failed:", error);
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
