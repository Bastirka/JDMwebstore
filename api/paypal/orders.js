export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const MODE = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
  const BASE = MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

  // get token
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!tokenRes.ok) {
    const t = await tokenRes.text();
    return res.status(500).json({ error: `token: ${tokenRes.status} ${t}` });
  }
  const { access_token } = await tokenRes.json();

  // IMPORTANT: compute price server-side (don’t trust client).
  // Replace this with your own cart lookup:
  const body = await readBody(req);
  const currency = (body?.currency || "EUR").toUpperCase();
  const value = Number(body?.amount ?? 19.99).toFixed(2);

  const orderRes = await fetch(`${BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: currency, value } }],
      application_context: { shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" },
    }),
  });

  const data = await orderRes.json();
  if (!orderRes.ok) return res.status(orderRes.status).json(data);
  return res.status(200).json({ id: data.id });
}

async function readBody(req) {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const str = Buffer.concat(chunks).toString("utf8") || "{}";
    return JSON.parse(str);
  } catch {
    return {};
  }
}

