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

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  const [numeroRegistre, setNumeroRegistre] = useState("");
  const [anneeDeclaration, setAnneeDeclaration] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/regions/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRegions(data);
      } catch (err) {
        console.error("Erreur chargement régions:", err);
        setError("❌ Impossible de charger les régions");
      } finally {
        setLoading(false);
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    if (!region) {
      setDepartements([]);
      return;
    }
    const loadDepts = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/departements/?region=${region}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDepartements(data);
      } catch (err) {
        console.error("Erreur chargement départements:", err);
        setDepartements([]);
      }
    };
    loadDepts();
  }, [region]);

  useEffect(() => {
    if (!departement) {
      setCommunes([]);
      return;
    }
    const loadCommunes = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/communes/?departement=${departement}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCommunes(data);
      } catch (err) {
        console.error("Erreur chargement communes:", err);
        setCommunes([]);
      }
    };
    loadCommunes();
  }, [departement]);

  useEffect(() => {
    const loadMairies = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/mairies/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMairies(data);
      } catch (err) {
        console.error("Erreur chargement mairies:", err);
        setMairies([]);
      }
    };
    loadMairies();
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
      setError("⚠️ Veuillez remplir le numéro de registre et l'année de déclaration.");
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
        const errorData = await response.json().catch(() => ({}));
        setError(`❌ Erreur: ${errorData.detail || "Impossible d'envoyer la demande"}`);
      }
    } catch (err) {
      console.error("Erreur soumission:", err);
      setError("❌ Impossible de contacter le serveur. Vérifiez votre connexion.");
    }
  };

  if (loading) {
    return <div className="demande-container"><p>⏳ Chargement...</p></div>;
  }

  return (
    <div className="demande-container">
      <h2>📝 Faire une demande de certificat</h2>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="demande-form">
        <label>Nom :</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />

        <label>Prénom :</label>
        <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />

        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Téléphone :</label>
        <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />

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
