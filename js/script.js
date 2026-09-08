const CURRENCIES = [
  { code: "BRL", name: "Real brasileiro" },
  { code: "USD", name: "Dólar americano" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "Libra esterlina" },
  { code: "ARS", name: "Peso argentino" },
  { code: "CAD", name: "Dólar canadense" },
  { code: "JPY", name: "Iene japonês" },
  { code: "CNY", name: "Yuan chinês" },
];

const HISTORY_KEY = "bgconverter-history";
const API_KEY = "cur_live_ndmPdJAe9ovpeT2HPZ22UTlAGflw2jlRmw5qxWzj";

const form = document.getElementById("form");
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const submitBtn = document.getElementById("submit");
const statusEl = document.getElementById("status");
const resultCard = document.getElementById("result-card");
const historyEl = document.getElementById("history");

document.getElementById("year").textContent = String(new Date().getFullYear());

let lastResult = null;
let copyTimer;

function fillSelect(select, selected) {
  select.innerHTML = CURRENCIES.map(
    (item) =>
      `<option value="${item.code}" ${item.code === selected ? "selected" : ""}>${item.code} · ${item.name}</option>`
  ).join("");
}

function money(value, currency, digits = 2) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" && digits === 2 ? 0 : digits,
    minimumFractionDigits: currency === "JPY" && digits === 2 ? 0 : Math.min(2, digits),
  });
}

function loadHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(raw) ? raw.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function saveHistory(entry) {
  const next = [entry, ...loadHistory().filter((item) => item.id !== entry.id)].slice(0, 6);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

function removeHistory(id) {
  const next = loadHistory().filter((item) => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("status-error", isError);
}

function renderHistory() {
  const items = loadHistory();
  if (!items.length) {
    historyEl.innerHTML = "";
    return;
  }
  historyEl.innerHTML =
    items
      .map(
        (item) => `<div class="history-item">
          <button type="button" data-id="${item.id}" data-action="use">${item.label}</button>
          <button class="history-remove" type="button" data-id="${item.id}" data-action="remove" aria-label="Remover ${item.label}">×</button>
        </div>`
      )
      .join("") +
    `<button class="history-clear" type="button" data-action="clear">Limpar histórico</button>`;
}

function showResult(data) {
  lastResult = data;
  resultCard.classList.remove("muted");
  resultCard.innerHTML = `
    <p class="kicker">${data.from} → ${data.to}</p>
    <h2>${money(data.converted, data.to)}</h2>
    <p class="rate">1 ${data.from} = ${money(data.rate, data.to, 6)} · ${money(data.amount, data.from)}</p>
    <button class="btn ghost" type="button" id="copy-result">Copiar resultado</button>
  `;
  document.getElementById("copy-result").addEventListener("click", async () => {
    const button = document.getElementById("copy-result");
    const text = `${money(data.amount, data.from)} = ${money(data.converted, data.to)}`;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copiado";
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => {
        if (button) button.textContent = "Copiar resultado";
      }, 1600);
    } catch {
      button.textContent = "Não foi possível copiar";
    }
  });
}

async function convert(amount, from, to) {
  if (from === to) {
    return { amount, from, to, rate: 1, converted: amount };
  }

  const response = await fetch(
    `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`
  );
  if (!response.ok) throw new Error("api");
  const payload = await response.json();
  const rate = payload?.data?.[to]?.value;
  if (!rate) throw new Error("rate");
  return { amount, from, to, rate, converted: amount * rate };
}

async function runConversion({ amount, from, to }) {
  const value = Number(amount);
  if (!value || value < 0) {
    setStatus("Informe um valor maior que zero.", true);
    return;
  }

  setStatus("");

  submitBtn.disabled = true;
  submitBtn.textContent = "Convertendo…";

  try {
    const data = await convert(value, from, to);
    showResult(data);
    const label = `${money(data.amount, data.from)} → ${data.to}`;
    saveHistory({
      id: `${data.from}-${data.to}-${data.amount}`,
      label,
      amount: data.amount,
      from: data.from,
      to: data.to,
    });
    renderHistory();
    setStatus("");
  } catch {
    setStatus("Não foi possível obter a cotação. Tente de novo em instantes.", true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Converter";
  }
}

fillSelect(fromSelect, "BRL");
fillSelect(toSelect, "USD");
renderHistory();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runConversion({
    amount: amountInput.value,
    from: fromSelect.value,
    to: toSelect.value,
  });
});

document.getElementById("swap").addEventListener("click", () => {
  const from = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = from;
  if (lastResult) {
    amountInput.value = String(lastResult.converted);
  }
});

document.getElementById("quick-amounts").addEventListener("click", (event) => {
  const button = event.target.closest("[data-amount]");
  if (!button) return;
  amountInput.value = button.dataset.amount;
  amountInput.focus();
});

historyEl.addEventListener("click", (event) => {
  if (event.target.closest("[data-action='clear']")) {
    clearHistory();
    renderHistory();
    return;
  }

  const removeBtn = event.target.closest("[data-action='remove']");
  if (removeBtn) {
    removeHistory(removeBtn.dataset.id);
    renderHistory();
    return;
  }

  const button = event.target.closest("[data-action='use']");
  if (!button) return;
  const item = loadHistory().find((entry) => entry.id === button.dataset.id);
  if (!item) return;
  amountInput.value = String(item.amount);
  fromSelect.value = item.from;
  toSelect.value = item.to;
  runConversion(item);
});
