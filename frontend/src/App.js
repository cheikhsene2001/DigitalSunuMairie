// import React from "react";
// import Home from "./components/Home";

// function App() {
//   return (
//     <div>
//       <Home />
//     </div>
//   );
// }
// export default App;


// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CitoyenRegister from "./components/citoyen/CitoyenRegister";
import CitoyenLogin from "./components/citoyen/CitoyenLogin";
import CitoyenDashboard from "./components/citoyen/CitoyenDashboard";
import MairieLogin from "./components/mairie/MairieLogin";
import MairieDashboard from "./components/mairie/MairieDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/citoyen/register" element={<CitoyenRegister />} />
        <Route path="/citoyen/login" element={<CitoyenLogin />} />
        <Route path="/citoyen/dashboard" element={<CitoyenDashboard />} />
        <Route path="/mairie/login" element={<MairieLogin />} />
        <Route path="/mairie/dashboard" element={<MairieDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;



