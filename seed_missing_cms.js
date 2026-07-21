const fs = require('fs');
const { execSync } = require('child_process');

// Collect all t(key, fallback) from all tsx files
const files = ['src/app/HomePageClient.tsx'];
let fallbacks = {};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const regex = /t\s*\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    fallbacks[match[1]] = match[2];
  }
}

// Add known missing ones that might not be in HomePageClient
const extraFallbacks = {
  "contact_phone": "+91 9990004878",
  "contact_email": "info@myskillcounsellor.com",
  "contact_location": "New Delhi, India",
  "whatsapp_number": "919990004878",
  "instagram_url": "https://instagram.com/myskillcounsellor",
  "linkedin_url": "https://linkedin.com/company/myskillcounsellor",
  "footer_tagline": "Empowering students to achieve global education dreams.",
  "footer_copyright": "© 2026 My Skill Counsellor. All rights reserved.",
  "meta_title": "My Skill Counsellor | Global Study Abroad Experts",
  "meta_description": "Get expert guidance for your study abroad journey."
};

Object.assign(fallbacks, extraFallbacks);

console.log(JSON.stringify(fallbacks, null, 2));
