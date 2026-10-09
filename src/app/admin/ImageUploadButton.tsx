"use client";

import { useRef, useState } from "react";
import { compressUpload } from "@/lib/imageUpload";

export default function ImageUploadButton({
  onUploadSuccess,
  onUploadingChange,
  onError = (msg) => alert(msg),
}: {
  onUploadSuccess: (url: string) => void;
  onError?: (message: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const compressed = await compressUpload(file);
      const formData = new FormData();
      formData.append("file", compressed);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({ error: res.status === 413 ? "Image is too large." : "Server unavailable. Please try again." }));
      if (res.ok && data.success) {
        onUploadSuccess(data.url);
      } else {
        onError("Upload failed: " + data.error);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" ref={fileInputRef} style={{ display: "none" }} onChange={handleUpload} />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        style={{ padding: "0 15px", minHeight: 38, borderRadius: "8px", background: "var(--color-soft-teal)", color: "white", border: "none", cursor: uploading ? "not-allowed" : "pointer", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
      >
        <i className={uploading ? "fas fa-spinner fa-spin" : "fas fa-upload"} />
        {uploading ? "Uploading…" : "Upload"}
      </button>
    </>
  );
}
