# Prompt Mestre para Gerar Novos Portais

Copie este prompt e substitua os campos entre colchetes.

```txt
Você é um especialista em produto digital, SEO técnico, Google Ads, AdSense, UX 2026 e curadoria editorial.

Quero criar um portal estático de curadoria no mesmo estilo do projeto "Trabalho e Futuro", mas para outro tema.

Dados do novo portal:
- Nome do portal: [NOME DO PORTAL]
- Tema central: [TEMA]
- Público-alvo: [PÚBLICO]
- Objetivo principal do usuário: [OBJETIVO]
- Tom visual desejado: [EX: confiável, moderno, premium, popular, técnico, acolhedor]
- URL pública esperada: [URL DO GITHUB PAGES OU DOMÍNIO]
- ID do Google Tag Manager, se houver: [GTM-XXXXXXX]
- ID do Google Programmable Search, se houver: [CX/ENGINE ID]
- Monetização pretendida: [Google Ads, AdSense, afiliados, newsletter, leads, outros]

Tarefa:
Crie um portal completo com:
1. index.html com SEO técnico, GTM, canonical, Open Graph, JSON-LD WebSite e estrutura semântica.
2. style.css responsivo com paleta adequada ao tema, blocos de confiança, busca central, filtros e cards.
3. script.js com:
   - carregamento de dados.json
   - busca local
   - filtros por categoria
   - URL compartilhável por item
   - modal editorial
   - métricas automáticas
   - JSON-LD ItemList
   - eventos dataLayer
   - suporte opcional ao Google Programmable Search
4. dados.json com 64 itens reais e úteis divididos em 8 categorias.
5. sobre.html explicando a curadoria.
6. privacidade.html explicando anúncios, métricas e links externos.
7. robots.txt apontando para sitemap.xml.
8. sitemap.xml com home, páginas institucionais e URLs dos itens.
9. manifest.json atualizado.

Regras editoriais:
- Cada item deve ter id único, nome, categoria, emoji, dor_resolvida, descricao e url.
- Priorize links oficiais ou fontes confiáveis.
- Evite conteúdo enganoso, promessa exagerada ou linguagem caça-clique.
- O portal deve parecer útil, confiável e feito para decisão rápida.
- Anúncios devem ser rotulados apenas como "Publicidade".
- A busca local deve aceitar sinônimos relevantes do tema.
- As categorias devem representar jornadas reais do usuário, não apenas agrupamentos genéricos.

Regras de design:
- Não criar landing page genérica; a primeira tela deve ser o portal utilizável.
- Usar cards com raio de 8 a 10 px.
- Criar três blocos de confiança no topo.
- Criar bloco "Como escolhemos" com mini-cards no mesmo estilo.
- Usar paleta equilibrada: uma cor de ação, uma cor de confiança e uma cor neutra.
- Garantir boa leitura mobile e desktop.
- Evitar layout dominado por uma única cor.

Saída desejada:
- Mostre primeiro a estrutura de arquivos.
- Depois entregue o conteúdo completo de cada arquivo.
- Inclua um checklist final de publicação no GitHub Pages e Google Search Console.
```

## Campos que normalmente mudam

```txt
[NOME DO PORTAL]
[TEMA]
[PÚBLICO]
[OBJETIVO]
[TOM VISUAL]
[URL]
[GTM]
[GOOGLE_PROGRAMMABLE_SEARCH_ID]
```

## Exemplos de temas replicáveis

- Portal Saúde Digital
- Hub Ferramentas para MEI
- Portal Educação Infantil
- Hub Inteligência Artificial para Professores
- Portal Finanças para Jovens
- Curadoria de Ferramentas para Advogados
- Hub Produtividade para Pequenos Negócios
- Portal Viagem Econômica
- Guia de Apps para Idosos
- Portal Casa Inteligente

## Prompt curto para manutenção

```txt
Revise este portal estático para o tema [TEMA]. Atualize dados.json com mais ferramentas confiáveis, ajuste categoriasMeta e aliasBusca no script.js, regenere sitemap.xml e preserve SEO, acessibilidade, Google Ads/AdSense e layout responsivo.
```
