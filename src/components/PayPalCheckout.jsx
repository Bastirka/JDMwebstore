import { useEffect, useRef, useState } from "react";

export default function PayPalCheckout({ amount, currency = "EUR" }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (document.getElementById("paypal-sdk")) {
      setLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.id = "paypal-sdk";
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    s.async = true;
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
  }, [clientId, currency]);

  useEffect(() => {
    if (!loaded || !window.paypal || !ref.current) return;

    ref.current.innerHTML = "";

    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch("/api/paypal/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        return data.id;
      },
      onApprove: async (data) => {
        const res = await fetch(`/api/paypal/orders/${data.orderID}/capture`, {
          method: "POST",
        });
        const capture = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(capture));
        alert(`Payment ${capture.status}. Order ${capture.id}`);
      },
      onError: (err) => {
        console.error(err);
        alert("Payment error. Please try again.");
      },
    }).render(ref.current);
  }, [loaded, amount, currency]);

  return <div ref={ref} />;
}
