// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Auth.css";

// function CitoyenLogin() {
//   const navigate = useNavigate();

//   return (
//     <div className="auth-container">
//       <h2>Connexion Citoyen</h2>
//       <form className="auth-form">
//         <input type="email" placeholder="Adresse email" required />
//         <input type="password" placeholder="Mot de passe" required />
//         <button type="submit" className="btn-primary">Se connecter</button>
//       </form>

//       <p>Pas encore inscrit ?</p>
//       <button className="btn-secondary" onClick={() => navigate("/citoyen/register")}>
//         Créer un compte
//       </button>

//       <div className="divider">OU</div>

//       <button className="btn-google">Se connecter avec Google</button>
//     </div>
//   );
// }

// export default CitoyenLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../../firebase";
import "./Auth.css";

function CitoyenLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Connexion avec email et mot de passe
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // ✅ Sauvegarder les infos du citoyen dans localStorage
      localStorage.setItem("citoyen", JSON.stringify({
        email: user.email,
        nom: user.displayName || email.split('@')[0],
        uid: user.uid
      }));
      
      navigate("/citoyen/dashboard");
    } catch (error) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Connexion avec Google
  const handleGoogleLogin = async () => {
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
      setError("Erreur de connexion Google");
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
            <p>Accédez à vos certificats en ligne</p>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Demandes faciles</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Paiement sécurisé</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Téléchargement instantané</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Connexion</h2>
            <p className="subtitle">Connectez-vous à votre compte citoyen</p>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleLogin}>
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

            <div className="divider">
              <span>ou</span>
            </div>

            <button 
              onClick={handleGoogleLogin} 
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
              Pas encore de compte ?{" "}
              <span onClick={() => navigate("/citoyen/register")}>
                S'inscrire
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CitoyenLogin;
