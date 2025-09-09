import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;
const MODE = process.env.PAYPAL_MODE || "sandbox";
const BASE = MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

app.post("/api/orders", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { amount = "19.99", currency = "USD" } = req.body;

    const orderRes = await fetch(`${BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          { amount: { currency_code: currency, value: amount } },
        ],
      }),
    });

    const order = await orderRes.json();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders/:id/capture", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { id } = req.params;

    const captureRes = await fetch(`${BASE}/v2/checkout/orders/${id}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const capture = await captureRes.json();
    res.json(capture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`PayPal server running on http://localhost:${PORT}`));
