// E2E check for a static site: build then grep the generated HTML.
// No browser needed — run after `astro build`.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const checks = [
  ['adresse', '8 rue nationale'],
  ['code postal', '56250'],
  ['ville', 'Elven'],
  ['téléphone', '02 97 53 55 62'],
  ['JSON-LD Restaurant', '"@type":"Restaurant"'],
  ['catégorie pizzas', 'Nos pizzas'],
  ['catégorie tacos', 'Nos tacos'],
  ['catégorie burgers', 'Nos burgers'],
  ['catégorie kebabs', 'Nos kebabs'],
  ['catégorie quesadillas', 'Nos quesadillas'],
  ['catégorie boissons', 'Nos boissons'],
  ['teaser IA', 'commande assistée par IA'],
  ['easter egg trigger', 'ai-teaser-easter-egg'],
];

console.log('→ astro build');
execSync('npx astro build', { stdio: 'inherit' });

const html = readFileSync('dist/index.html', 'utf-8');

let failed = false;
for (const [label, needle] of checks) {
  if (html.includes(needle)) {
    console.log(`  ✔ ${label}`);
  } else {
    console.error(`  ✘ ${label} — "${needle}" absent de dist/index.html`);
    failed = true;
  }
}

if (failed) {
  console.error('\nE2E check failed.');
  process.exit(1);
}

console.log('\nE2E check OK.');
