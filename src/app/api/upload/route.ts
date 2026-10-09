import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { IMAGE_TYPES, IMAGE_MAX_EDGE, MAX_IMAGE_BYTES, MAX_UPLOAD_BODY_BYTES } from "@/lib/imageUpload";
import { storeImage } from "@/lib/imageStorage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Image storage is unavailable. Configure DATABASE_URL or use an image URL." }, { status: 503 });
  if (Number(request.headers.get("content-length")) > MAX_UPLOAD_BODY_BYTES) return NextResponse.json({ error: "Image is too large. Use the Upload button to compress it." }, { status: 413 });
  try {
    // Enforce the limit even when Content-Length is omitted or inaccurate.
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "No file received." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_UPLOAD_BODY_BYTES) {
        await reader.cancel();
        return NextResponse.json({ error: "Image is too large. Use the Upload button to compress it." }, { status: 413 });
      }
      chunks.push(value);
    }
    let formData: FormData;
    try {
      formData = await new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData();
    } catch {
      return NextResponse.json({ error: "Invalid upload form." }, { status: 400 });
    }
    const file = formData.get("file");
    if (!(file instanceof File) || !file.size || !IMAGE_TYPES.includes(file.type)) return NextResponse.json({ error: "Choose a valid image." }, { status: 400 });
    if (file.size > MAX_IMAGE_BYTES) return NextResponse.json({ error: "Compressed images must be under 150 KB." }, { status: 413 });
    let buffer: Buffer;
    try {
      // Decode real image bytes, strip metadata, and produce a safe static WebP.
      buffer = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40_000_000 })
        .rotate().resize({ width: IMAGE_MAX_EDGE, height: IMAGE_MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78 }).toBuffer();
    } catch {
      return NextResponse.json({ error: "Unable to read this image. Try a JPEG or PNG version." }, { status: 400 });
    }
    if (buffer.length > MAX_IMAGE_BYTES) return NextResponse.json({ error: "Please choose a smaller image." }, { status: 413 });
    return NextResponse.json({ success: true, url: await storeImage(buffer) });
  } catch (error) {
    if (error instanceof Error && error.message === "IMAGE_STORAGE_FULL") return NextResponse.json({ error: "The 20 MB image storage budget is full. Use an externally hosted image URL." }, { status: 409 });
    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "Unable to save the image. Please try again." }, { status: 500 });
  }
}
