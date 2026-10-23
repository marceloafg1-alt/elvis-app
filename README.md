# DBC Gases e Locações

Protótipo do app de compra e entrega da loja: catálogo, busca, carrinho, entrega (moto, caminhonete ou retirada) e pagamento (Pix, cartão ou boleto).

Publicado com GitHub Pages: https://marceloafg1-alt.github.io/elvis-app/

A pasta `logo/` tem a logo em vetor (SVG) e os ícones em PNG.

No iPhone: abra o link no Safari e toque em **Compartilhar › Adicionar à Tela de Início**.

Preços, produtos e endereços são exemplos.

## Painel (admin)

https://marceloafg1-alt.github.io/elvis-app/admin/ cadastra produtos e muda a situação dos pedidos.
Os apps (versão 1 na raiz e versão 2 em `/v2/`) e o painel leem os dados de `data/store.js`.
Nesta fase os dados ficam no armazenamento do navegador (localStorage); para ligar ao Firebase,
basta trocar o objeto `adapter` dentro de `data/store.js`.

## App do entregador

https://marceloafg1-alt.github.io/elvis-app/entregador/ lista as entregas prontas, registra "Saí para entrega"
e confirma a entrega com o código de 4 números que o cliente vê no app. Pagamento e nota fiscal são automáticos;
separação, saída e entrega são marcadas no painel ou pelo entregador.
