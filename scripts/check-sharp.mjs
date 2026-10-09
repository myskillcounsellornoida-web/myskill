// Fail the build, rather than every upload, if the platform's native libs are missing.
import sharp from 'sharp';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve('next/package.json'));
if (require.resolve('sharp') !== nextRequire.resolve('sharp')) {
  throw new Error('The app and Next.js resolve different Sharp installations. Run npm ci --include=optional.');
}
sharp({ create: { width: 1, height: 1, channels: 3, background: '#ffffff' } })
  .webp().toBuffer()
  .then(() => console.log('Sharp native runtime and WebP encoding verified.'))
  .catch(error => { console.error('Sharp native runtime check failed:', error.message); process.exitCode = 1; });
