export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { orderId } = req.query;
  const MODE = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
  const BASE = MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

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

  const capRes = await fetch(`${BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await capRes.json();
  if (!capRes.ok) return res.status(capRes.status).json(data);

  // TODO: fulfill the order here (DB, email, etc.) when data.status === "COMPLETED"
  return res.status(200).json(data);
}
