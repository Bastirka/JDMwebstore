import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Car, Filter, Search, BadgeCheck, Truck, CreditCard, ShieldCheck, Menu } from "lucide-react";

/**
 * JDM Web Store – single-file React app
 * ------------------------------------------------------------
 * • TailwindCSS for styling (no extra config needed in Canvas)
 * • Uses lucide-react icons
 * • Client-side cart with localStorage persistence
 * • Search, category & price filters, sorting
 * • Responsive grid, drawer cart, mock checkout
 * • Replace product images/links with your own
 *
 * Drop this file into any React project and render <App />.
 */

// ---- Mock catalog ---------------------------------------------------------
const CATEGORIES = [
  { id: "tees", name: "T-krekli" },
  { id: "hoodies", name: "Hūdiji" },
  { id: "stickers", name: "Uzlīmes" },
  { id: "accessories", name: "Aksesuāri" },
];

const PRODUCTS = [
  {
    id: "tee-hachiroku",
    title: "AE86 Track Tee",
    price: 24.99,
    category: "tees",
    colors: ["melns", "balts"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1558980394-0b9b5f0c0d62?q=80&w=1400&auto=format&fit=crop",
    badge: "Jaunums",
  },
  {
    id: "tee-gt-r",
    title: "R34 Skyline Tee",
    price: 27.5,
    category: "tees",
    colors: ["melns", "pelēks"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1542365887-65b9b5fdd6f2?q=80&w=1400&auto=format&fit=crop",
    badge: "Limited",
  },
  {
    id: "hoodie-supra",
    title: "A80 Supra Hoodie",
    price: 49.0,
    category: "hoodies",
    colors: ["melns"],
    sizes: ["M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1627003211337-3a0a3a6e2b5b?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "sticker-kanjo",
    title: "Kanjo Night Sticker Pack",
    price: 9.5,
    category: "stickers",
    colors: ["multi"],
    sizes: ["—"],
    img: "https://images.unsplash.com/photo-1533554943631-13fd4b36e1b0?q=80&w=1400&auto=format&fit=crop",
    badge: "Bestseller",
  },
  {
    id: "plate-tow",
    title: "JDM Tow Strap Keychain",
    price: 12.0,
    category: "accessories",
    colors: ["sarkans", "zils"],
    sizes: ["—"],
    img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "tee-rotary",
    title: "Rotary Spirit Tee",
    price: 26.0,
    category: "tees",
    colors: ["balts", "melns"],
    sizes: ["S", "M", "L"],
    img: "https://images.unsplash.com/photo-1606663320529-0f4b0aa8213b?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "hoodie-kaido",
    title: "Kaido Racer Hoodie",
    price: 55.0,
    category: "hoodies",
    colors: ["melns", "violets"],
    sizes: ["M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1503377989335-19e3d40a52a8?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "lanyard-jpn",
    title: "Japan Script Lanyard",
    price: 7.99,
    category: "accessories",
    colors: ["melns"],
    sizes: ["—"],
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1400&auto=format&fit=crop",
  },
];

// ---- Utilities ------------------------------------------------------------
const formatPrice = (n) => new Intl.NumberFormat("lv-LV", { style: "currency", currency: "EUR" }).format(n);
const useLocalState = (key, initial) => {
  const [state, set] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, set];
};

// ---- Components -----------------------------------------------------------
function Navbar({ cartCount, onOpenCart }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Atvērt izvēlni">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2 text-xl font-bold">
            <Car className="h-7 w-7" />
            <span>JDM Garage</span>
          </div>
        </div>
        <nav className={`md:flex md:items-center md:gap-6 ${open ? "block" : "hidden md:block"}`}>
          <a href="#catalog" className="block py-2 text-sm font-medium hover:text-black/70">Katalogs</a>
          <a href="#about" className="block py-2 text-sm font-medium hover:text-black/70">Par mums</a>
          <a href="#faq" className="block py-2 text-sm font-medium hover:text-black/70">FAQ</a>
        </nav>
        <button onClick={onOpenCart} className="relative rounded-full border px-3 py-2 transition hover:shadow">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-black px-1.5 text-[10px] font-bold leading-5 text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">JDM stila merch & uzlīmes</h1>
          <p className="mt-3 max-w-prose text-white/80">
            Iedvesmots no Kanjo nakts braucieniem un touge serpentīniem. Kvalitatīvi T‑krekli, hūdiji un aksesuāri ar autentisku vibe.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#catalog" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90">Apskatīt katalogu</a>
            <a href="#about" className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">Uzzināt vairāk</a>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-white/80">
            <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4"/> Bezmaksas piegāde virs €60</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Drošs norēķins</span>
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1517673400267-2d3f6f0d4c5e?q=80&w=1600&auto=format&fit=crop" alt="JDM hero" />
        </div>
      </div>
    </section>
  );
}

function Filters({ query, setQuery, category, setCategory, price, setPrice, sort, setSort }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between">
      <div className="flex flex-1 items-center gap-2 rounded-xl border px-3 py-2">
        <Search className="h-4 w-4" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Meklēt produktus…" className="w-full bg-transparent text-sm outline-none" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Visas kategorijas</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Cena līdz</span>
          <input type="range" min={10} max={100} step={1} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          <span className="w-16 text-right text-sm">{formatPrice(price)}</span>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="relevance">Relevants</option>
          <option value="price-asc">Cena ↑</option>
          <option value="price-desc">Cena ↓</option>
          <option value="title">Nosaukums A–Z</option>
        </select>
      </div>
    </div>
  );
}

function ProductCard({ p, onAdd }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative">
        <img src={p.img} alt={p.title} className="h-56 w-full object-cover transition group-hover:scale-[1.02]" />
        {p.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            <BadgeCheck className="h-3 w-3" /> {p.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold leading-tight">{p.title}</h3>
          <p className="mt-1 text-xs text-black/60 capitalize">{p.category}</p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="text-lg font-bold">{formatPrice(p.price)}</div>
          <button onClick={() => onAdd(p)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition hover:bg-black hover:text-white">
            <Plus className="h-4 w-4" /> Grozā
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, items, setItems, onCheckout }) {
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  const updateQty = (id, delta) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));
  };
  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  return (
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 transition ${open ? "opacity-100" : "opacity-0"}`} />
      {/* Panel */}
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-xl transition ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-bold">Jūsu grozs</h2>
          <button onClick={onClose} aria-label="Aizvērt"><X className="h-6 w-6"/></button>
        </div>
        <div className="flex h-[calc(100%-9rem)] flex-col overflow-hidden">
          <div className="flex-1 space-y-3 overflow-auto p-4">
            {items.length === 0 ? (
              <p className="text-sm text-black/60">Grozs ir tukšs. Pievieno produktus!</p>
            ) : (
              items.map((it) => (
                <div key={it.id} className="flex gap-3 rounded-xl border p-3">
                  <img src={it.img} className="h-16 w-16 rounded-lg object-cover" alt="" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="truncate text-sm font-semibold">{it.title}</p>
                        <p className="text-xs text-black/60">{formatPrice(it.price)} · {it.color || it.colors?.[0]} · {it.size || it.sizes?.[0]}</p>
                      </div>
                      <button onClick={() => remove(it.id)} className="text-black/50 hover:text-black" aria-label="Noņemt">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-lg border px-2 py-1">
                        <button onClick={() => updateQty(it.id, -1)} aria-label="Mazāk"><Minus className="h-4 w-4"/></button>
                        <span className="w-6 text-center text-sm">{it.qty}</span>
                        <button onClick={() => updateQty(it.id, +1)} aria-label="Vairāk"><Plus className="h-4 w-4"/></button>
                      </div>
                      <div className="text-sm font-semibold">{formatPrice(it.price * it.qty)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span>Starpsumma</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 font-semibold text-white transition enabled:hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/30"
            >
              <CreditCard className="h-5 w-5" /> Turpināt uz apmaksu
            </button>
            <p className="mt-2 text-center text-xs text-black/60">Piegāde un nodokļi tiks aprēķināti vēlāk.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function CheckoutModal({ open, onClose, onConfirm, total }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const valid = email.includes("@") && name.length > 1 && address.length > 5;
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 transition ${open ? "opacity-100" : "opacity-0"}`} />
      <div className={`absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border bg-white p-5 shadow-xl transition ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <h3 className="text-lg font-bold">Apmaksa</h3>
        <p className="mt-1 text-sm text-black/60">Aizpildi piegādes informāciju. (Demo – maksājums netiek veikts.)</p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-black/70">Vārds, uzvārds</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="Aija Babre" />
          </div>
          <div>
            <label className="text-xs text-black/70">E-pasts</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="aija@example.com" />
          </div>
          <div>
            <label className="text-xs text-black/70">Piegādes adrese</label>
            <textarea value={address} onChange={(e)=>setAddress(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" rows={3} placeholder="Iela 1, Rēzekne, LV-4601" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">Maksājums: <span className="font-semibold">{formatPrice(total)}</span></div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm font-semibold">Atpakaļ</button>
            <button onClick={() => valid && onConfirm()} disabled={!valid} className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-black/30">Apstiprināt</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold"><Car className="h-6 w-6"/>JDM Garage</div>
          <p className="mt-2 text-sm text-black/60">Autentisks JDM merch, veidots faniem, testēts trasē.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Info</h4>
          <ul className="mt-2 space-y-1 text-sm text-black/70">
            <li><a href="#about" className="hover:underline">Par mums</a></li>
            <li><a href="#faq" className="hover:underline">Piegāde & atgriešana</a></li>
            <li><a href="#" className="hover:underline">Privātums</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Atbalsts</h4>
          <ul className="mt-2 space-y-1 text-sm text-black/70">
            <li><a href="#" className="hover:underline">Kontakti</a></li>
            <li><a href="#" className="hover:underline">Pasūtījuma izsekošana</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Jaunumiem</h4>
          <div className="mt-2 flex items-center overflow-hidden rounded-xl border">
            <input placeholder="E-pasts" className="flex-1 px-3 py-2 text-sm outline-none"/>
            <button className="bg-black px-4 py-2 text-sm font-semibold text-white">Pieteikties</button>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-black/60">© {new Date().getFullYear()} JDM Garage. All rights reserved.</div>
    </footer>
  );
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [items, setItems] = useLocalState("jdm_cart", []);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState(100);
  const [sort, setSort] = useState("relevance");

  const addToCart = (p) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === p.id);
      if (existing) return prev.map((it) => (it.id === p.id ? { ...it, qty: it.qty + 1 } : it));
      return [...prev, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.price <= price);
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => [p.title, p.category].some((s) => s.toLowerCase().includes(q)));
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "title": list.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break;
    }
    return list;
  }, [query, category, price, sort]);

  const cartCount = items.reduce((s, it) => s + it.qty, 0);
  const cartTotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  const confirmOrder = () => {
    setCheckoutOpen(false);
    setItems([]);
    alert("Paldies! Pasūtījums pieņemts (demo režīms).");
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      <Hero />

      <main id="catalog" className="mx-auto max-w-7xl px-4">
        <div className="-mt-8 flex justify-center">
          <div className="-translate-y-1/2 rounded-2xl border bg-white p-3 shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm">Kategorijas:</span>
              {CATEGORIES.map((c) => (
                <a key={c.id} href="#catalog" onClick={() => setCategory(c.id)} className={`rounded-lg px-3 py-1 text-sm ${category===c.id?"bg-black text-white":"hover:bg-black/5"}`}>{c.name}</a>
              ))}
              <a href="#catalog" onClick={() => setCategory("all")} className={`rounded-lg px-3 py-1 text-sm ${category==="all"?"bg-black text-white":"hover:bg-black/5"}`}>Visi</a>
            </div>
          </div>
        </div>

        <Filters
          query={query} setQuery={setQuery}
          category={category} setCategory={setCategory}
          price={price} setPrice={setPrice}
          sort={sort} setSort={setSort}
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={addToCart} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border bg-white p-8 text-center text-sm text-black/60">Nav atrastu produktu pēc dotajiem filtriem.</div>
          )}
        </div>

        <section id="about" className="mt-16">
          <h2 className="text-2xl font-bold">Par JDM Garage</h2>
          <p className="mt-2 max-w-prose text-sm text-black/70">
            Mēs esam fanu komanda no Baltijas, kas rada kvalitatīvu apģērbu un aksesuārus JDM kultūras cienītājiem. Dizainos izmantojam japāņu tipogrāfiju, retro liverijas un touge iedvesmu.
          </p>
        </section>

        <section id="faq" className="mt-12">
          <h2 className="text-2xl font-bold">Biežāk uzdotie jautājumi</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-xl border bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold">Kādas ir piegādes izmaksas?</summary>
              <p className="mt-2 text-sm text-black/70">Latvijā piegāde no €3.99, bez maksas virs €60. ES – atkarībā no valsts.</p>
            </details>
            <details className="rounded-xl border bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold">Kā darbojas atgriešana?</summary>
              <p className="mt-2 text-sm text-black/70">14 dienu atgriešanas politika – nevalkātām precēm oriģinālajā iepakojumā.</p>
            </details>
            <details className="rounded-xl border bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold">Vai pieejami vairumtirdzniecības piedāvājumi?</summary>
              <p className="mt-2 text-sm text-black/70">Jā, raksti mums – sagatavosim piedāvājumu komandām un veikaliem.</p>
            </details>
          </div>
        </section>

        <Footer />
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} setItems={setItems} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={confirmOrder} total={cartTotal} />
    </div>
  );
}
