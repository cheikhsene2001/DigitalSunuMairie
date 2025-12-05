import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaiementSuccess.css';

const PaiementSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer les paramètres de retour PayTech
    const ref_command = searchParams.get('ref_command');
    const token = searchParams.get('token');
    
    console.log('🔍 Retour paiement:', { ref_command, token });

    if (ref_command) {
      // Extraire demande_id de ref_command (format: CERT_14_1733350123)
      const parts = ref_command.split('_');
      if (parts.length >= 2) {
        const demandeId = parts[1];
        verifierPaiement(demandeId);
      } else {
        setError('Référence de commande invalide');
        setLoading(false);
      }
    } else {
      setError('Aucune référence de paiement trouvée');
      setLoading(false);
    }
  }, [searchParams]);

  const verifierPaiement = async (demandeId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/paiements/verifier_paiement/?demande_id=${demandeId}`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du paiement');
      }

      const data = await response.json();
      console.log('✅ Vérification paiement:', data);

      if (data.paiement_effectue) {
        setVerified(true);
      } else {
        setError('Le paiement n\'a pas encore été confirmé. Veuillez patienter quelques instants.');
      }
    } catch (err) {
      console.error('❌ Erreur vérification:', err);
      setError('Erreur lors de la vérification du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleRetourDashboard = () => {
    navigate('/citoyen/dashboard');
  };

  if (loading) {
    return (
      <div className="paiement-page">
        <div className="paiement-card">
          <div className="loading-spinner">⏳</div>
          <h2>Vérification du paiement...</h2>
          <p>Veuillez patienter pendant que nous confirmons votre paiement.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="paiement-page">
        <div className="paiement-card error">
          <div className="icon">⚠️</div>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={handleRetourDashboard}>
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="paiement-page">
      <div className="paiement-card success">
        <div className="icon">✅</div>
        <h2>Paiement réussi !</h2>
        <p>Votre paiement a été confirmé avec succès.</p>
        <p className="info-text">
          Votre demande de certificat sera traitée dans les plus brefs délais.
          Vous recevrez une notification par email une fois le certificat validé.
        </p>
        <button className="btn-primary" onClick={handleRetourDashboard}>
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
};

export default PaiementSuccess;
