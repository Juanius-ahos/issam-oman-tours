// Publishes the static site to the gh-pages branch.
//   npm run deploy:pages  preview at https://juanius-ahos.github.io/issam-oman-tours/
//   npm run deploy:live   omanwithissam.com at the domain root, with a CNAME file.
// Run deploy:live only once the domain's DNS points at GitHub Pages: from then on
// GitHub redirects the github.io preview URL to the domain.
import { execSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const live = process.argv.includes('--live');
const domain = 'omanwithissam.com';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(root, 'dist', 'site');
const run = (cmd, cwd = root, env = process.env) => execSync(cmd, { stdio: 'inherit', cwd, env });

if (live) run('npm run build', root, { ...process.env, VITE_BASE: '/', VITE_SITE_URL: `https://${domain}` });
else run('npm run build:pages');
if (live) writeFileSync(join(site, 'CNAME'), `${domain}\n`);

const remote = execSync('git remote get-url origin', { cwd: root }).toString().trim();
const name = execSync('git config user.name', { cwd: root }).toString().trim();
const email = execSync('git config user.email', { cwd: root }).toString().trim();
const sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();

// A throwaway repo inside dist/site (dist is git-ignored), force-pushed as gh-pages.
rmSync(join(site, '.git'), { recursive: true, force: true });
run('git init -q -b gh-pages', site);
run('git add -A', site);
run(`git -c core.autocrlf=false -c user.name="${name}" -c user.email="${email}" commit -q -m "Deploy ${live ? domain : 'preview'} from ${sha}"`, site);
run(`git push -q -f ${remote} gh-pages`, site);
rmSync(join(site, '.git'), { recursive: true, force: true });

console.log(live ? `Published to gh-pages: https://${domain}/en/` : 'Published to gh-pages: https://juanius-ahos.github.io/issam-oman-tours/en/');
