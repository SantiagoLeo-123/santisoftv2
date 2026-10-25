// Encontra questões em que a alternativa correta é mais longa que RAZAO x a média das erradas.
// Uso: node scripts/auditar_gabarito_longo.mjs [prefixo-do-arquivo] [--lista] [--razao=1.4]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/clinica');
const args = process.argv.slice(2);
const filtro = args.find((a) => !a.startsWith('--')) ?? '';
const lista = args.includes('--lista');
const razao = Number((args.find((a) => a.startsWith('--razao=')) ?? '--razao=1.4').split('=')[1]);

export async function carregar(arquivo) {
  const src = fs.readFileSync(path.join(dir, arquivo), 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const tmp = path.join(dir, `.tmp_${arquivo}.mjs`);
  fs.writeFileSync(tmp, js);
  try {
    const mod = await import(pathToFileURL(tmp).href + `?t=${Date.now()}`);
    return Object.values(mod).flat();
  } finally {
    fs.unlinkSync(tmp);
  }
}

export function ruim(q) {
  const i = 'ABCD'.indexOf(q.g);
  const erradas = q.o.filter((_, k) => k !== i);
  const media = erradas.reduce((s, t) => s + t.length, 0) / erradas.length;
  return media > 0 && q.o[i].length > razao * media;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let total = 0, ruins = 0;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.ts') && f.startsWith(filtro)).sort()) {
    const qs = await carregar(f);
    const r = qs.filter(ruim);
    total += qs.length; ruins += r.length;
    if (r.length) console.log(`${f}: ${r.length}/${qs.length}`);
    if (lista) r.forEach((q) => console.log('   -', q.e.slice(0, 80)));
  }
  console.log(`TOTAL: ${ruins}/${total} (razão > ${razao})`);
}
