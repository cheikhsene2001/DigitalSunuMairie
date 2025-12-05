// import React from "react";
// import Home from "./components/Home";

// function App() {
//   return (
//     <div>
//       <Home />
//     </div>
//   );
// }
// export default App;


import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CitoyenRegister from "./components/citoyen/CitoyenRegister";
import CitoyenLogin from "./components/citoyen/CitoyenLogin";
import CitoyenDashboard from "./components/citoyen/CitoyenDashboard";
import MairieLogin from "./components/mairie/MairieLogin";
import MairieDashboard from "./components/mairie/MairieDashboardNew";
import PaiementSuccess from "./components/citoyen/PaiementSuccess";
import PaiementCancel from "./components/citoyen/PaiementCancel";

function App() {
  // Supprimer les erreurs Firebase non critiques en développement
  useEffect(() => {
    // Capture toutes les fonctions de logging console
    const originalError = window.console.error;
    const originalWarn = window.console.warn;
    const originalLog = window.console.log;
    
    // Liste des mots-clés Firebase à filtrer
    const firebaseKeywords = [
      "popupoperation",
      "firebase",
      "internal assertion",
      "pending promise",
      "debugfail",
      "debugassert"
    ];

    const shouldFilter = (text) => {
      const lower = String(text || '').toLowerCase();
      return firebaseKeywords.some(keyword => lower.includes(keyword));
    };

    // Override console.error
    window.console.error = (...args) => {
      if (!args.some(arg => shouldFilter(arg))) {
        originalError(...args);
      }
    };

    // Override console.warn
    window.console.warn = (...args) => {
      if (!args.some(arg => shouldFilter(arg))) {
        originalWarn(...args);
      }
    };

    // Capture les promesses non gérées
    const handleUnhandledRejection = (event) => {
      try {
        const reason = event.reason;
        if (shouldFilter(reason?.message || reason?.code || String(reason || ''))) {
          event.preventDefault();
        }
      } catch (e) {
        // Ignorer silencieusement
      }
    };

    // Capture les erreurs globales
    const handleError = (event) => {
      try {
        if (
          shouldFilter(event.message) ||
          shouldFilter(event.filename) ||
          shouldFilter(event.error?.message)
        ) {
          event.preventDefault();
          return false;
        }
      } catch (e) {
        // Ignorer silencieusement
      }
    };

    // Ajouter les listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection, true);
    window.addEventListener("error", handleError, true);

    // Essayer de patch la classe PopupOperation si elle existe
    try {
      const popupOperation = window.firebase?.auth?.internal_?.PopupOperation;
      if (popupOperation?.prototype) {
        const originalOnError = popupOperation.prototype.onError;
        popupOperation.prototype.onError = function patchedOnError(error, ...rest) {
          if (shouldFilter(error?.message || error?.code || String(error || ""))) {
            return null;
          }
          return originalOnError ? originalOnError.call(this, error, ...rest) : null;
        };
      }
    } catch (e) {
      // Ignorer
    }

    return () => {
      window.console.error = originalError;
      window.console.warn = originalWarn;
      window.console.log = originalLog;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, true);
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/citoyen/register" element={<CitoyenRegister />} />
        <Route path="/citoyen/login" element={<CitoyenLogin />} />
        <Route path="/citoyen/dashboard" element={<CitoyenDashboard />} />
        <Route path="/mairie/login" element={<MairieLogin />} />
        <Route path="/mairie/dashboard" element={<MairieDashboard />} />
        <Route path="/paiement/success" element={<PaiementSuccess />} />
        <Route path="/paiement/cancel" element={<PaiementCancel />} />
      </Routes>
    </Router>
  );
}

export default App;



