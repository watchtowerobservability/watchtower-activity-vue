// Fails when the built wrapper exceeds its budget: it must stay a thin layer over <wt-activity>.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const LIMIT = 2 * 1024;
const gz = gzipSync(readFileSync(new URL('../dist/index.js', import.meta.url)), { level: 9 }).length
  + gzipSync(readFileSync(new URL('../dist/props.js', import.meta.url)), { level: 9 }).length;
console.log(`dist: ${gz} B gz (limit ${LIMIT})`);
if (gz > LIMIT) { console.error('the wrapper exceeds its 2 KB gz budget'); process.exit(1); }
