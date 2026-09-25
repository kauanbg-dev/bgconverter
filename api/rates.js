export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "method" });
  }

  const key = process.env.CURRENCY_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "missing_key" });
  }

  const base = String(req.query.base || req.query.base_currency || "").toUpperCase();
  const currencies = String(req.query.currencies || "").toUpperCase();

  if (!base || !currencies) {
    return res.status(400).json({ error: "params" });
  }

  const url =
    `https://api.currencyapi.com/v3/latest` +
    `?apikey=${encodeURIComponent(key)}` +
    `&base_currency=${encodeURIComponent(base)}` +
    `&currencies=${encodeURIComponent(currencies)}`;

  try {
    const upstream = await fetch(url);
    const payload = await upstream.json();
    return res.status(upstream.status).json(payload);
  } catch {
    return res.status(502).json({ error: "upstream" });
  }
}
