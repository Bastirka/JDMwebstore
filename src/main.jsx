// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'            // tieši 'App', bez paplašinājuma un ar lielo A

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
