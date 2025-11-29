import React from "react";
import "./MairieDashboard.css";

export default function DashboardSidebar({ onSelect, active }) {
  return (
    <div className="sidebar">
      <h3>🏛️ Mairie</h3>
      <button className={active === "dashboard" ? "active" : ""} onClick={() => onSelect("dashboard")}>📊 Tableau de bord</button>
      <button className={active === "attente" ? "active" : ""} onClick={() => onSelect("attente")}>🟡 En attente</button>
      <button className={active === "valide" ? "active" : ""} onClick={() => onSelect("valide")}>✅ Validées</button>
      <button className={active === "rejete" ? "active" : ""} onClick={() => onSelect("rejete")}>❌ Rejetées</button>
      <button className="logout" onClick={() => { localStorage.clear(); window.location.href = "/mairie/login"; }}>🚪 Déconnexion</button>
    </div>
  );
}
