const fs = require('fs');

const hocr = fs.readFileSync('out.hocr', 'utf8');
const lines = hocr.split('\n');

for (const line of lines) {
  if (line.includes('रिया') || line.includes('जैन') || line.includes('स्वतंत्रता')) {
    const match = line.match(/bbox (\d+) (\d+) (\d+) (\d+)/);
    if (match) {
      console.log('Found keyword:', line.replace(/<[^>]*>?/gm, '').trim());
      console.log('Y-coordinate:', match[2]);
    }
  }
}
