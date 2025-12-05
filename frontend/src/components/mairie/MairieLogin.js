

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./MairieLogin.css";

// export default function MairieLogin() {
//   const navigate = useNavigate();
//   const [regions, setRegions] = useState([]);
//   const [departements, setDepartements] = useState([]);
//   const [communes, setCommunes] = useState([]);

//   const [region, setRegion] = useState("");
//   const [departement, setDepartement] = useState("");
//   const [commune, setCommune] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   // Charger les régions
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/regions/")
//       .then((r) => r.json())
//       .then((data) => setRegions(data))
//       .catch((err) => console.error("Erreur régions:", err));
//   }, []);

//   // Charger les départements
//   useEffect(() => {
//     if (region) {
//       fetch(`http://127.0.0.1:8000/api/departements/?region=${region}`)
//         .then((r) => r.json())
//         .then((data) => setDepartements(data))
//         .catch((err) => console.error("Erreur départements:", err));
//     } else {
//       setDepartements([]);
//       setDepartement("");
//       setCommunes([]);
//       setCommune("");
//     }
//   }, [region]);

//   // Charger les communes
//   useEffect(() => {
//     if (departement) {
//       fetch(`http://127.0.0.1:8000/api/communes/?departement=${departement}`)
//         .then((r) => r.json())
//         .then((data) => setCommunes(data))
//         .catch((err) => console.error("Erreur communes:", err));
//     } else {
//       setCommunes([]);
//       setCommune("");
//     }
//   }, [departement]);

//   // ✅ Connexion mairie via API
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/mairie/login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           region,
//           departement,
//           commune,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("mairie_id", data.mairie.id);
//         localStorage.setItem("mairie_commune", data.mairie.commune.nom);
//         navigate("/mairie/dashboard");
//       } else {
//         setError(data.error || "Erreur de connexion !");
//       }
//     } catch (err) {
//       console.error("Erreur login mairie:", err);
//       setError("Erreur serveur. Veuillez réessayer.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Connexion Mairie</h2>
//       <form onSubmit={handleLogin}>
//         <label>Région</label>
//         <select value={region} onChange={(e) => setRegion(e.target.value)}>
//           <option value="">-- Choisir une région --</option>
//           {regions.map((r) => (
//             <option key={r.id} value={r.nom}>
//               {r.nom}
//             </option>
//           ))}
//         </select>

//         <label>Département</label>
//         <select
//           value={departement}
//           onChange={(e) => setDepartement(e.target.value)}
//           disabled={!region}
//         >
//           <option value="">-- Choisir un département --</option>
//           {departements.map((d) => (
//             <option key={d.id} value={d.nom}>
//               {d.nom}
//             </option>
//           ))}
//         </select>

//         <label>Commune</label>
//         <select
//           value={commune}
//           onChange={(e) => setCommune(e.target.value)}
//           disabled={!departement}
//         >
//           <option value="">-- Choisir une commune --</option>
//           {communes.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.nom}
//             </option>
//           ))}
//         </select>

//         <label>Mot de passe</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Mot de passe mairie"
//           required
//         />

//         {error && <p className="error-text">{error}</p>}

//         <button type="submit" className="login-btn">
//           Se connecter
//         </button>
//       </form>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MairieLogin.css";

export default function MairieLogin() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [region, setRegion] = useState("");
  const [departement, setDepartement] = useState("");
  const [commune, setCommune] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger les régions
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/regions/")
      .then((r) => r.json())
      .then(setRegions)
      .catch((err) => console.error("Erreur régions:", err));
  }, []);

  // Charger les départements selon région
  useEffect(() => {
    if (region) {
      fetch(`http://127.0.0.1:8000/api/departements/?region=${region}`)
        .then((r) => r.json())
        .then(setDepartements)
        .catch((err) => console.error("Erreur départements:", err));
    } else {
      setDepartements([]);
      setDepartement("");
      setCommunes([]);
      setCommune("");
    }
  }, [region]);

  // Charger les communes selon département
  useEffect(() => {
    if (departement) {
      fetch(`http://127.0.0.1:8000/api/communes/?departement=${departement}`)
        .then((r) => r.json())
        .then(setCommunes)
        .catch((err) => console.error("Erreur communes:", err));
    } else {
      setCommunes([]);
      setCommune("");
    }
  }, [departement]);

  // ✅ Connexion mairie
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/mairie/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, departement, commune, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("mairie_id", data.mairie.id);
        localStorage.setItem("mairie_commune", data.mairie.commune.nom);
        navigate("/mairie/dashboard");
      } else {
        setError(data.error || "Erreur de connexion !");
      }
    } catch (err) {
      console.error("Erreur login mairie:", err);
      setError("Erreur serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mairie-login-wrapper">
      <nav className="login-navbar">
        <div className="navbar-brand-login">
          <span>🏛️</span>
          <h3>Mairie Sénégal</h3>
        </div>
        <button className="back-btn-login" onClick={() => navigate("/")}>
          ← Retour
        </button>
      </nav>

      <div className="login-container-mairie">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h2>Espace Administrateur</h2>
            <p>Gestion des demandes de certificats</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {/* Région */}
            <div className="form-group">
              <label>🌍 Région</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="form-input"
              >
                <option value="">-- Sélectionner une région --</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.nom}>
                    {r.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Département */}
            <div className="form-group">
              <label>📍 Département</label>
              <select
                value={departement}
                onChange={(e) => setDepartement(e.target.value)}
                disabled={!region}
                className="form-input"
              >
                <option value="">-- Sélectionner un département --</option>
                {departements.map((d) => (
                  <option key={d.id} value={d.nom}>
                    {d.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Commune */}
            <div className="form-group">
              <label>🏘️ Commune</label>
              <select
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                disabled={!departement}
                className="form-input"
              >
                <option value="">-- Sélectionner une commune --</option>
                {communes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <label>🔑 Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="form-input"
                required
              />
            </div>

            {/* Message d'erreur */}
            {error && <div className="error-message">{error}</div>}

            {/* Bouton connexion */}
            <button type="submit" className="login-btn-submit" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div className="login-footer">
            <p>Mot de passe par défaut : <strong>2025</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
