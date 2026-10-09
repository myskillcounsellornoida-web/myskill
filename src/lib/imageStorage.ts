import "server-only";
import { sql } from "drizzle-orm";
import { createHash } from "crypto";
import { db } from "@/db";
import { MAX_IMAGE_STORAGE_BYTES } from "./imageUpload";

let ready: Promise<unknown> | undefined;
function ensureTable() {
  ready ??= db.execute(sql`CREATE TABLE IF NOT EXISTS uploaded_images (
    id varchar(64) PRIMARY KEY,
    data bytea NOT NULL CHECK (octet_length(data) <= 153600),
    created_at timestamptz NOT NULL DEFAULT now()
  )`).catch((error: unknown) => { ready = undefined; throw error; });
  return ready;
}

export async function storeImage(buffer: Buffer): Promise<string> {
  await ensureTable();
  const id = createHash("sha256").update(buffer).digest("hex");
  await db.transaction(async (tx) => {
    // Serialize quota checks across concurrent uploads and server instances.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(7364201)`);
    const existing = await tx.execute(sql`SELECT id FROM uploaded_images WHERE id = ${id}`);
    if (existing.length) return;
    const totals = await tx.execute(sql`SELECT coalesce(sum(octet_length(data)), 0) AS used FROM uploaded_images`);
    if (Number(totals[0].used) + buffer.length > MAX_IMAGE_STORAGE_BYTES) {
      throw new Error("IMAGE_STORAGE_FULL");
    }
    await tx.execute(sql`INSERT INTO uploaded_images (id, data) VALUES (${id}, decode(${buffer.toString("base64")}, 'base64'))`);
  });
  return `/api/images/${id}`;
}

export async function readImage(id: string): Promise<Buffer | null> {
  const rows = await db.execute(sql`SELECT data FROM uploaded_images WHERE id = ${id}`);
  return rows.length ? Buffer.from(rows[0].data as Uint8Array) : null;
}
