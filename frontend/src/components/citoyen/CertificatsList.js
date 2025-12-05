import React, { useState, useEffect, useCallback } from "react";
import PaymentModal from "./PaymentModal";

export default function CertificatsList() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, certificat: null });
  const citoyen = JSON.parse(localStorage.getItem("citoyen"));

  // Fonction pour charger les demandes
  const loadDemandes = useCallback(async () => {
    if (!citoyen) {
      setError("❌ Vous devez être connecté");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/demandes/?email=${citoyen.email}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      // Trier par date la plus récente en premier
      const sorted = data.sort((a, b) => new Date(b.date_demande) - new Date(a.date_demande));
      setDemandes(sorted);
      setError("");
    } catch (err) {
      console.error("Erreur chargement demandes:", err);
      setError("❌ Impossible de charger vos demandes. Vérifiez votre connexion.");
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  }, [citoyen]);

  // Charger les demandes au montage et configurer le polling
  useEffect(() => {
    loadDemandes();

    // Rafraîchir toutes les 5 secondes pour détecter les changements de statut
    const interval = setInterval(loadDemandes, 5000);

    return () => clearInterval(interval);
  }, [loadDemandes]);

  // Ouvrir le modal de paiement
  const handlePaymentClick = (certificat) => {
    setPaymentModal({ isOpen: true, certificat });
  };

  // Fermer le modal de paiement
  const handleClosePaymentModal = () => {
    setPaymentModal({ isOpen: false, certificat: null });
  };

  // Après paiement réussi, télécharger le certificat
  const handlePaymentSuccess = () => {
    const certificat = paymentModal.certificat;
    // Attendre un peu pour que le backend enregistre le paiement
    setTimeout(() => {
      window.location.href = `http://127.0.0.1:8000/api/certificat/${certificat.id}/pdf/`;
    }, 1000);
  };

  // Séparer les demandes par statut
  const enAttente = demandes.filter((d) => d.statut === "EN_ATTENTE");
  const validees = demandes.filter((d) => d.statut === "VALIDEE");

  const renderDemande = (d, isValidee) => (
    <div key={d.id} className="certificat-card">
      <div className="card-header">
        <h3>🎖️ {d.type_certificat.toUpperCase()}</h3>
        <span className={`badge ${isValidee ? "badge-valid" : "badge-pending"}`}>
          {isValidee ? "✅ Validé" : "⏳ En attente"}
        </span>
      </div>

      <div className="card-body">
        <p><strong>Mairie :</strong> {d.mairie?.commune?.nom || "Chargement..."}</p>
        <p><strong>Date de demande :</strong> {new Date(d.date_demande).toLocaleDateString('fr-FR')}</p>
        {d.type_certificat === "naissance" && (
          <>
            <p><strong>N° Registre :</strong> {d.numero_registre || "—"}</p>
            <p><strong>Année :</strong> {d.annee_declaration || "—"}</p>
          </>
        )}
        <p><strong>Motif :</strong> {d.motif}</p>
      </div>

      <div className="card-footer">
        {isValidee ? (
          <>
            {d.paiement && d.paiement.statut === 'EFFECTUE' ? (
              <button
                className="btn-download-card"
                style={{ background: '#10b981' }}
                onClick={() => {
                  window.location.href = `http://127.0.0.1:8000/api/certificat/${d.id}/pdf/`;
                }}
              >
                📥 Télécharger le certificat
              </button>
            ) : (
              <button
                className="btn-download-card"
                onClick={() => handlePaymentClick(d)}
              >
                💳 Payer et télécharger (500 FCFA)
              </button>
            )}
          </>
        ) : (
          <div className="btn-pending">
            ⏳ En attente de validation...
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="list-container">
        <h2>📄 Mes demandes de certificats</h2>
        <div className="no-certificat">
          <p>Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h2>📄 Mes demandes de certificats</h2>
      <p className="subtitle">Suivi de vos demandes et téléchargement de vos certificats</p>

      {error && <p className="error-text">{error}</p>}

      {demandes.length === 0 ? (
        <div className="no-certificat">
          <p>📋 Aucune demande pour le moment.</p>
          <p>Créez une demande pour commencer !</p>
        </div>
      ) : (
        <>
          {/* CERTIFICATS VALIDÉS */}
          {validees.length > 0 && (
            <div className="section-certificats">
              <h3>✅ Certificats validés ({validees.length})</h3>
              <div className="certificat-cards">
                {validees.map((d) => renderDemande(d, true))}
              </div>
            </div>
          )}

          {/* DEMANDES EN ATTENTE */}
          {enAttente.length > 0 && (
            <div className="section-certificats">
              <h3>⏳ Demandes en attente ({enAttente.length})</h3>
              <div className="certificat-cards">
                {enAttente.map((d) => renderDemande(d, false))}
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL DE PAIEMENT */}
      <PaymentModal
        certificat={paymentModal.certificat}
        isOpen={paymentModal.isOpen}
        onClose={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
