import React, { useEffect, useState } from 'react'
import { ShoppingCart, X, Plus, Minus, Car } from 'lucide-react'

const PRODUCTS = [
  {
    id: 'tee-hachiroku',
    title: 'AE86 Track Tee',
    price: 2499,
    img: 'https://images.unsplash.com/photo-1558980394-0b9b5f0c0d62?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'hoodie-supra',
    title: 'A80 Supra Hoodie',
    price: 4900,
    img: 'https://images.unsplash.com/photo-1627003211337-3a0a3a6e2b5b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sticker-kanjo',
    title: 'Kanjo Night Stickers',
    price: 950,
    img: 'https://images.unsplash.com/photo-1533554943631-13fd4b36e1b0?q=80&w=400&auto=format&fit=crop'
  }
]

const formatEUR = (cents) =>
  new Intl.NumberFormat('lv-LV', { style: 'currency', currency: 'EUR' }).format(cents / 100)

function ProductCard({ product, onAdd }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <img
        src={product.img}
        alt={product.title}
        className="w-full aspect-video object-cover"
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-medium">{product.title}</h3>
        <p className="text-sm text-zinc-600">{formatEUR(product.price)}</p>
        <button
          className="mt-auto bg-zinc-900 text-white px-3 py-1 rounded"
          onClick={() => onAdd(product)}
        >
          Pievienot
        </button>
      </div>
    </div>
  )
}

function Cart({ items, onClose, onInc, onDec }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end">
      <div className="bg-white w-80 h-full p-4 flex flex-col">
        <button className="self-end mb-4" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-lg font-semibold mb-4">Grozs</h2>
        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
          {items.length === 0 && (
            <p className="text-sm text-zinc-600">Grozs ir tukšs</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span>{item.title}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => onDec(item.id)}>
                  <Minus size={16} />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => onInc(item.id)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4">
          <p className="font-medium">Kopā: {formatEUR(total)}</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || []
    } catch {
      return []
    }
  })
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const add = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const inc = (id) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    )
  }

  const dec = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    )
  }

  return (
    <div className="p-6">
      <nav className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Car size={24} /> JDM Store
        </h1>
        <button onClick={() => setShowCart(true)} className="relative">
          <ShoppingCart />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={add} />
        ))}
      </div>
      {showCart && (
        <Cart
          items={cart}
          onClose={() => setShowCart(false)}
          onInc={inc}
          onDec={dec}
        />
      )}
    </div>
  )
}

