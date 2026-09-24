import { readFile, writeFile, mkdir, rename, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const run = promisify(execFile);
const manifest = JSON.parse(await readFile(resolve(root, 'scripts/workshop-portfolio-manifest.json'), 'utf8'));
const cache = resolve(root, '.cache/workshop-portfolios');
const statePath = resolve(cache, 'state.json');
const indexPath = resolve(root, 'src/data/workshop-portfolios.json');
const concurrency = 4;
const version = 1;
await mkdir(cache, { recursive: true });
// Prevent two importers from racing over the same files and checkpoint.
await mkdir(resolve(cache, 'lock'));
async function atomicJSON(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(`${path}.tmp`, JSON.stringify(value, null, 2) + '\n');
  await rename(`${path}.tmp`, path);
}
try {
  let state = {};
  try { state = JSON.parse(await readFile(statePath, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const queue = [...manifest.entries];
  const failures = [];
  let completed = 0, downloaded = 0, skipped = 0;
  let checkpoint = Promise.resolve();
  async function worker() {
    while (queue.length) {
      const entry = queue.shift();
      if (!/^[\w-]+$/.test(entry.id) || !['fcu', 'yzu', 'nantai', 'ntc', 'niu'].includes(entry.school)) throw new Error('Invalid manifest entry');
      const path = `${entry.school}/portfolio/${entry.id}.webp`;
      const output = resolve(root, 'public/img/workshops', path);
      const fingerprint = `${version}:${entry.modifiedTime}`;
      try {
        let valid = false;
        if (state[entry.id]?.fingerprint === fingerprint) {
          try { await sharp(output).stats(); valid = true; } catch {}
        }
        if (valid) { skipped++; } else {
          await mkdir(dirname(output), { recursive: true });
          const raw = resolve(cache, `${entry.id}.download`);
          let lastError;
          for (let attempt = 0; attempt < 4; attempt++) {
            try {
              await run('curl', ['--silent', '--show-error', '--fail', '--location', '--connect-timeout', '15', '--max-time', '60', '--max-filesize', '20971520', `https://drive.google.com/thumbnail?id=${entry.id}&sz=w1200`, '--output', raw]);
              // Decode first: HTML error responses must never become image assets.
              const { data, info } = await sharp(raw).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
              await writeFile(`${output}.tmp`, data);
              await rename(`${output}.tmp`, output);
              state[entry.id] = { fingerprint, path, width: info.width, height: info.height, bytes: info.size };
              downloaded++;
              lastError = null;
              break;
            } catch (error) {
              lastError = error;
              if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * 2 ** attempt + Math.random() * 500));
            } finally { await rm(raw, { force: true }); }
          }
          if (lastError) throw lastError;
        }
        checkpoint = checkpoint.then(() => atomicJSON(statePath, state));
        await checkpoint;
      } catch (error) {
        failures.push({ id: entry.id, name: entry.name, error: error.message });
        console.error(`Failed: ${entry.id} ${entry.name}`);
      }
      completed++;
      if (completed % 20 === 0 || completed === manifest.entries.length) console.log(`${completed}/${manifest.entries.length}, downloaded=${downloaded}, cached=${skipped}, failed=${failures.length}`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  await atomicJSON(resolve(cache, 'failures.json'), failures);
  if (failures.length) {
    process.exitCode = 1;
    console.error('Index unchanged. Rerun to retry missing files; see .cache/workshop-portfolios/failures.json.');
  } else {
    await atomicJSON(indexPath, manifest.entries.map(entry => ({ ...entry, ...state[entry.id], fingerprint: undefined })));
    console.log(`Complete: ${manifest.entries.length} works; ${Object.values(state).reduce((n, e) => n + e.bytes, 0)} bytes.`);
  }
} finally { await rm(resolve(cache, 'lock'), { recursive: true, force: true }); }
