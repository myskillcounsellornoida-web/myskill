// Exercise actual handlers with real image encoding and isolated storage/auth mocks.
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const sharp = require('sharp');
function load(file, mocks = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  vm.runInThisContext(`(function(require, exports) { ${code}\n})`, { filename: file })(name => name in mocks ? mocks[name] : require(name), exports);
  return exports;
}
(async () => {
  const limits = load('src/lib/imageUpload.ts');
  let authenticated = false;
  let calls = 0;
  let full = false;
  let stored;
  const { POST } = load('src/app/api/upload/route.ts', {
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
    '@/lib/adminAuth': { isAdminAuthenticated: async () => authenticated },
    '@/lib/imageUpload': limits,
    '@/lib/imageStorage': { storeImage: async buffer => { calls++; if (full) throw new Error('IMAGE_STORAGE_FULL'); stored = buffer; return '/api/images/' + 'a'.repeat(64); } },
  });
  process.env.DATABASE_URL = 'mock-only';
  const request = (data, type = 'image/png') => {
    const form = new FormData();
    form.set('file', new File([data], 'test.png', { type }));
    return new Request('http://localhost/api/upload', { method: 'POST', body: form });
  };
  assert.equal((await POST(request('x'))).status, 401);
  assert.equal(calls, 0);
  authenticated = true;
  delete process.env.DATABASE_URL;
  assert.equal((await POST(request('x'))).status, 503);
  process.env.DATABASE_URL = 'mock-only';
  assert.equal((await POST(request('x', 'text/plain'))).status, 400);
  assert.equal((await POST(request('not an image'))).status, 400);
  assert.equal((await POST(request(Buffer.alloc(limits.MAX_IMAGE_BYTES + 1)))).status, 413);
  assert.equal((await POST(new Request('http://localhost/api/upload', { method: 'POST', body: Buffer.alloc(limits.MAX_UPLOAD_BODY_BYTES + 1) }))).status, 413);
  assert.equal((await POST(new Request('http://localhost/api/upload', { method: 'POST', body: 'invalid' }))).status, 400);
  const png = await sharp({ create: { width: 1600, height: 900, channels: 3, background: '#498b93' } }).png().toBuffer();
  const response = await POST(request(png));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).url, '/api/images/' + 'a'.repeat(64));
  const metadata = await sharp(stored).metadata();
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 1280);
  assert.ok(stored.length <= limits.MAX_IMAGE_BYTES);
  full = true;
  assert.equal((await POST(request(png))).status, 409);
  let reads = 0;
  const { GET } = load('src/app/api/images/[id]/route.ts', { '@/lib/imageStorage': { readImage: async () => { reads++; return stored; } } });
  const context = id => ({ params: Promise.resolve({ id }) });
  assert.equal((await GET(new Request('http://localhost'), context('bad'))).status, 404);
  assert.equal(reads, 0);
  const image = await GET(new Request('http://localhost'), context('a'.repeat(64)));
  assert.equal(image.headers.get('content-type'), 'image/webp');
  assert.match(image.headers.get('vercel-cdn-cache-control'), /s-maxage=31536000/);
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), stored);
  assert.equal((await GET(new Request('http://localhost', { headers: { 'if-none-match': '"' + 'a'.repeat(64) + '"' } }), context('a'.repeat(64)))).status, 304);
  // Verify storage deduplication and quota rejection without touching a database.
  let existing = false;
  let used = 0;
  let inserts = 0;
  const execute = async query => {
    const chunks = query.queryChunks.map(x => x.value ?? '').flat().join('');
    if (chunks.includes('SELECT id')) return existing ? [{ id: 'existing' }] : [];
    if (chunks.includes('AS used')) return [{ used }];
    if (chunks.includes('INSERT INTO')) inserts++;
    return [];
  };
  const storage = load('src/lib/imageStorage.ts', {
    'server-only': {}, './imageUpload': limits,
    '@/db': { db: { execute, transaction: fn => fn({ execute }) } },
  });
  const first = await storage.storeImage(stored);
  assert.match(first, /^\/api\/images\/[a-f0-9]{64}$/);
  assert.equal(inserts, 1);
  existing = true;
  used = limits.MAX_IMAGE_STORAGE_BYTES;
  assert.equal(await storage.storeImage(stored), first);
  assert.equal(inserts, 1);
  existing = false;
  await assert.rejects(storage.storeImage(stored), /IMAGE_STORAGE_FULL/);
  assert.equal(inserts, 1);
  console.log('Passed: auth, input/body limits, invalid images, WebP resizing, quota, deduplication, image serving and cache headers.');
})().catch(error => { console.error(error); process.exitCode = 1; });
