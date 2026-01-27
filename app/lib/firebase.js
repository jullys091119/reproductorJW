import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCf_aZpXmZ-VFEgFjKxxaPv05wQ7bHGzRw",
  authDomain: "reproductor-28dc7.firebaseapp.com",
  projectId: "reproductor-28dc7",
  storageBucket: "reproductor-28dc7.firebasestorage.app",
  messagingSenderId: "762173959825",
  appId: "1:762173959825:web:14c56494db83e68b8b5930",
  measurementId: "G-QC42EVLMN1"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db}