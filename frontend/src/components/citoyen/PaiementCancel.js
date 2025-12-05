import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaiementSuccess.css';

const PaiementCancel = () => {
  const navigate = useNavigate();

  const handleRetourDashboard = () => {
    navigate('/citoyen/dashboard');
  };

  const handleReessayer = () => {
    navigate('/citoyen/dashboard');
  };

  return (
    <div className="paiement-page">
      <div className="paiement-card error">
        <div className="icon">❌</div>
        <h2>Paiement annulé</h2>
        <p>Vous avez annulé le paiement.</p>
        <p className="info-text">
          Aucun montant n'a été débité de votre compte.
          Vous pouvez réessayer le paiement à tout moment depuis votre tableau de bord.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleReessayer}>
            Réessayer le paiement
          </button>
          <button 
            className="btn-primary" 
            onClick={handleRetourDashboard}
            style={{ background: '#718096' }}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaiementCancel;
