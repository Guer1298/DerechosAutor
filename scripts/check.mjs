import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../',import.meta.url));
let count = 0;
async function check(directory) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const file = path.join(directory,entry.name);
    if (entry.isDirectory()) await check(file);
    else if (/\.m?js$/.test(entry.name)) {
      const result = spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
      if (result.status !== 0) throw new Error(result.stderr || `No se pudo analizar ${file}`);
      count++;
    }
  }
}
try {
  for (const dir of ['src','tooling','scripts','tests']) await check(path.join(root,dir));
  console.log(`${count} archivos JavaScript analizados sin errores de sintaxis.`);
} catch(error) { console.error(error.message); process.exitCode = 1; }
