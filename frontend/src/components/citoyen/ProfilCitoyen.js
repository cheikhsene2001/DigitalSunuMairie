// import React, { useState } from "react";

// export default function ProfilCitoyen() {
//   const [profil, setProfil] = useState({
//     nom: "Sène",
//     prenom: "Cheikh",
//     email: "cheikh@example.com",
//     commune: "Bambey",
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setProfil({ ...profil, [e.target.name]: e.target.value });
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     setMessage("✅ Profil mis à jour avec succès !");
//   };

//   return (
//     <div className="profil-container">
//       <h2>Mon profil</h2>
//       <form onSubmit={handleSave}>
//         <label>Nom</label>
//         <input name="nom" value={profil.nom} onChange={handleChange} />

//         <label>Prénom</label>
//         <input name="prenom" value={profil.prenom} onChange={handleChange} />

//         <label>Email</label>
//         <input name="email" type="email" value={profil.email} onChange={handleChange} />

//         <label>Commune</label>
//         <input name="commune" value={profil.commune} onChange={handleChange} />

//         <button type="submit">Enregistrer</button>
//         {message && <p className="message">{message}</p>}
//       </form>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import "./Dashboard.css";

function ProfilCitoyen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupération des informations de l'utilisateur connecté
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="profil-container">
        <h2>Profil Citoyen</h2>
        <p>Chargement des informations...</p>
      </div>
    );
  }

  return (
    <div className="profil-container">
      <div className="profil-card">
        <h2>👤 Mon Profil</h2>
        <div className="profil-info">
          <img
            src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"}
            alt="profil"
            className="profil-photo"
          />
          <div className="profil-details">
            <p><strong>Nom complet :</strong> {user.displayName || "Non spécifié"}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>UID Firebase :</strong> {user.uid}</p>
            <p><strong>Type de connexion :</strong> {user.providerData[0]?.providerId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilCitoyen;
