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

  // ✅ Inscription avec email et mot de passe
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Inscription réussie !");
      navigate("/citoyen/dashboard");
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  // ✅ Connexion avec Google
  const handleGoogleRegister = async () => {
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
      <h2>Créer un compte Citoyen</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
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
          S'inscrire
        </button>
      </form>

      <p className="separator">ou</p>

      <button onClick={handleGoogleRegister} className="btn-google">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
        />
        Continuer avec Google
      </button>

      <p className="switch-link">
        Déjà un compte ?{" "}
        <span onClick={() => navigate("/citoyen/login")}>Se connecter</span>
      </p>
    </div>
  );
}

export default CitoyenRegister;
