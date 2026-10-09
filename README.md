This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin image uploads on Vercel / Neon

Uploads no longer write to `public/uploads`: that directory is not durable writable storage on Vercel. The existing authenticated Upload button prepares a static WebP in the browser (maximum 1280 pixels on the longest edge and 150 KiB), then the server verifies and re-encodes it with Sharp. Animated GIFs become a still image. Original files may be up to 20 MiB; the HTTP upload body is limited to 200 KiB, including multipart overhead.

Set `DATABASE_URL` to the existing Neon database in Vercel. The first authenticated upload creates `uploaded_images` automatically, so the database role must have CREATE TABLE permission. Image bytes are stored once in that table; blogs and CMS records retain short `/api/images/<sha256>` URLs. Identical processed images share a URL. No additional storage account or secret is needed. Sharp is a production dependency.

The application caps stored image payloads at **20 MiB total** with a transaction lock to prevent simultaneous uploads exceeding the budget. When full, uploads stop with a clear message; externally hosted image URLs remain available. This cap includes unused uploads. Images are retained when posts are edited/deleted because CMS content may share them. Database indexes, row overhead, backups/history and unrelated tables consume additional storage. Existing `/uploads/` files lost in a previous Vercel deployment must be uploaded again from their originals.

Image URLs are public and immutable, with one-year browser and Vercel CDN caching to reduce database reads and function invocations. The PostgreSQL client uses at most two connections per instance and closes idle connections after 20 seconds. Existing Next.js image optimization remains disabled, avoiding image transformation usage.

These safeguards reduce usage; they cannot guarantee total Neon/Vercel free allowances under unlimited traffic or with other applications sharing the account. Check storage, transfer, compute and request usage in the provider dashboards. On a paid plan, use the provider's spending controls separately. To inspect image storage:

```sql
SELECT count(*) AS images,
       coalesce(sum(octet_length(data)), 0) AS image_payload_bytes,
       pg_total_relation_size('uploaded_images') AS table_bytes
FROM uploaded_images;
```

Validation: `node scripts/test-image-upload.cjs`, `npx tsc --noEmit`, and `npm run build`. The image test uses isolated authentication/storage mocks and real Sharp encoding, without connecting to a database.

### Sharp native libraries on Vercel

`vercel.json` installs dependencies with `npm ci --include=optional`, so Sharp's platform-specific native addon and libvips library are installed. `next.config.ts` explicitly includes Sharp and its `@img/sharp-*` packages in the `/api/upload` function trace. The prebuild check performs a real WebP encode, failing the build if native libraries cannot load.

After deploying these changes, redeploy once with **Use existing Build Cache** unchecked to discard any cached installation missing libvips. A successful local macOS build alone cannot confirm the Linux Vercel runtime; verify an admin upload after the new deployment is ready.

Sharp is pinned to `0.35.3`, with an npm override making Next.js use the same installation. Mixing Next.js's `0.34.x` native libraries with the app's `0.35.x` addon can leave a function expecting a different libvips filename. The prebuild check also verifies that the app and Next.js resolve the same Sharp installation. Commit both `package.json` and `package-lock.json` when deploying this change.
