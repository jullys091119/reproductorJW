import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";

// 🔹 Configuración de Firebase (sin variables de entorno)
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

export async function POST() {
  try {
    const url =
      "https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=sjjm&fileformat=MP3&langwritten=S&alllangs=0";

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ ok: false, error: `JW: ${res.status} - ${text}` }, { status: 500 });
    }

    const data = await res.json();
    const songs = data.files?.S?.MP3 || [];

    if (songs.length === 0) {
      return NextResponse.json({ ok: false, error: "No songs found" }, { status: 404 });
    }

    // 🔹 Guardar en Firestore usando batch
    const batch = writeBatch(db);
    songs.forEach((song, index) => {
      const numero = song.track || index;
      const ref = doc(db, "cantos", numero.toString());
      batch.set(ref, {
        numero,
        titulo: song.title,
        url: song.file?.url || "",
        filesize: song.filesize,
        duration: song.duration,
        importedAt: new Date().toISOString()
      }, { merge: true });
    });

    await batch.commit();

    return NextResponse.json({ ok: true, total: songs.length });
  } catch (err) {
    console.error("Error en /api/import-songs:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
