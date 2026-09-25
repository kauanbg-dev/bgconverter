# BgConverter

Conversor de câmbio com cotação ao vivo. Interface no mesmo visual do portfólio.

**Ao vivo:** [bgconverter.vercel.app](https://bgconverter.vercel.app/)

![Tela do BgConverter](./img/preview.png)

## Funcionalidades

- Conversão entre BRL, USD, EUR, GBP, ARS, CAD, JPY e CNY
- Inversão de moedas e atalhos de valor
- Exibição da taxa usada e cópia do resultado
- Histórico no navegador (remover item a item ou limpar tudo)

## Stack

- HTML, CSS e JavaScript
- [CurrencyAPI](https://currencyapi.com/) via rota serverless `/api/rates` (Vercel)

## Como rodar

A chave da API fica só no servidor (`CURRENCY_API_KEY`), não no front.

```bash
cp .env.example .env
# preenche CURRENCY_API_KEY
npx vercel dev
```

Na Vercel, cria a variável `CURRENCY_API_KEY` no projeto.
