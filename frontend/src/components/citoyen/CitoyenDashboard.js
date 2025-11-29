

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DemandeCertificat from "./DemandeCertificat";
// import CertificatsList from "./CertificatsList";
// import ProfilCitoyen from "./ProfilCitoyen";
// import "./Dashboard.css";

// function Dashboard() {
//   const [activeTab, setActiveTab] = useState("accueil");
//   const navigate = useNavigate();

//   const renderContent = () => {
//     switch (activeTab) {
//       case "demandes":
//         return <DemandeCertificat />;
//       case "certificats":
//         return <CertificatsList />;
//       case "profil":
//         return <ProfilCitoyen />;
//       default:
//         return (
//           <div className="dashboard-welcome">
//             <h2>Bienvenue sur votre espace citoyen 👋</h2>
//             <p>
//               Depuis ce tableau de bord, vous pouvez effectuer vos demandes de certificats, 
//               suivre leur avancement, et consulter vos informations personnelles.
//             </p>
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/4359/4359957.png"
//               alt="illustration"
//             />
//             <br />
//             {/* ✅ Nouveau bouton pour accéder aux demandes */}
//             <button 
//               className="demande-btn"
//               onClick={() => setActiveTab("demandes")}
//             >
//               📝 Cliquer ici pour faire une demande
//             </button>
//           </div>
//         );
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("citoyen");
//     navigate("/");
//   };

//   return (
//     <div className="dashboard-container">
//       <nav className="navbar">
//         <div className="navbar-logo">🏛️ Digital Sunu Mairie</div>
//         <ul className="navbar-links">
//           <li
//             className={activeTab === "accueil" ? "active" : ""}
//             onClick={() => setActiveTab("accueil")}
//           >
//             Accueil
//           </li>
//           <li
//             className={activeTab === "demandes" ? "active" : ""}
//             onClick={() => setActiveTab("demandes")}
//           >
//             Demandes
//           </li>
//           <li
//             className={activeTab === "certificats" ? "active" : ""}
//             onClick={() => setActiveTab("certificats")}
//           >
//             Certificats
//           </li>
//           <li
//             className={activeTab === "profil" ? "active" : ""}
//             onClick={() => setActiveTab("profil")}
//           >
//             Profil
//           </li>
//         </ul>
//         <button className="logout-btn" onClick={handleLogout}>
//           Déconnexion
//         </button>
//       </nav>

//       <main className="dashboard-content">{renderContent()}</main>
//     </div>
//   );
// }

// export default Dashboard;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DemandeCertificat from "./DemandeCertificat";
// import CertificatsList from "./CertificatsList";
// import ProfilCitoyen from "./ProfilCitoyen";
// import "./Dashboard.css";

// export default function CitoyenDashboard() {
//   const [activeTab, setActiveTab] = useState("accueil");
//   const navigate = useNavigate();

//   const renderContent = () => {
//     switch (activeTab) {
//       case "demandes":
//         return <DemandeCertificat />;
//       case "certificats":
//         return <CertificatsList />;
//       case "profil":
//         return <ProfilCitoyen />;
//       default:
//         return (
//           <div className="citoyen-welcome">
//             <h2>Bienvenue sur votre espace citoyen 👋</h2>
//             <p>
//               Faites vos demandes administratives, suivez leur progression et accédez facilement à vos certificats.
//             </p>

//             <img
//               src="https://cdn-icons-png.flaticon.com/512/4359/4359957.png"
//               alt="illustration"
//               className="citoyen-illustration"
//             />

//             <button 
//               className="start-demand-btn"
//               onClick={() => setActiveTab("demandes")}
//             >
//               📝 Faire une demande maintenant
//             </button>
//           </div>
//         );
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("citoyen");
//     navigate("/");
//   };

//   return (
//     <div className="citoyen-layout">

//       {/* SIDEBAR */}
//       <aside className="citoyen-sidebar">
//         <div className="sidebar-logo">🏛️ Digital Sunu Mairie</div>

//         <ul className="sidebar-menu">
//           <li className={activeTab === "accueil" ? "active" : ""} onClick={() => setActiveTab("accueil")}>
//             🏠 Accueil
//           </li>
//           <li className={activeTab === "demandes" ? "active" : ""} onClick={() => setActiveTab("demandes")}>
//             📝 Demandes
//           </li>
//           <li className={activeTab === "certificats" ? "active" : ""} onClick={() => setActiveTab("certificats")}>
//             📄 Certificats
//           </li>
//           <li className={activeTab === "profil" ? "active" : ""} onClick={() => setActiveTab("profil")}>
//             👤 Profil
//           </li>
//         </ul>

//         <button className="sidebar-logout" onClick={handleLogout}>
//           🔓 Déconnexion
//         </button>
//       </aside>

//       {/* CONTENT */}
//       <main className="citoyen-content">{renderContent()}</main>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DemandeCertificat from "./DemandeCertificat";
import CertificatsList from "./CertificatsList";
import ProfilCitoyen from "./ProfilCitoyen";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("accueil");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "demandes":
        return <DemandeCertificat />;
      case "certificats":
        return <CertificatsList />;
      case "profil":
        return <ProfilCitoyen />;
      default:
        return (
          <div className="dashboard-welcome">
            <h2>Bienvenue sur votre espace citoyen 👋</h2>
            <p>
              Faites vos demandes de certificats, suivez votre dossier et
              téléchargez vos documents validés.
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4359/4359957.png"
              alt="illustration"
              className="welcome-img"
            />
            <button 
              className="demande-btn"
              onClick={() => setActiveTab("demandes")}
            >
              📝 Faire une demande
            </button>
          </div>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("citoyen");
    navigate("/");
  };

  return (
    <div className="citoyen-container">
      <nav className="citoyen-navbar">
        <div className="navbar-logo">🏛️ Digital Sunu Mairie</div>
        <ul className="navbar-links">
          <li className={activeTab === "accueil" ? "active" : ""} onClick={() => setActiveTab("accueil")}>Accueil</li>
          <li className={activeTab === "demandes" ? "active" : ""} onClick={() => setActiveTab("demandes")}>Demandes</li>
          <li className={activeTab === "certificats" ? "active" : ""} onClick={() => setActiveTab("certificats")}>Certificats</li>
          <li className={activeTab === "profil" ? "active" : ""} onClick={() => setActiveTab("profil")}>Profil</li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </nav>

      <main className="citoyen-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;

