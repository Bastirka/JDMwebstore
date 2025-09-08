// =========================
// JDM Store – Full Auto Dropship Stack (Vercel + Stripe + Supabase + Resend)
// Multi‑file layout in one doc. Copy files into your repo exactly as labeled.
// =========================

// =========================
// FILE: package.json
// =========================
{
  "name": "jdmwebstore",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.4",
    "lucide-react": "^0.447.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "resend": "^4.0.0",
    "stripe": "^16.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8"
  }
}

// =========================
// FILE: .env.example  (create .env locally and in Vercel Project → Settings → Environment Variables)
// =========================
// Stripe
STRIPE_SECRET_KEY=sk_test_************************
STRIPE_WEBHOOK_SECRET=whsec_************************
// App base URL (e.g., https://jdmstore.vercel.app)
PUBLIC_BASE_URL=http://localhost:5173

// Supabase (use service role on server ONLY; in Vercel use Environment Variables)
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  

// Email (Resend)
RESEND_API_KEY=re_********************************
FROM_EMAIL=orders@your-domain.com

// Dropship provider (mock/CJ/ZENDROP). Start with MOCK to test.
PROVIDER=MOCK
PROVIDER_API_KEY=xxxx

// =========================
// FILE: vercel.json  (optional but handy: cron + headers)
// =========================
{
  "crons": [
    { "path": "/api/sync-tracking", "schedule": "*/30 * * * *" }
  ]
}

// =========================
// FILE: index.html  (Tailwind via CDN for quick styling)
// =========================
<!doctype html>
<html lang="lv">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JDM Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-zinc-50">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// =========================
// FILE: vite.config.ts
// =========================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })

// =========================
// FILE: src/main.jsx
// =========================
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// =========================
// FILE: src/App.jsx  (frontend with Checkout → serverless)
// =========================
import React, { useMemo, useState, useEffect } from 'react'
import { ShoppingCart, X, Plus, Minus, Car, Filter, Search, CreditCard } from 'lucide-react'

const CATEGORIES = [
  { id: 'tees', name: 'T‑krekli' },
  { id: 'hoodies', name: 'Hūdiji' },
  { id: 'stickers', name: 'Uzlīmes' },
  { id: 'accessories', name: 'Aksesuāri' }
]

const PRODUCTS = [
  { id: 'tee-hachiroku', title: 'AE86 Track Tee', price: 2499, category: 'tees', img: 'https://images.unsplash.com/photo-1558980394-0b9b5f0c0d62?q=80&w=1200&auto=format&fit=crop', sizes: ['S','M','L','XL'], colors: ['black','white'] },
  { id: 'hoodie-supra', title: 'A80 Supra Hoodie', price: 4900, category: 'hoodies', img: 'https://images.unsplash.com/photo-1627003211337-3a0a3a6e2b5b?q=80&w=1200&auto=format&fit=crop', sizes: ['M','L','XL'], colors: ['black'] },
  { id: 'sticker-kanjo', title: 'Kanjo Night Stickers', price: 950, category: 'stickers', img: 'https://images.unsplash.com/photo-1533554943631-13fd4b36e1b0?q=80&w=1200&auto=format&fit=crop', sizes: ['—'], colors: ['multi'] }
]

const formatEUR = (cents) => new Intl.NumberFormat('lv-LV', { style: 'currency', currency: 'EUR' }).format(cents/100)
const useLocal = (k, init) => { const [s,set] = useState(()=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):init}catch{return init}}); useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(s))}catch{}},[k,s]); return [s,set] }

function Navbar({ cartCount, on
