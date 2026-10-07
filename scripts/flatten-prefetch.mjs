// Next's static export can write segment-prefetch payloads as nested folders
// (out/work/x/__next.work/$d$slug/__PAGE__.txt) while the client router
// requests a flat file name (out/work/x/__next.work.$d$slug.__PAGE__.txt).
// Copy each nested file to its flat name so link prefetching doesn't 404.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
let copied = 0;

function filesIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? filesIn(p) : [p];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of filesIn(p)) {
        const flat = join(dir, `${name}.${relative(p, file).split(sep).join(".")}`);
        if (!existsSync(flat)) {
          copyFileSync(file, flat);
          copied++;
        }
      }
    } else {
      walk(p);
    }
  }
}

if (existsSync(OUT)) walk(OUT);
console.log(`flatten-prefetch: ${copied} file(s) copied`);
