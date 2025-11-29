
// import React from "react";
// import "./Home.css";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="home-container">
//       <header className="header">
//         <h1>Bienvenue sur Digital Sunu Mairie</h1>
//         <p>Une plateforme moderne pour faciliter les démarches administratives</p>
//       </header>

//       <div className="sections">
//         <div className="section citoyen">
//           <h2>Espace Citoyen</h2>
//           <p>
//             Connectez-vous ou inscrivez-vous pour effectuer vos démarches administratives
//             en ligne, rapidement et facilement.
//           </p>
//           <div className="buttons">
//             <button className="btn-primary" onClick={() => navigate("/citoyen/login")}>
//               Se connecter
//             </button>
//             <button className="btn-secondary" onClick={() => navigate("/citoyen/register")}>
//               S'inscrire
//             </button>
//           </div>
//         </div>

//         <div className="section admin">
//           <h2>Espace Mairie / Administrateur</h2>
//           <p>
//             Accédez à votre tableau de bord pour consulter les demandes, gérer les certificats
//             et suivre les activités de votre mairie.
//           </p>
//           <div className="buttons">
//             <button className="btn-primary">Connexion Mairie</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="header">
        <h1>Bienvenue sur Digital Sunu Mairie</h1>
        <p>Une plateforme moderne pour faciliter les démarches administratives</p>
      </header>

      <div className="sections">
        {/* --- Espace Citoyen --- */}
        <div className="section citoyen">
          <h2>Espace Citoyen</h2>
          <p>
            Connectez-vous ou inscrivez-vous pour effectuer vos démarches administratives
            en ligne, rapidement et facilement.
          </p>
          <div className="buttons">
            <button className="btn-primary" onClick={() => navigate("/citoyen/login")}>
              Se connecter
            </button>
            <button className="btn-secondary" onClick={() => navigate("/citoyen/register")}>
              S'inscrire
            </button>
          </div>
        </div>

        {/* --- Espace Mairie / Administrateur --- */}
        <div className="section admin">
          <h2>Espace Mairie / Administrateur</h2>
          <p>
            Accédez à votre tableau de bord pour consulter les demandes, gérer les certificats
            et suivre les activités de votre mairie.
          </p>
          <div className="buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/mairie/login")}
            >
              Connexion Mairie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
