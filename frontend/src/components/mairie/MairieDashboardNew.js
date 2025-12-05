import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import "./MairieDashboardModern.css";

export default function MairieDashboard() {
  const mairieId = localStorage.getItem("mairie_id");
  const mairieCommune = localStorage.getItem("mairie_commune");
  const mairieRegion = localStorage.getItem("mairie_region");

  const [activePage, setActivePage] = useState("dashboard");
  const [demandes, setDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/demandes/")
      .then((r) => r.json())
      .then((data) => {
        setDemandes(data.filter(d => d.mairie && String(d.mairie.id) === String(mairieId)));
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur de chargement des demandes");
        setLoading(false);
      });
  }, [mairieId]);

  // Filtres
  const enAttente = demandes.filter(d => d.statut === "EN_ATTENTE");
  const valides = demandes.filter(d => d.statut === "VALIDEE" || d.statut === "VALIDE");
  const refusees = demandes.filter(d => d.statut === "REFUSEE" || d.statut === "REJETEE" || d.statut === "REJETE");
  const total = demandes.length;

  // Mise à jour du statut
  const updateStatus = (id, statut) => {
    fetch(`http://127.0.0.1:8000/api/demandes/${id}/changer_statut/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    })
      .then(() => {
        setDemandes(prev =>
          prev.map(d => (d.id === id ? { ...d, statut } : d))
        );
        setShowModal(false);
      })
      .catch((err) => setError("Erreur lors de la mise à jour"));
  };

  // Composant: Liste des demandes
  const DemandesList = ({ demandes }) => (
    <div className="demandes-container">
      {demandes.length === 0 ? (
        <div className="empty-state">
          <p>📭 Aucune demande</p>
        </div>
      ) : (
        <div className="demandes-grid">
          {demandes.map((d) => (
            <div key={d.id} className="demande-card">
              <div className="card-header">
                <h4>{d.nom} {d.prenom}</h4>
                <span className={`status-badge status-${d.statut.toLowerCase()}`}>
                  {d.statut}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Type:</strong> {d.type_certificat}</p>
                <p><strong>Email:</strong> {d.email}</p>
                <p><strong>Tél:</strong> {d.telephone}</p>
                <button
                  className="btn-view"
                  onClick={() => {
                    setSelectedDemande(d);
                    setShowModal(true);
                  }}
                >
                  👁️ Voir détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loading">⏳ Chargement...</div>;
  }

  return (
    <div className="mairie-layout">
      <DashboardSidebar onSelect={setActivePage} active={activePage} />

      <div className="mairie-content">
        {/* En-tête */}
        <div className="header-section">
          <div className="header-title">
            <h1>🏛️ {mairieCommune}</h1>
            <p className="subtitle">Région: {mairieRegion}</p>
          </div>
          <div className="header-info">
            <div className="info-badge">
              <span className="badge-label">Total demandes</span>
              <span className="badge-value">{total}</span>
            </div>
          </div>
        </div>

        {error && <div className="error-alert">❌ {error}</div>}

        {/* Dashboard principal */}
        {activePage === "dashboard" && (
          <div className="dashboard-section">
            <h2>📊 Tableau de bord</h2>

            {/* Statistiques */}
            <div className="stats-grid">
              <div className="stat-card waiting">
                <div className="stat-icon">🟡</div>
                <div className="stat-content">
                  <h3>En attente</h3>
                  <p className="stat-number">{enAttente.length}</p>
                </div>
              </div>

              <div className="stat-card approved">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Validées</h3>
                  <p className="stat-number">{valides.length}</p>
                </div>
              </div>

              <div className="stat-card rejected">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <h3>Refusées</h3>
                  <p className="stat-number">{refusees.length}</p>
                </div>
              </div>

              <div className="stat-card total">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h3>Total</h3>
                  <p className="stat-number">{total}</p>
                </div>
              </div>
            </div>

            {/* Graphique simple */}
            <div className="chart-section">
              <h3>📈 Répartition des demandes</h3>
              <div className="progress-bar-container">
                <div className="progress-item">
                  <div className="progress-label">En attente</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill waiting"
                      style={{ width: `${total ? (enAttente.length / total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-count">{enAttente.length}</span>
                </div>

                <div className="progress-item">
                  <div className="progress-label">Validées</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill approved"
                      style={{ width: `${total ? (valides.length / total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-count">{valides.length}</span>
                </div>

                <div className="progress-item">
                  <div className="progress-label">Refusées</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill rejected"
                      style={{ width: `${total ? (refusees.length / total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-count">{refusees.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demandes en attente */}
        {activePage === "attente" && (
          <div className="content-section">
            <h2>🟡 Demandes en attente ({enAttente.length})</h2>
            <DemandesList demandes={enAttente} />
          </div>
        )}

        {/* Demandes validées */}
        {activePage === "valide" && (
          <div className="content-section">
            <h2>✅ Demandes validées ({valides.length})</h2>
            <DemandesList demandes={valides} />
          </div>
        )}

        {/* Demandes refusées */}
        {activePage === "refusee" && (
          <div className="content-section">
            <h2>❌ Demandes refusées ({refusees.length})</h2>
            <DemandesList demandes={refusees} />
          </div>
        )}
      </div>

      {/* Modal détails */}
      {showModal && selectedDemande && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Détails de la demande</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>👤 Informations personnelles</h4>
                <p><strong>Nom:</strong> {selectedDemande.nom}</p>
                <p><strong>Prénom:</strong> {selectedDemande.prenom}</p>
                <p><strong>Email:</strong> {selectedDemande.email}</p>
                <p><strong>Téléphone:</strong> {selectedDemande.telephone}</p>
              </div>

              <div className="modal-section">
                <h4>📄 Demande</h4>
                <p><strong>Type de certificat:</strong> {selectedDemande.type_certificat}</p>
                <p><strong>Statut actuel:</strong> <span className={`status-badge status-${selectedDemande.statut.toLowerCase()}`}>{selectedDemande.statut}</span></p>

                {selectedDemande.type_certificat === "naissance" && (
                  <>
                    <p><strong>Numéro de registre:</strong> {selectedDemande.numero_registre || "—"}</p>
                    <p><strong>Année déclaration:</strong> {selectedDemande.annee_declaration || "—"}</p>
                  </>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-warning"
                  onClick={() => updateStatus(selectedDemande.id, "EN_ATTENTE")}
                >
                  🟡 En attente
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => updateStatus(selectedDemande.id, "VALIDEE")}
                >
                  ✅ Valider
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => updateStatus(selectedDemande.id, "REFUSEE")}
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
