

// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// // 🔥 Mets ici la configuration de ton projet Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCLaQ-On_50hmJyqI6JBmHru9q4m9mdy3w",
//   authDomain: "digitalsunumairie.firebaseapp.com",
//   projectId: "digitalsunumairie",
//   storageBucket: "digitalsunumairie.firebasestorage.app",
//   messagingSenderId: "549662751113",
//   appId: "1:549662751113:web:d6a00944df3093a7e30958",
//   measurementId: "G-EQ46FL3RYT"
// };

// // Initialiser Firebase
// const app = initializeApp(firebaseConfig);

// // Services Firebase
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

// // Exporter pour l'utiliser ailleurs
// export { auth, provider };
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLaQ-On_50hmJyqI6JBmHru9q4m9mdy3w",
  authDomain: "digitalsunumairie.firebaseapp.com",
  projectId: "digitalsunumairie",
  storageBucket: "digitalsunumairie.appspot.com", // ✅ CORRECTION ICI
  messagingSenderId: "549662751113",
  appId: "1:549662751113:web:d6a00944df3093a7e30958",
  measurementId: "G-EQ46FL3RYT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
