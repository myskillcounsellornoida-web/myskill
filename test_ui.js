const fs = require('fs');
const code = fs.readFileSync('src/app/admin/AdminClient.tsx', 'utf-8');
const lines = code.split('\n');
const start = lines.findIndex(l => l.includes('keys: ["faq_section_label"'));
console.log(lines.slice(start + 3, start + 10).join('\n'));
