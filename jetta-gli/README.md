# Jetta GLI — conceito independente

Projeto isolado. Os arquivos anteriores da pasta pai foram preservados.

Node.js 24, TypeScript e CSS; nenhuma dependência instalada. O build usa a remoção nativa de tipos do Node, não um verificador de tipos TypeScript.

```sh
npm run build
npm start
# Em outro terminal, com o servidor ativo:
npm test
```

Prévia: http://127.0.0.1:4174

## Conteúdo e fontes

As seis fotografias são oficiais, obtidas da página Volkswagen Brasil, catálogo MY26. A seleção é provisória até o usuário confirmar ano/modelo e mercado. Os dados técnicos variáveis não foram preenchidos. Créditos em `dist/fontes.html`; URLs exatos em `dist/assets/sources.json`.

O site Lando Norris permitiu leitura da estrutura editorial, mas o navegador conectado estava indisponível para avaliar animações. Bugatti retornou HTTP 403. Não se presume análise visual dessas experiências.

## Interações

Navegação por âncoras, menu móvel com Escape, galeria em dialog nativo com retenção/restauração de foco, setas, Escape e swipe. Os links das imagens também funcionam sem JavaScript. Rolagem nativa, entradas com IntersectionObserver e paralaxe limitada a 18px. No celular, a sequência fixa se torna fluxo normal. Movimento reduzido desativa transições e paralaxe.

## Validação

Build e sintaxe JavaScript; testes Node para destinos internos, arquivos, descrições de imagens, WebP, fontes e respostas HTTP. Testes visuais e de interação em navegador permanecem pendentes se não houver navegador conectado. Nenhum commit, push ou publicação.
