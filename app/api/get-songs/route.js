import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, getDocs } from "firebase/firestore";

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

export async function GET() {
  try {
    const q = query(collection(db, "cantos"), orderBy("numero", "asc"));
    const snapshot = await getDocs(q);
    const songs = snapshot.docs.map(doc => doc.data());

    return NextResponse.json({ ok: true, songs });
  } catch (err) {
    console.error("Error en /api/get-songs:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
