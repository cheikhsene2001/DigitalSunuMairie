
// import React, { useState, useEffect } from "react";
// import "./Dashboard.css";

// function DemandeCertificat() {
//   const [regions, setRegions] = useState([]);
//   const [departements, setDepartements] = useState([]);
//   const [communes, setCommunes] = useState([]);
//   const [mairies, setMairies] = useState([]);

//   const [region, setRegion] = useState("");
//   const [departement, setDepartement] = useState("");
//   const [commune, setCommune] = useState("");
//   const [typeCertificat, setTypeCertificat] = useState("");
//   const [motif, setMotif] = useState("");
//   const [numeroRegistre, setNumeroRegistre] = useState("");
//   const [anneeDeclaration, setAnneeDeclaration] = useState("");

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Charger les régions au démarrage
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/regions/")
//       .then((res) => res.json())
//       .then(setRegions)
//       .catch(() => setError("Erreur de chargement des régions"));
//   }, []);

//   // Charger les départements selon la région
//   useEffect(() => {
//     if (!region) return;
//     fetch(`http://127.0.0.1:8000/api/departements/?region=${region}`)
//       .then((res) => res.json())
//       .then(setDepartements)
//       .catch(() => setError("Erreur de chargement des départements"));
//   }, [region]);

//   // Charger les communes selon le département
//   useEffect(() => {
//     if (!departement) return;
//     fetch(`http://127.0.0.1:8000/api/communes/?departement=${departement}`)
//       .then((res) => res.json())
//       .then(setCommunes)
//       .catch(() => setError("Erreur de chargement des communes"));
//   }, [departement]);

//   // Charger toutes les mairies
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/mairies/")
//       .then((res) => res.json())
//       .then(setMairies)
//       .catch(() => console.log("Erreur lors du chargement des mairies"));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!commune || !typeCertificat || !motif) {
//       setError("⚠️ Veuillez remplir tous les champs obligatoires.");
//       return;
//     }

//     if (typeCertificat === "naissance" && (!numeroRegistre || !anneeDeclaration)) {
//       setError("⚠️ Veuillez remplir le numéro de registre et l’année de déclaration.");
//       return;
//     }

//     const mairie = mairies.find((m) => String(m.commune.id) === String(commune));
//     if (!mairie) {
//       setError("❌ Aucune mairie trouvée pour cette commune !");
//       return;
//     }

//     const data = {
//       nom: "Citoyen",
//       prenom: "Anonyme",
//       email: "citoyen@example.com",
//       telephone: "770000000",
//       motif,
//       type_certificat: typeCertificat,
//       mairie_id: mairie.id,
//       statut: "EN_ATTENTE",
//       // Champs supplémentaires pour certificat de naissance
//       numero_registre: typeCertificat === "naissance" ? numeroRegistre : null,
//       annee_declaration: typeCertificat === "naissance" ? anneeDeclaration : null,
//     };

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/demandes/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         setMessage("✅ Votre demande a été envoyée avec succès !");
//         setError("");
//         setMotif("");
//         setTypeCertificat("");
//         setCommune("");
//         setDepartement("");
//         setRegion("");
//         setNumeroRegistre("");
//         setAnneeDeclaration("");
//       } else {
//         setError("❌ Erreur lors de l’envoi de la demande !");
//       }
//     } catch {
//       setError("❌ Impossible de contacter le serveur !");
//     }
//   };

//   return (
//     <div className="demande-container">
//       <h2>📝 Faire une demande de certificat</h2>

//       {message && <p className="success-text">{message}</p>}
//       {error && <p className="error-text">{error}</p>}

//       <form onSubmit={handleSubmit} className="demande-form">
//         <label>Région :</label>
//         <select
//           value={region}
//           onChange={(e) => {
//             setRegion(e.target.value);
//             setDepartement("");
//             setCommune("");
//           }}
//           required
//         >
//           <option value="">-- Choisir une région --</option>
//           {regions.map((r) => (
//             <option key={r.id} value={r.id}>
//               {r.nom}
//             </option>
//           ))}
//         </select>

//         <label>Département :</label>
//         <select
//           value={departement}
//           onChange={(e) => {
//             setDepartement(e.target.value);
//             setCommune("");
//           }}
//           required
//           disabled={!region}
//         >
//           <option value="">-- Choisir un département --</option>
//           {departements.map((d) => (
//             <option key={d.id} value={d.id}>
//               {d.nom}
//             </option>
//           ))}
//         </select>

//         <label>Commune :</label>
//         <select
//           value={commune}
//           onChange={(e) => setCommune(e.target.value)}
//           required
//           disabled={!departement}
//         >
//           <option value="">-- Choisir une commune --</option>
//           {communes.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.nom}
//             </option>
//           ))}
//         </select>

//         <label>Type de certificat :</label>
//         <select
//           value={typeCertificat}
//           onChange={(e) => setTypeCertificat(e.target.value)}
//           required
//         >
//           <option value="">-- Choisir un type --</option>
//           <option value="naissance">Naissance</option>
//           <option value="mariage">Mariage</option>
//           <option value="deces">Décès</option>
//           <option value="residence">Résidence</option>
//         </select>

//         {/* Champs supplémentaires pour le certificat de naissance */}
//         {typeCertificat === "naissance" && (
//           <>
//             <label>Numéro de registre :</label>
//             <input
//               type="text"
//               value={numeroRegistre}
//               onChange={(e) => setNumeroRegistre(e.target.value)}
//               placeholder="Ex: 12345"
//               required
//             />

