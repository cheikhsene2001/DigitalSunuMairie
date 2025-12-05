// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Auth.css";

// function CitoyenRegister() {
//   const navigate = useNavigate();

//   return (
//     <div className="auth-container">
//       <h2>Créer un compte citoyen</h2>
//       <form className="auth-form">
//         <input type="text" placeholder="Nom complet" required />
//         <input type="email" placeholder="Adresse email" required />
//         <input type="password" placeholder="Mot de passe" required />
//         <button type="submit" className="btn-primary">S'inscrire</button>
//       </form>

//       <p>Vous avez déjà un compte ?</p>
//       <button className="btn-secondary" onClick={() => navigate("/citoyen/login")}>
//         Se connecter
//       </button>

//       <div className="divider">OU</div>

//       <button className="btn-google">Continuer avec Google</button>
//     </div>
//   );
// }

// export default CitoyenRegister;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../../firebase";
import "./Auth.css";

function CitoyenRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Inscription avec email et mot de passe
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // ✅ Sauvegarder les infos du citoyen dans localStorage
      localStorage.setItem("citoyen", JSON.stringify({
        email: user.email,
        nom: nom || user.displayName || email.split('@')[0],
        uid: user.uid
      }));
      
      navigate("/citoyen/dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé");
      } else if (error.code === "auth/invalid-email") {
        setError("Email invalide");
      } else {
        setError("Erreur d'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Connexion avec Google
  const handleGoogleRegister = async () => {
    setError("");
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // ✅ Sauvegarder les infos du citoyen dans localStorage
      localStorage.setItem("citoyen", JSON.stringify({
        email: user.email,
        nom: user.displayName || "Citoyen",
        uid: user.uid
      }));
      
      navigate("/citoyen/dashboard");
    } catch (error) {
      setError("Erreur d'inscription Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        {/* Left side - Branding */}
        <div className="auth-left">
          <div className="branding">
            <div className="logo">🏛️</div>
            <h1>DigitalSunuMairie</h1>
            <p>Obtenez vos certificats en ligne</p>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Inscription rapide</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Sécurité garantie</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Disponible 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Créer un compte</h2>
            <p className="subtitle">Inscrivez-vous pour demander des certificats</p>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>Adresse email</label>
                <input
                  type="email"
                  placeholder="votre.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="Au moins 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <small>Minimum 6 caractères</small>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </form>

            <div className="divider">
              <span>ou</span>
            </div>

            <button 
              onClick={handleGoogleRegister} 
              className="btn-google"
              disabled={loading}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
              Continuer avec Google
            </button>

            <p className="switch-auth">
              Déjà un compte ?{" "}
              <span onClick={() => navigate("/citoyen/login")}>
                Se connecter
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CitoyenRegister;
