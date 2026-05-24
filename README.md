# Portal Curadoria 2026

Este projeto é um modelo de portal estático para curadoria de ferramentas, serviços, conteúdos ou recursos sobre qualquer tema. A estrutura foi pensada para SEO, Google Ads, AdSense, GitHub Pages, navegação rápida, busca local, busca Google futura e páginas institucionais.

## Como replicar

Use este projeto como base e troque principalmente:

- Nome do portal.
- Tema central.
- Público-alvo.
- Categorias.
- Ferramentas em `dados.json`.
- Cores principais em `style.css`.
- URLs públicas em `index.html`, `script.js`, `manifest.json`, `robots.txt` e `sitemap.xml`.

## Arquivos principais

```txt
index.html        Estrutura principal, SEO, GTM, hero, busca e modal.
style.css         Identidade visual, responsividade e layout.
script.js         Busca local, filtros, cards, modal, métricas e JSON-LD.
dados.json        Base de ferramentas do portal.
sobre.html        Página de transparência editorial.
privacidade.html  Página de privacidade.
robots.txt        Permissões para buscadores.
sitemap.xml       Lista de URLs para indexação.
manifest.json     Configuração básica de PWA.
```

## Roteiro rápido

1. Duplique a pasta do projeto.
2. Edite `dados.json` com 40 a 80 itens do novo tema.
3. Atualize nome, descrição e URL pública em `index.html`.
4. Atualize `SITE_URL` e, se tiver, `GOOGLE_PROGRAMMABLE_SEARCH_ID` em `script.js`.
5. Ajuste as categorias em `categoriasMeta` dentro de `script.js`.
6. Ajuste a paleta no início de `style.css`.
7. Atualize `manifest.json`, `robots.txt` e `sitemap.xml`.
8. Teste localmente via servidor HTTP, não abrindo direto por `file://`.
9. Publique no GitHub Pages.
10. Envie o sitemap no Google Search Console.

## Modelo de item em dados.json

```json
{
  "id": "identificador-curto",
  "nome": "Nome da Ferramenta",
  "categoria": "Categoria",
  "emoji": "🔎",
  "dor_resolvida": "Problema que ela resolve.",
  "descricao": "Descrição curta, útil e editorial.",
  "url": "https://exemplo.com/"
}
```

Boas práticas para `dados.json`:

- Use IDs únicos, sem espaços e sem acentos.
- Mantenha categorias consistentes.
- Prefira links oficiais.
- Evite descrições genéricas demais.
- Inclua sinônimos de busca em `aliasBusca()` no `script.js`.

## Google Tag Manager, Ads e AdSense

O Google Tag Manager pode carregar tags de Google Ads, GA4 e eventos. O projeto já dispara eventos úteis no `dataLayer`, como:

```js
tool_click
google_site_search
```

Para monetizar busca, crie um Google Programmable Search Engine e preencha em `script.js`:

```js
const GOOGLE_PROGRAMMABLE_SEARCH_ID = "SEU_ID_AQUI";
```

Para AdSense, quando tiver seu ID real de publisher, crie `ads.txt` na raiz publicada:

```txt
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
```

Troque pelo seu `pub-...` verdadeiro.

## Checklist de publicação

- `index.html` tem title, meta description, canonical e Open Graph.
- `robots.txt` aponta para o sitemap correto.
- `sitemap.xml` contém home, páginas institucionais e URLs principais.
- `sobre.html` explica a curadoria.
- `privacidade.html` explica anúncios, métricas e links externos.
- O site abre por HTTPS no GitHub Pages.
- A busca local retorna resultados úteis.
- O modal abre sem erro.
- Os anúncios estão rotulados como "Publicidade".
- Não há conteúdo escondido tentando manipular SEO.

## Comando para testar localmente

Na pasta do projeto:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Depois abra:

```txt
http://127.0.0.1:4173/index.html
```

## Prompt mestre

O arquivo `PROMPT-GERADOR-PORTAL.md` contém um roteiro pronto para pedir a uma IA que crie um novo portal baseado neste modelo.
