# DESIGN

Referências consultadas (só como inspiração de princípios; nada de logo, texto ou imagem copiado):

- **Linear**: escada de superfícies, bordas de 1px (hairlines) no lugar de sombras pesadas, tracking negativo nos títulos, um único acento (lavanda).
- **Magic UI / Aceternity** (ideia): brilho que segue o cursor nos cards (aqui em CSS + 6 linhas de JS, desligado com `prefers-reduced-motion`).
- **Astro docs (Context7)**: transições de página nativas (`@view-transition`) respeitando `prefers-reduced-motion`.

## Tokens (em `src/styles/global.css`)

- Cor em `oklch` com `light-dark()`: `--bg`, `--surface`, `--surface-2/3`, `--text`, `--muted`, `--line`, `--line-strong`, `--accent`.
- Espaço em base 4px (`--s1`…`--s24`), raios 4/8/12/20, uma família (Inter Variable, hospedada no próprio site) + mono do sistema.
- Fundo: aurora suave no topo + grade de pontos que some com a distância. Sem imagens.
- Movimento: entrada por rolagem (`animation-timeline: view()`) só onde há suporte; sem ele, tudo aparece normal.
- Acessibilidade: foco visível, alvos de 44px, contraste AA nos dois temas, movimento reduzido respeitado.
