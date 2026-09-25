# BgConverter

Conversor de câmbio com cotação ao vivo. HTML, CSS e JavaScript, no mesmo visual do portfólio (fundo escuro e ciano).

**Site:** [bgconverter.vercel.app](https://bgconverter.vercel.app/)

![Tela do BgConverter](./img/preview.png)

## O que faz

- Conversão entre BRL, USD, EUR, GBP, ARS, CAD, JPY e CNY
- Inverter moedas e atalhos de valor (10, 50, 100, 500, 1.000)
- Taxa usada no cálculo e cópia do resultado
- Histórico no navegador, com remoção item a item ou limpar tudo

## Stack

- HTML / CSS / JavaScript
- [CurrencyAPI](https://currencyapi.com/) (via `/api/rates` na Vercel)

## Rodar / deploy

A chave da API fica só no servidor (`CURRENCY_API_KEY`), não no front.

1. Copia `.env.example` → `.env` e cola a chave
2. Na Vercel, cria a variável `CURRENCY_API_KEY` com o mesmo valor
3. `npx vercel dev` pra testar local com a rota `/api/rates`

Se a chave já vazou no Git alguma vez, gera outra no painel da CurrencyAPI e apaga a antiga.
