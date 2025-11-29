import React, { useState, useEffect } from "react";

export default function CertificatsList() {
  const [certificats, setCertificats] = useState([]);

  useEffect(() => {
    // Simulation d’un chargement depuis la base
    setCertificats([
      { id: 1, type: "Naissance", commune: "Bambey", statut: "Validé", date: "2025-03-21" },
      { id: 2, type: "Résidence", commune: "Diourbel", statut: "En attente", date: "2025-03-28" },
    ]);
  }, []);

  return (
    <div className="list-container">
      <h2>Mes certificats</h2>

      <table className="certificat-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Commune</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {certificats.map((c) => (
            <tr key={c.id}>
              <td>{c.type}</td>
              <td>{c.commune}</td>
              <td>{c.date}</td>
              <td className={c.statut === "Validé" ? "valide" : "attente"}>
                {c.statut}
              </td>
              <td>
                {c.statut === "Validé" ? (
                  <button className="btn-download">📥 Télécharger</button>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
