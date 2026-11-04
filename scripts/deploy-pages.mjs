// Builds the GitHub Pages preview and publishes it to the gh-pages branch.
// Run: npm run deploy:pages
// Live at https://juanius-ahos.github.io/issam-oman-tours/en/ a minute or so later.
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(root, 'dist', 'site');
const run = (cmd, cwd = root) => execSync(cmd, { stdio: 'inherit', cwd });

run('npm run build:pages');

const remote = execSync('git remote get-url origin', { cwd: root }).toString().trim();
const name = execSync('git config user.name', { cwd: root }).toString().trim();
const email = execSync('git config user.email', { cwd: root }).toString().trim();
const sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();

// A throwaway repo inside dist/site (dist is git-ignored), force-pushed as gh-pages.
rmSync(join(site, '.git'), { recursive: true, force: true });
run('git init -q -b gh-pages', site);
run('git add -A', site);
run(`git -c core.autocrlf=false -c user.name="${name}" -c user.email="${email}" commit -q -m "Deploy preview from ${sha}"`, site);
run(`git push -q -f ${remote} gh-pages`, site);
rmSync(join(site, '.git'), { recursive: true, force: true });

console.log('Published to gh-pages: https://juanius-ahos.github.io/issam-oman-tours/en/');
