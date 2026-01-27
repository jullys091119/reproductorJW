import { NextResponse } from "next/server";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "serviceAccountKey.json"), "utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const snapshot = await db.collection("songs").orderBy("numero").get();
    const songs = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(songs);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
