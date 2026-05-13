import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // <-- Így már az igazi sorsolót hívja be!
import './index.css'
import ReactGA from "react-ga4";

// Itt indítjuk el a mérést a te kódoddal!
ReactGA.initialize("G-XK68917HWF");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)