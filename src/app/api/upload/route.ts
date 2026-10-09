import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename to prevent overwriting
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const extension = file.name.split('.').pop();
    const fileName = `${file.name.replace(`.${extension}`, '')}-${uniqueSuffix}.${extension}`;

    // Define the upload path (public/uploads directory)
    const uploadDir = join(process.cwd(), "public/uploads");
    const filePath = join(uploadDir, fileName);

    // Write the file to the public/uploads directory
    await writeFile(filePath, buffer);
    console.log(`Saved file to ${filePath}`);

    // Return the public URL path
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
