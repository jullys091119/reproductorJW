export async function setSongs() {
  try {
    const res = await fetch("/api/import-songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("Respuesta de la API:", data);
  } catch (err) {
    console.error("Error obteniendo canciones:", err);
  }
}

export async function getSongs() {
  try {
    const res = await fetch("/api/get-songs");
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Error obteniendo canciones");
    return data.songs;
  } catch (err) {
    console.error("Error obteniendo canciones:", err);
    throw err;
  }
}