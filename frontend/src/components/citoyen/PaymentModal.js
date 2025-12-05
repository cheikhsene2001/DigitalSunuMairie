import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ certificat, isOpen, onClose, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePaymentClick = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const demandeId = certificat?.id ?? certificat?.demande_id;
      if (!demandeId) {
        console.error('❌ Impossible de déterminer la demande à payer', certificat);
        setError("Impossible de retrouver la demande sélectionnée. Merci de réessayer.");
        setLoading(false);
        return;
      }

      console.log('💳 Initialisation paiement', {
        demandeId,
        type: certificat?.type_certificat,
        montant: 500,
      });

      // 1️⃣ Créer le paiement et obtenir l'URL PayTech
      const response = await fetch('http://127.0.0.1:8000/api/paiements/creer_paiement/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          demande_id: demandeId,
          montant: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const data = await response.json();
      console.log('✅ Réponse backend paiement', data);

      const urlPaiement = data.url_paiement;

      if (urlPaiement) {
        window.location.href = urlPaiement;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err) {
      console.error('Erreur paiement:', err);
      setError(err.message || 'Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>💳 Paiement en ligne</h2>
        <p className="payment-info">
          Montant: <strong>500 FCFA</strong><br/>
          Pour: <strong>{certificat.type_certificat}</strong><br/>
          <small className="small-text">Vous serez redirigé(e) vers une plateforme de paiement sécurisée</small>
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="paydounya-logo">
          <div className="logo-icon">💰</div>
          <p>Paiement sécurisé via notre partenaire</p>
        </div>

        <div className="payment-methods">
          <h3>Méthodes de paiement acceptées:</h3>
          <ul>
            <li>💳 Carte bancaire Visa/Mastercard</li>
            <li>📱 Orange Money (Sénégal)</li>
            <li>📱 Wave (Afrique de l'Ouest)</li>
            <li>🏦 Virement bancaire</li>
          </ul>
        </div>

        <button
          className="btn-pay"
          onClick={handlePaymentClick}
          disabled={loading}
        >
          {loading ? '⏳ Initialisation du paiement...' : '💳 Payer maintenant (500 FCFA)'}
        </button>

        <p className="payment-note">
          Vous serez redirigé(e) vers une plateforme de paiement sécurisée.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;

