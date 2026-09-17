import {readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const source = process.argv[2];
if (!source) throw new Error('Pass the migration source directory');
const files = {};
async function capture(relative) {
  for (const entry of await readdir(path.join(source, relative), {withFileTypes: true})) {
    if (entry.name === '.DS_Store') continue;
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) await capture(name);
    else if (entry.isFile()) files[name] = createHash('sha256').update(await readFile(path.join(source, name))).digest('hex');
  }
}
for (const directory of ['src', 'docs', 'plugins', 'static']) await capture(directory);
for (const file of ['package.json', 'pnpm-lock.yaml', 'docusaurus.config.ts', 'sidebars.ts', 'tsconfig.json', 'amplify.yml']) {
  files[file] = createHash('sha256').update(await readFile(path.join(source, file))).digest('hex');
}
await writeFile(new URL('../migration/source-inventory.json', import.meta.url), `${JSON.stringify({sourceCommit: 'a45efb9', files}, null, 2)}\n`);
console.log(`Captured ${Object.keys(files).length} baseline files`);