//             <label>Année de déclaration :</label>
//             <input
//               type="number"
//               value={anneeDeclaration}
//               onChange={(e) => setAnneeDeclaration(e.target.value)}
//               placeholder="Ex: 2020"
//               required
//             />
//           </>
//         )}

//         <label>Motif :</label>
//         <textarea
//           value={motif}
//           onChange={(e) => setMotif(e.target.value)}
//           placeholder="Ex : Dossier administratif, inscription, etc."
//           required
//         ></textarea>

//         <button type="submit" className="btn-primary">
//           Envoyer la demande
//         </button>
//       </form>
//     </div>
//   );
// }

// export default DemandeCertificat;

import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function DemandeCertificat() {
  const [regions, setRegions] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [mairies, setMairies] = useState([]);

  const [region, setRegion] = useState("");
  const [departement, setDepartement] = useState("");
  const [commune, setCommune] = useState("");
  const [typeCertificat, setTypeCertificat] = useState("");
  const [motif, setMotif] = useState("");

  // ✅ Champs citoyen
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  // ✅ Champs supplémentaires (naissance)
  const [numeroRegistre, setNumeroRegistre] = useState("");
  const [anneeDeclaration, setAnneeDeclaration] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/regions/")
      .then((res) => res.json())
      .then(setRegions);
  }, []);

  useEffect(() => {
    if (!region) return;
    fetch(`http://127.0.0.1:8000/api/departements/?region=${region}`)
      .then((res) => res.json())
      .then(setDepartements);
  }, [region]);

  useEffect(() => {
    if (!departement) return;
    fetch(`http://127.0.0.1:8000/api/communes/?departement=${departement}`)
      .then((res) => res.json())
      .then(setCommunes);
  }, [departement]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/mairies/")
      .then((res) => res.json())
      .then(setMairies);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!nom || !prenom || !email || !telephone || !commune || !typeCertificat || !motif) {
      setError("⚠️ Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (typeCertificat === "naissance" && (!numeroRegistre || !anneeDeclaration)) {
      setError("⚠️ Veuillez remplir le numéro de registre et l’année de déclaration.");
      return;
    }

    const mairie = mairies.find((m) => String(m.commune.id) === String(commune));
    if (!mairie) {
      setError("❌ Aucune mairie trouvée pour cette commune !");
      return;
    }

    const data = {
      nom,
      prenom,
      email,
      telephone,
      motif,
      type_certificat: typeCertificat,
      mairie_id: mairie.id,
      statut: "EN_ATTENTE",
      numero_registre: typeCertificat === "naissance" ? numeroRegistre : null,
      annee_declaration: typeCertificat === "naissance" ? anneeDeclaration : null,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/demandes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("✅ Votre demande a été envoyée avec succès !");
        setError("");
        setNom("");
        setPrenom("");
        setEmail("");
        setTelephone("");
        setMotif("");
        setTypeCertificat("");
        setCommune("");
        setDepartement("");
        setRegion("");
        setNumeroRegistre("");
        setAnneeDeclaration("");
      } else {
        setError("❌ Erreur lors de l’envoi de la demande !");
      }
    } catch {
      setError("❌ Impossible de contacter le serveur !");
    }
  };

  return (
    <div className="demande-container">
      <h2>📝 Faire une demande de certificat</h2>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="demande-form">

        {/* ✅ Infos citoyen */}
        <label>Nom :</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />

        <label>Prénom :</label>
        <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />

        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Téléphone :</label>
        <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />

        {/* ✅ Région / Département / Commune */}
        <label>Région :</label>
        <select value={region} onChange={(e) => { setRegion(e.target.value); setDepartement(""); setCommune(""); }} required>
          <option value="">-- Choisir une région --</option>
          {regions.map((r) => <option key={r.id} value={r.nom}>{r.nom}</option>)}
        </select>

        <label>Département :</label>
        <select value={departement} onChange={(e) => { setDepartement(e.target.value); setCommune(""); }} required disabled={!region}>
          <option value="">-- Choisir un département --</option>
          {departements.map((d) => <option key={d.id} value={d.nom}>{d.nom}</option>)}
        </select>

        <label>Commune :</label>
        <select value={commune} onChange={(e) => setCommune(e.target.value)} required disabled={!departement}>
          <option value="">-- Choisir une commune --</option>
          {communes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>

        <label>Type de certificat :</label>
        <select value={typeCertificat} onChange={(e) => setTypeCertificat(e.target.value)} required>
          <option value="">-- Choisir un type --</option>
          <option value="naissance">Naissance</option>
          <option value="mariage">Mariage</option>
          <option value="deces">Décès</option>
          <option value="residence">Résidence</option>
        </select>

        {typeCertificat === "naissance" && (
          <>
            <label>Numéro de registre :</label>
            <input type="text" value={numeroRegistre} onChange={(e) => setNumeroRegistre(e.target.value)} required />

            <label>Année de déclaration :</label>
            <input type="number" value={anneeDeclaration} onChange={(e) => setAnneeDeclaration(e.target.value)} required />
          </>
        )}

        <label>Motif :</label>
        <textarea value={motif} onChange={(e) => setMotif(e.target.value)} required></textarea>

        <button type="submit" className="btn-primary">Envoyer la demande</button>
      </form>
    </div>
  );
}

export default DemandeCertificat;
