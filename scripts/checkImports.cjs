
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// The exact file names git has stored (this is what Vercel will build).
const tracked = new Set(
  execSync('git ls-files', { encoding: 'utf8' })
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
);

const CODE = /\.(js|jsx|ts|tsx)$/;
const EXTENSIONS = ['', '.js', '.jsx', '.ts', '.tsx', '.json', '.css'];
let problems = 0;

for (const file of tracked) {
  if (!CODE.test(file)) continue;
  const code = fs.readFileSync(file, 'utf8');

  // import x from './a', import './a', import('./a')
  for (const m of code.matchAll(/(?:from|import)\s*\(?\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const spec = m[1].split('?')[0];
    const target = path.posix.join(path.posix.dirname(file), spec);

    const candidates = [
      ...EXTENSIONS.map((ext) => target + ext),
      `${target}/index.js`,
      `${target}/index.jsx`,
    ];

    if (!candidates.some((c) => tracked.has(c))) {
      problems++;
      console.log(`${file}\n   import '${spec}' -> no stored file with exactly that name`);
    }
  }
}

console.log(
  problems === 0
    ? 'All import paths match the stored file names.'
    : `${problems} problem(s) found.`
);