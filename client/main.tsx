import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'

// Dynamically load web vitals after initial paint to avoid blocking
// Use explicit extension so TypeScript can resolve the module in ESM mode
import('./lib/web-vitals.ts').then(m => m.initWebVitals?.()).catch(()=>{});

// Production entry (debug instrumentation removed after fixing currency format crash)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
