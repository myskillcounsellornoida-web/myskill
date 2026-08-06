import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import crypto from "crypto";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TO_EXTENSION: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const extension = ALLOWED_MIME_TO_EXTENSION[file.type];
    if (!extension) {
      return NextResponse.json({ error: "Unsupported file type. Please upload a PNG, JPEG, WEBP, GIF, or AVIF image." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File is too large. Maximum size is 5MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Filename is fully server-generated — the original name is never used for
    // path construction, which rules out path traversal via a crafted file.name.
    const fileName = `${crypto.randomUUID()}.${extension}`;

    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
