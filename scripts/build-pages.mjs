// Builds the GitHub Pages preview: the same static site, served under
// https://juanius-ahos.github.io/issam-oman-tours/ instead of a domain root.
// Run: npm run build:pages   Output: dist/site
import { execSync } from 'node:child_process';

const env = {
  ...process.env,
  VITE_BASE: '/issam-oman-tours/',
  VITE_SITE_URL: 'https://juanius-ahos.github.io',
};
execSync('npm run build', { stdio: 'inherit', env });
