const form = document.getElementById('form');
form.addEventListener('submit', handleSubmit);

const inputValue = document.getElementById('value-real');
const selectedCurrency = document.getElementById('currency');
const result = document.getElementById('result');
let valueConverted = 0;

const apiKey = 'cur_live_ndmPdJAe9ovpeT2HPZ22UTlAGflw2jlRmw5qxWzj'; // substitua pela sua chave da CurrencyAPI

function handleSubmit(e) {
  e.preventDefault();

  if (!inputValue.value || inputValue.value < 0) {
    alert('Informe um valor!');
    return;
  } else if (!selectedCurrency.value) {
    alert('Escolha uma moeda!');
    return;
  }

  converter();
}

async function converter() {
  const baseCurrency = 'BRL';
  const targetCurrency = selectedCurrency.value === 'eur' ? 'EUR' : 'USD';

  try {
    const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${baseCurrency}&currencies=${targetCurrency}`);
    const data = await response.json();
    const rate = data.data[targetCurrency].value;

    valueConverted = inputValue.value * rate;

    const locale = selectedCurrency.value === 'eur' ? 'pt-BR' : 'en-US';
    result.innerHTML = valueFormatter(locale, targetCurrency);

    animateResult();
    inputValue.value = '';
    selectedCurrency.value = '';
  } catch (error) {
    console.error('Erro ao buscar taxa de câmbio:', error);
    alert('Não foi possível obter a taxa de câmbio. Tente novamente mais tarde.');
  }
}

function valueFormatter(locale, currency) {
  const value = valueConverted.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
  });
  return `<span>💸</span> ${value} <span>💸</span>`;
}

function animateResult() {
  return result.animate(
    [
      { transform: 'translateY(-150px)' },
      { transform: 'translateY(0px)' },
    ],
    { duration: 400 }
  );
}
