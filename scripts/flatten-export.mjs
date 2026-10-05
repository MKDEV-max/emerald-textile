// Next 16 static export кладёт RSC-сегменты вложенными папками (__next.a/b/__PAGE__.txt),
// а клиент при prefetch запрашивает плоское имя (__next.a.b.__PAGE__.txt).
// Скрипт создаёт плоские копии, чтобы клиентские переходы на GitHub Pages работали без 404.
import fs from "fs";
import path from "path";

const root = path.resolve(process.argv[2] || "out");
let count = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("__next.")) flatten(full, dir, e.name);
    else walk(full);
  }
}

function flatten(segDir, parent, prefix) {
  for (const e of fs.readdirSync(segDir, { withFileTypes: true })) {
    const full = path.join(segDir, e.name);
    const name = `${prefix}.${e.name}`;
    if (e.isDirectory()) flatten(full, parent, name);
    else {
      fs.copyFileSync(full, path.join(parent, name));
      count++;
    }
  }
}

walk(root);
fs.writeFileSync(path.join(root, ".nojekyll"), "");
console.log(`flatten-export: ${count} файлов`);
