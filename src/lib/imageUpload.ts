// Shared limits keep uploads well below Vercel's function payload limit.
export const MAX_IMAGE_BYTES = 150 * 1024;
export const MAX_UPLOAD_BODY_BYTES = 200 * 1024;
export const MAX_IMAGE_STORAGE_BYTES = 20 * 1024 * 1024;
export const IMAGE_MAX_EDGE = 1280;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function compressUpload(file: File): Promise<File> {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error("Choose a JPEG, PNG, WebP, GIF or AVIF image.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Choose an image smaller than 20 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (image.naturalWidth * image.naturalHeight > 40_000_000) throw new Error("This image is too large. Choose an image under 40 megapixels.");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser cannot prepare images for upload.");
    const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
    for (const reduction of [1, 0.8, 0.6, 0.4]) {
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale * reduction));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale * reduction));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.82, 0.68, 0.5]) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
        if (blob && blob.size <= MAX_IMAGE_BYTES) return new File([blob], "image.webp", { type: blob.type });
      }
    }
    throw new Error("This image could not be compressed enough. Please choose a smaller image.");
  } catch (error) {
    if (error instanceof Error && error.name !== "EncodingError") throw error;
    throw new Error("Unable to read this image. Try a JPEG or PNG version.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
