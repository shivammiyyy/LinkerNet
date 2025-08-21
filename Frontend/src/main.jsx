import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Polyfill: some libraries (e.g. sockjs-client) expect Node's global object
if (typeof global === "undefined") {
  window.global = window;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
