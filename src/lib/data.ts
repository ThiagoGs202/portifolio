import fs from 'node:fs';
import path from 'node:path';
export type Lang = 'pt' | 'en';
export const langs: Lang[] = ['pt', 'en'];
const root = path.resolve('data');
const read = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
export const about = read(path.join(root, 'about.json'));
export const registry = read(path.join(root, 'registry.json'));
export function projects() {
  return registry.projects
    .map((slug: string) => {
      const dir = path.join(root, 'projects', slug);
      const p = read(path.join(dir, 'project.json'));
      const fdir = path.join(dir, 'features');
      p.features = fs.readdirSync(fdir).filter((f) => f.endsWith('.json')).sort().reverse()
        .map((f) => read(path.join(fdir, f)));
      return p;
    })
    .filter((p: any) => p.visibility === 'public');
}
export function updates() {
  const dir = path.join(root, 'updates');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().reverse().map((f) => read(path.join(dir, f)));
}
export const ui = {
  pt: {
    nav: { home: 'Início', projects: 'Projetos', about: 'Sobre', news: 'Novidades' },
    slugs: { projects: 'projetos', about: 'sobre', news: 'novidades' },
    hero: 'Projetos feitos com IA, de ponta a ponta.',
    heroSub: 'Veja o que construí, o que cada projeto entrega e quando foi atualizado.',
    seeProjects: 'Ver projetos', featured: 'Em destaque', counters: { p: 'projetos', f: 'funcionalidades', u: 'última atualização' },
    search: 'Buscar projeto…', allStack: 'Todas as tecnologias', sort: 'Ordenar', sortRecent: 'Mais recente', sortFeatures: 'Mais funcionalidades', none: 'Nenhum projeto encontrado.',
    features: 'Funcionalidades', stack: 'Tecnologias', status: { ativo: 'Ativo', rascunho: 'Em preparação', pausado: 'Pausado' }, delivered: { entregue: 'Entregue', 'em-andamento': 'Em andamento', planejada: 'Planejada' },
    repo: 'Código', demo: 'Ver no ar', back: '← Todos os projetos', updated: 'Atualizado', about: 'Sobre mim', education: 'Formação', languages: 'Idiomas', skills: 'Competências', contact: 'Contato', newsTitle: 'Novidades', skip: 'Ir para o conteúdo', theme: 'Alternar tema', lang: 'Idioma', footer: 'Atualizado só quando eu aprovo.', days: (n: number) => (n === 0 ? 'hoje' : `há ${n} dia${n > 1 ? 's' : ''}`),
  },
  en: {
    nav: { home: 'Home', projects: 'Projects', about: 'About', news: 'News' },
    slugs: { projects: 'projects', about: 'about', news: 'news' },
    hero: 'Projects built with AI, end to end.',
    heroSub: 'See what I built, what each project delivers and when it was last updated.',
    seeProjects: 'See projects', featured: 'Featured', counters: { p: 'projects', f: 'features', u: 'last update' },
    search: 'Search projects…', allStack: 'All technologies', sort: 'Sort', sortRecent: 'Most recent', sortFeatures: 'Most features', none: 'No projects found.',
    features: 'Features', stack: 'Technologies', status: { ativo: 'Active', rascunho: 'In preparation', pausado: 'Paused' }, delivered: { entregue: 'Delivered', 'em-andamento': 'In progress', planejada: 'Planned' },
    repo: 'Code', demo: 'Live', back: '← All projects', updated: 'Updated', about: 'About me', education: 'Education', languages: 'Languages', skills: 'Skills', contact: 'Contact', newsTitle: 'News', skip: 'Skip to content', theme: 'Toggle theme', lang: 'Language', footer: 'Updated only when I approve.', days: (n: number) => (n === 0 ? 'today' : `${n} day${n > 1 ? 's' : ''} ago`),
  },
};
