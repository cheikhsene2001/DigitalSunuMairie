
// import React from "react";
// import "./Home.css";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="home-container">
//       <header className="header">
//         <h1>Bienvenue sur Digital Sunu Mairie</h1>
//         <p>Une plateforme moderne pour faciliter les démarches administratives</p>
//       </header>

//       <div className="sections">
//         <div className="section citoyen">
//           <h2>Espace Citoyen</h2>
//           <p>
//             Connectez-vous ou inscrivez-vous pour effectuer vos démarches administratives
//             en ligne, rapidement et facilement.
//           </p>
//           <div className="buttons">
//             <button className="btn-primary" onClick={() => navigate("/citoyen/login")}>
//               Se connecter
//             </button>
//             <button className="btn-secondary" onClick={() => navigate("/citoyen/register")}>
//               S'inscrire
//             </button>
//           </div>
//         </div>

//         <div className="section admin">
//           <h2>Espace Mairie / Administrateur</h2>
//           <p>
//             Accédez à votre tableau de bord pour consulter les demandes, gérer les certificats
//             et suivre les activités de votre mairie.
//           </p>
//           <div className="buttons">
//             <button className="btn-primary">Connexion Mairie</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const scrollToSection = (selector) => {
    const section = document.querySelector(selector);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="home-wrapper">
      {/* NAVBAR */}
      <nav className="home-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="brand-icon">🇸🇳</span>
            <div className="brand-info">
              <h3>Digital Sunu Mairie</h3>
              <p>Service Public Numérique</p>
            </div>
          </div>
          <button
            type="button"
            className="navbar-link"
            onClick={() => scrollToSection("#features")}
          >
            À propos
          </button>
          <button
            type="button"
            className="navbar-link"
            onClick={() => scrollToSection("#contact")}
          >
            Contact
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenue sur Digital Sunu Mairie</h1>
          <p className="hero-subtitle">
            La plateforme numérique pour simplifier vos démarches administratives
          </p>
          <p className="hero-description">
            Demandez vos certificats en ligne, suivez votre dossier en temps réel et recevez vos documents directement
          </p>
          
          <div className="hero-buttons">
            <button className="btn-hero btn-primary" onClick={() => navigate("/citoyen/login")}>
              👤 Citoyen - Se connecter
            </button>
            <button className="btn-hero btn-secondary" onClick={() => navigate("/citoyen/register")}>
              📝 S'inscrire
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="illustration">
            <span className="icon-large">📋</span>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Pourquoi Digital Sunu Mairie ?</h2>
          <p>Une solution complète pour vos services administratifs</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Rapide & Efficace</h3>
            <p>Demandez vos certificats en quelques minutes, sans déplacement.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Sécurisé</h3>
            <p>Vos données sont protégées et traitées de manière confidentielle.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Accessible</h3>
            <p>Disponible sur tous les appareils : téléphone, tablette, ordinateur.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Transparent</h3>
            <p>Suivez l'état de votre demande en temps réel.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Notification</h3>
            <p>Recevez vos certificats par email dès validation.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🇸🇳</div>
            <h3>Officiel</h3>
            <p>Certifiés par les mairies sénégalaises.</p>
          </div>
        </div>
      </section>

      {/* ACCESS SECTION */}
      <section className="access-section" id="about">
        <div className="section-header">
          <h2>Comment accéder ?</h2>
          <p>Choisissez votre profil pour commencer</p>
        </div>

        <div className="access-cards">
          {/* Card Citoyen */}
          <div className="access-card card-citizen">
            <div className="card-icon">👤</div>
            <h3>Espace Citoyen</h3>
            <p>Vous souhaitez demander un certificat administratif ?</p>
            
            <div className="card-features">
              <div className="feature-item">✓ Inscription gratuite</div>
              <div className="feature-item">✓ Demande de certificats</div>
              <div className="feature-item">✓ Suivi du dossier</div>
              <div className="feature-item">✓ Téléchargement sécurisé</div>
            </div>

            <div className="card-buttons">
              <button className="btn-access btn-login" onClick={() => navigate("/citoyen/login")}>
                Se connecter
              </button>
              <button className="btn-access btn-signup" onClick={() => navigate("/citoyen/register")}>
                S'inscrire
              </button>
            </div>
          </div>

          {/* Card Mairie */}
          <div className="access-card card-admin">
            <div className="card-icon">🏛️</div>
            <h3>Espace Mairie</h3>
            <p>Vous êtes agent d'une mairie ?</p>
            
            <div className="card-features">
              <div className="feature-item">✓ Gestion des demandes</div>
              <div className="feature-item">✓ Validation en ligne</div>
              <div className="feature-item">✓ Génération automatique</div>
              <div className="feature-item">✓ Statistiques détaillées</div>
            </div>

            <div className="card-buttons">
              <button className="btn-access btn-admin" onClick={() => navigate("/mairie/login")}>
                Accès Administrateur
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-number">100+</div>
            <div className="stat-label">Mairies Connectées</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Demandes Traitées</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">24h</div>
            <div className="stat-label">Traitement Moyen</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer" id="contact">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Digital Sunu Mairie</h4>
            <p>Service Public Numérique du Sénégal</p>
          </div>
          <div className="footer-section">
            <h4>Liens</h4>
            <button type="button" onClick={() => scrollToSection("#features")}>À propos</button>
            <button type="button" onClick={() => scrollToSection("#contact")}>Contact</button>
            <button type="button" onClick={() => window.open("https://www.servicepublic.gouv.sn", "_blank")}>Mentions légales</button>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <p>📞 +221 33 XXX XX XX</p>
            <p>📧 support@digitalsunumairie.sn</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Digital Sunu Mairie - République du Sénégal</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
