

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DemandeCertificat from "./DemandeCertificat";
import CertificatsList from "./CertificatsList";
import ProfilCitoyen from "./ProfilCitoyen";
import "./Dashboard.css";

function CitoyenDashboard() {
  const [activeTab, setActiveTab] = useState("accueil");
  const navigate = useNavigate();
  const citoyen = JSON.parse(localStorage.getItem("citoyen") || "{}");

  const renderContent = () => {
    switch (activeTab) {
      case "demandes":
        return <DemandeCertificat />;
      case "certificats":
        return <CertificatsList />;
      case "profil":
        return <ProfilCitoyen />;
      default:
        return (
          <div className="welcome-section">
            <div className="welcome-header">
              <h1>Bienvenue, {citoyen.nom || "Citoyen"} 👋</h1>
              <p>Votre plateforme numérique pour les services de la mairie</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <h3>Mes Demandes</h3>
                <p>Créer et suivre vos demandes de certificats</p>
                <button className="stat-btn" onClick={() => setActiveTab("demandes")}>Accéder</button>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <h3>Mes Certificats</h3>
                <p>Télécharger vos certificats validés</p>
                <button className="stat-btn" onClick={() => setActiveTab("certificats")}>Accéder</button>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <h3>Mon Profil</h3>
                <p>Gérer vos informations personnelles</p>
                <button className="stat-btn" onClick={() => setActiveTab("profil")}>Accéder</button>
              </div>
            </div>

            <div className="info-section">
              <h2>ℹ️ Guide d'utilisation</h2>
              <div className="info-cards">
                <div className="info-card">
                  <h4>1️⃣ Faire une demande</h4>
                  <p>Allez à l'onglet "Demandes" et remplissez le formulaire avec vos informations.</p>
                </div>
                <div className="info-card">
                  <h4>2️⃣ Suivre la progression</h4>
                  <p>Consultez l'onglet "Mes Certificats" pour voir l'état de vos demandes.</p>
                </div>
                <div className="info-card">
                  <h4>3️⃣ Télécharger le certificat</h4>
                  <p>Une fois validé par la mairie, téléchargez votre certificat en PDF.</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("citoyen");
    navigate("/");
  };

  return (
    <div className="citoyen-layout">
      {/* NAVBAR PREMIUM */}
      <nav className="premium-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">🇸🇳</span>
            <div className="brand-text">
              <h3>Digital Sunu Mairie</h3>
              <p>Service Public Numérique</p>
            </div>
          </div>

          <ul className="nav-menu">
            <li>
              <button
                type="button"
                className={`nav-link ${activeTab === "accueil" ? "active" : ""}`}
                onClick={() => setActiveTab("accueil")}
              >
                <span>🏠</span> Accueil
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${activeTab === "demandes" ? "active" : ""}`}
                onClick={() => setActiveTab("demandes")}
              >
                <span>📝</span> Demandes
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${activeTab === "certificats" ? "active" : ""}`}
                onClick={() => setActiveTab("certificats")}
              >
                <span>📄</span> Certificats
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${activeTab === "profil" ? "active" : ""}`}
                onClick={() => setActiveTab("profil")}
              >
                <span>👤</span> Profil
              </button>
            </li>
          </ul>

          <button className="logout-btn" onClick={handleLogout}>
            <span>🔓</span> Déconnexion
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="citoyen-main">
        {renderContent()}
      </main>

      {/* FOOTER */}
      <footer className="citoyen-footer">
        <p>© 2025 Digital Sunu Mairie - Service Public du Sénégal</p>
      </footer>
    </div>
  );
}

export default CitoyenDashboard;

