# Portifolio

Portfólio pessoal de Thiago, em Astro estático no GitHub Pages (gratuito), em português e inglês.

- Dados em `data/` (JSON, nos dois idiomas), validados por `npm run validate`.
- Só muda quando o Thiago pede "atualizar portifolio"; toda mudança entra por pull request aprovado por ele.
- Comandos: `npm install`, `npm run dev`, `npm run build`.

## Limitação
Não existe API pública confirmada que liste os projetos do claude.ai. Por isso o Claude escreve os dados no repositório quando o Thiago pede, em vez de o site descobrir projetos sozinho. Não há cron nem segredos.

## Deploy
Em Settings > Pages, escolher "GitHub Actions". Cada merge na `main` publica em https://thiagogs202.github.io/portifolio/.
