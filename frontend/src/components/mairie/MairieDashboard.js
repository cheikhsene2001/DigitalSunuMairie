
// import React, { useEffect, useState } from "react";
// import DashboardSidebar from "./DashboardSidebar";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import "./MairieDashboard.css";

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function MairieDashboard() {
//   const mairieId = localStorage.getItem("mairie_id");
//   const mairieCommune = localStorage.getItem("mairie_commune");

//   const [activePage, setActivePage] = useState("dashboard");
//   const [demandes, setDemandes] = useState([]);
//   const [selectedDemande, setSelectedDemande] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/demandes/")
//       .then((r) => r.json())
//       .then((data) => {
//         setDemandes(data.filter(d => d.mairie && String(d.mairie.id) === String(mairieId)));
//       });
//   }, [mairieId]);

//   // ✅ Filtres correctement alignés aux statuts
//   const enAttente = demandes.filter(d => d.statut === "EN_ATTENTE");
//   const valides = demandes.filter(d => d.statut === "VALIDEE" || d.statut === "VALIDE");
//   const refusees = demandes.filter(d => d.statut === "REFUSEE" || d.statut === "REJETEE" || d.statut === "REJETE");

//   const chartData = {
//     labels: ["En attente", "Validées", "Refusées"],
//     datasets: [{
//       data: [enAttente.length, valides.length, refusees.length],
//       backgroundColor: ["#f1c40f", "#27ae60", "#e74c3c"],
//     }],
//   };

//   // ✅ Mise à jour du statut
//   const updateStatus = (id, statut) => {
//     fetch(`http://127.0.0.1:8000/api/demandes/${id}/changer_statut/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ statut }),
//     }).then(() => {
//       setDemandes(prev =>
//         prev.map(d => (d.id === id ? { ...d, statut } : d))
//       );
//       setShowModal(false);
//     });
//   };

//   return (
//     <div className="layout">

//       <DashboardSidebar onSelect={setActivePage} active={activePage} />

//       <div className="content">
//         <h2>🏛️ Mairie de {mairieCommune}</h2>

//         {activePage === "dashboard" && (
//           <>
//             <h3>📊 Statistiques générales</h3>
//             <div className="chart-wrapper">
//               <Pie data={chartData} />
//             </div>

//             <div className="stats-box">
//               <div className="stat yellow">🟡 En attente : {enAttente.length}</div>
//               <div className="stat green">✅ Validées : {valides.length}</div>
//               <div className="stat red">❌ Refusées : {refusees.length}</div>
//             </div>
//           </>
//         )}

//         {activePage === "attente" && <DemandesList demandes={enAttente} onSelect={setSelectedDemande} setShowModal={setShowModal} />}
//         {activePage === "valide" && <DemandesList demandes={valides} onSelect={setSelectedDemande} setShowModal={setShowModal} />}
//         {activePage === "refusee" && <DemandesList demandes={refusees} onSelect={setSelectedDemande} setShowModal={setShowModal} />}
//       </div>

//       {/* ✅ Modal */}
//       {showModal && selectedDemande && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>Détails de la demande</h3>

//             <p><strong>Nom :</strong> {selectedDemande.nom}</p>
//             <p><strong>Prénom :</strong> {selectedDemande.prenom}</p>
//             <p><strong>Email :</strong> {selectedDemande.email}</p>
//             <p><strong>Téléphone :</strong> {selectedDemande.telephone}</p>
//             <p><strong>Type Certificat :</strong> {selectedDemande.type_certificat}</p>

//             {/* Affiche numéro registre & année seulement si naissance */}
//             {selectedDemande.type_certificat === "naissance" && (
//               <>
//                 <p><strong>Numéro de registre :</strong> {selectedDemande.numero_registre || "—"}</p>
//                 <p><strong>Année déclaration :</strong> {selectedDemande.annee_declaration || "—"}</p>
//               </>
//             )}

//             <p><strong>Motif :</strong> {selectedDemande.motif}</p>

//             <div className="modal-actions">
//               <button className="btn btn-green" onClick={() => updateStatus(selectedDemande.id, "VALIDEE")}>✅ Valider</button>
//               <button className="btn btn-red" onClick={() => updateStatus(selectedDemande.id, "REFUSEE")}>❌ Refuser</button>
//               <button className="btn btn-blue" onClick={() => setShowModal(false)}>Fermer</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// function DemandesList({ demandes, onSelect, setShowModal }) {
//   return demandes.length === 0 ? (
//     <p>Aucune demande trouvée.</p>
//   ) : (
//     <table className="list-table">
//       <thead>
//         <tr>
//           <th>Nom</th>
//           <th>Motif</th>
//           <th>Statut</th>
//           <th>Voir</th>
//         </tr>
//       </thead>
//       <tbody>
//         {demandes.map(d => (
//           <tr key={d.id}>
//             <td>{d.nom} {d.prenom}</td>
//             <td>{d.motif}</td>
//             <td>{d.statut}</td>
//             <td><button className="btn btn-blue" onClick={() => { onSelect(d); setShowModal(true); }}>Voir</button></td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./MairieDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MairieDashboard() {
  const mairieId = localStorage.getItem("mairie_id");
  const mairieCommune = localStorage.getItem("mairie_commune");

  const [activePage, setActivePage] = useState("dashboard");
  const [demandes, setDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Charger les demandes de la mairie
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/demandes/")
      .then(res => res.json())
      .then(data => {
        setDemandes(
          data.filter(d => d.mairie && String(d.mairie.id) === String(mairieId))
        );
      });
  }, [mairieId]);

  // Filtres
  const enAttente = demandes.filter(d => d.statut === "EN_ATTENTE");
  const valides = demandes.filter(d => d.statut === "VALIDEE");
  const refusees = demandes.filter(d => d.statut === "REFUSEE");

  const chartData = {
    labels: ["En attente", "Validées", "Refusées"],
    datasets: [{
      data: [enAttente.length, valides.length, refusees.length],
      backgroundColor: ["#f1c40f", "#27ae60", "#e74c3c"],
    }],
  };

  // Mise à jour du statut
  const updateStatus = (id, statut) => {
    fetch(`http://127.0.0.1:8000/api/demandes/${id}/changer_statut/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    }).then(() => {
      setDemandes(prev => prev.map(d => (d.id === id ? { ...d, statut } : d)));
      setShowModal(false);
    });
  };

  return (
    <div className="layout">

      <DashboardSidebar onSelect={setActivePage} active={activePage} />

      <div className="content">
        <h2>🏛️ Mairie de {mairieCommune}</h2>

        {activePage === "dashboard" && (
          <>
            <h3>📊 Statistiques générales</h3>
            <div className="chart-wrapper">
              <Pie data={chartData} />
            </div>

            <div className="stats-box">
              <div className="stat yellow">🟡 En attente : {enAttente.length}</div>
              <div className="stat green">✅ Validées : {valides.length}</div>
              <div className="stat red">❌ Refusées : {refusees.length}</div>
            </div>
          </>
        )}

        {activePage === "attente" && (
          <DemandesList 
            demandes={enAttente}
            onSelect={setSelectedDemande}
            setShowModal={setShowModal}
          />
        )}

        {activePage === "valide" && (
          <DemandesList 
            demandes={valides}
            onSelect={setSelectedDemande}
            setShowModal={setShowModal}
          />
        )}

        {activePage === "refusee" && (
          <DemandesList 
            demandes={refusees}
            onSelect={setSelectedDemande}
            setShowModal={setShowModal}
          />
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedDemande && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Détails de la demande</h3>

            <p><strong>Nom :</strong> {selectedDemande.nom}</p>
            <p><strong>Prénom :</strong> {selectedDemande.prenom}</p>
            <p><strong>Email :</strong> {selectedDemande.email}</p>
            <p><strong>Téléphone :</strong> {selectedDemande.telephone}</p>
            <p><strong>Type Certificat :</strong> {selectedDemande.type_certificat}</p>

            {selectedDemande.type_certificat === "naissance" && (
              <>
                <p><strong>Numéro de registre :</strong> {selectedDemande.numero_registre}</p>
                <p><strong>Année déclaration :</strong> {selectedDemande.annee_declaration}</p>
              </>
            )}

            <p><strong>Motif :</strong> {selectedDemande.motif}</p>

            <div className="modal-actions">
              <button className="btn btn-green" onClick={() => updateStatus(selectedDemande.id, "VALIDEE")}>
                ✅ Valider
              </button>
              <button className="btn btn-red" onClick={() => updateStatus(selectedDemande.id, "REFUSEE")}>
                ❌ Refuser
              </button>
              <button className="btn btn-blue" onClick={() => setShowModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function DemandesList({ demandes, onSelect, setShowModal }) {
  return demandes.length === 0 ? (
    <p>Aucune demande trouvée.</p>
  ) : (
    <table className="list-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Motif</th>
          <th>Statut</th>
          <th>Voir</th>
        </tr>
      </thead>
      <tbody>
        {demandes.map(d => (
          <tr key={d.id}>
            <td>{d.nom} {d.prenom}</td>
            <td>{d.motif}</td>
            <td>{d.statut}</td>
            <td>
              <button
                className="btn btn-blue"
                onClick={() => { onSelect(d); setShowModal(true); }}
              >
                Voir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
