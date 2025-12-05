import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ========================================
// FIREBASE ERROR SUPPRESSION (GLOBAL LEVEL)
// ========================================
// Supprimer les erreurs Firebase AVANT que React démarre
(function suppressFirebaseErrors() {
  const firebaseKeywords = [
    'popupoperation',
    'firebase',
    'internal assertion',
    'pending promise',
    'debugfail',
    'debugassert',
    'operation-aborted'
  ];

  const shouldFilter = (text) => {
    const lower = String(text || '').toLowerCase();
    return firebaseKeywords.some(keyword => lower.includes(keyword));
  };

  // Override console avant tout
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function(...args) {
    if (!args.some(arg => shouldFilter(arg))) {
      originalError.apply(console, args);
    }
  };

  console.warn = function(...args) {
    if (!args.some(arg => shouldFilter(arg))) {
      originalWarn.apply(console, args);
    }
  };

  // Capture les erreurs globales
  window.addEventListener('unhandledrejection', (event) => {
    try {
      if (shouldFilter(event.reason?.message || event.reason?.code || String(event.reason || ''))) {
        event.preventDefault();
      }
    } catch (e) {}
  }, true);

  window.addEventListener('error', (event) => {
    try {
      if (shouldFilter(event.message || event.filename || event.error?.message)) {
        event.preventDefault();
        return false;
      }
    } catch (e) {}
  }, true);
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example, reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );
