import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
const root = 'data';
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const errors = [];
const txt = z.string().min(1);
const iso = z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'data ISO');
const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const bi = (shape) => z.object({ pt: z.object(shape), en: z.object(shape) });
const project = z.object({
  slug: z.string().regex(slugRe), name: txt, status: z.enum(['ativo', 'rascunho', 'pausado']),
  kind: z.literal('claude-project'), createdAt: iso, lastUpdatedAt: iso, lastUpdateRef: z.string(),
  stack: z.array(txt), links: z.object({ repo: z.string().url().nullable(), demo: z.string().url().nullable() }),
  featured: z.boolean(), visibility: z.enum(['public', 'private']),
}).and(bi({ summary: z.string().max(160), pitch: txt }))
  .and(z.object({ metrics: z.array(z.object({ value: z.union([txt, z.object({ pt: txt, en: txt })]), pt: txt, en: txt })).optional() }));
const sec = z.array(z.object({ title: txt, text: txt })).optional();
const extra = z.object({ pt: z.object({ architecture: sec, decisions: sec, security: sec, learnings: sec }).passthrough(), en: z.object({ architecture: sec, decisions: sec, security: sec, learnings: sec }).passthrough() }).passthrough();
const feature = z.object({ date: iso, status: z.enum(['entregue', 'em-andamento', 'planejada']), group: z.string().optional(), tags: z.array(txt) })
  .and(bi({ title: txt, impact: txt, body: txt }));
const check = (schema, file) => {
  const r = schema.safeParse(read(file));
  if (!r.success) errors.push(`${file}: ${r.error.issues.map((i) => i.path.join('.') + ' ' + i.message).join('; ')}`);
};
const reg = read(path.join(root, 'registry.json'));
const seen = new Set();
for (const slug of reg.projects) {
  if (seen.has(slug)) errors.push(`slug duplicado: ${slug}`);
  seen.add(slug);
  const dir = path.join(root, 'projects', slug);
  if (!fs.existsSync(path.join(dir, 'project.json'))) { errors.push(`falta project.json: ${slug}`); continue; }
  check(project, path.join(dir, 'project.json'));
  check(extra, path.join(dir, 'project.json'));
  if (read(path.join(dir, 'project.json')).slug !== slug) errors.push(`slug diferente da pasta: ${slug}`);
  const fdir = path.join(dir, 'features');
  for (const f of fs.existsSync(fdir) ? fs.readdirSync(fdir) : []) check(feature, path.join(fdir, f));
}
// padrões de segredo e dado pessoal em todo o repo versionado
const bad = [/ghp_[A-Za-z0-9]{20,}/, /sk-[A-Za-z0-9]{20,}/, /api[_-]?key\s*[:=]/i, /\(\d{2}\)\s?9\d{4}-?\d{4}/, /CLAUDE_global/i];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  if (['node_modules', '.git', 'dist', '.astro', 'scripts'].includes(e.name)) return [];
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
for (const f of walk('.')) {
  if (!/\.(json|md|ts|astro|mjs|yml|css|html)$/.test(f) || f.endsWith('package-lock.json')) continue;
  const t = fs.readFileSync(f, 'utf8');
  for (const re of bad) if (re.test(t)) errors.push(`${f}: padrão proibido ${re}`);
}
if (errors.length) { console.error('Validação falhou:\n' + errors.join('\n')); process.exit(1); }
console.log('Dados válidos.');
