
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
