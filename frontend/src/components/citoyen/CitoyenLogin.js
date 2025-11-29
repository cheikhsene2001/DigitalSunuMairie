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

  // ✅ Connexion avec email et mot de passe
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Connexion réussie !");
      navigate("/citoyen/dashboard");
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  // ✅ Connexion avec Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Bienvenue ${user.displayName || "citoyen"} !`);
      navigate("/citoyen/dashboard");
    } catch (error) {
      console.error("Erreur Google :", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion Citoyen</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          Se connecter
        </button>
      </form>

      <p className="separator">ou</p>

      <button onClick={handleGoogleLogin} className="btn-google">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
        />
        Continuer avec Google
      </button>

      <p className="switch-link">
        Pas encore de compte ?{" "}
        <span onClick={() => navigate("/citoyen/register")}>S'inscrire</span>
      </p>
    </div>
  );
}

export default CitoyenLogin;
