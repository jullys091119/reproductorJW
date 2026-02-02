const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const BASE = "https://www.jw.org";
const LIST_URL = "https://www.jw.org/es/biblioteca/m%C3%BAsica-canciones/cantemos-con-gozo/";

const OUTPUT_PATH = path.join(process.cwd(), "public", "lyrics.json");

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} -> ${url}`);
  return await res.text();
}

// =====================
// Limpieza de texto
// =====================
function normalizeLine(line) {
  return (
    String(line || "")
      .replace(/\u00A0/g, " ") // quita NBSP
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // quita invisibles comunes
      .trim()
  );
}

function cleanLyrics(lines = []) {
  const bannedExact = new Set(["Edición digital", "Edición impresa", "Video"]);

  const cleaned = lines
    .map(normalizeLine)
    .filter(Boolean)
    .filter((line) => {
      if (bannedExact.has(line)) return false;

      const low = line.toLowerCase();

      // ruido típico del sitio
      if (low.startsWith("canción")) return false;
      if (low.includes("cantemos con gozo")) return false;

      // cosas de UI / links
      if (low.includes("descargar")) return false;
      if (low.includes("compartir")) return false;
      if (low.includes("partitura")) return false;
      if (low.includes("tablatura")) return false;

      // referencias extras
      if (low.includes("(vea también")) return false;

      // Eliminar "(canción X)" al final de las estrofas
      if (line.match(/\(canción \d+\)$/)) return false;

      return true;
    });

  // eliminar duplicados consecutivos
  const noDupes = cleaned.filter((line, i) => line !== cleaned[i - 1]);

  return noDupes;
}

// =====================
// 1) Sacar canciones del listado
// =====================
function extractSongLinksFromList(html) {
  const $ = cheerio.load(html);

  const links = new Map();

  $("a[href]").each((_, a) => {
    const href = $(a).attr("href");
    if (!href) return;

    if (!href.includes("/es/biblioteca/m%C3%BAsica-canciones/cantemos-con-gozo/"))
      return;

    const fullUrl = href.startsWith("http") ? href : `${BASE}${href}`;

    // solo canciones: .../cantemos-con-gozo/1-...
    const match = fullUrl.match(/cantemos-con-gozo\/(\d+)-/);
    if (!match) return;

    const numero = Number(match[1]);
    if (!Number.isFinite(numero)) return;

    links.set(numero, fullUrl);
  });

  return [...links.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([numero, url]) => ({ numero, url }));
}

// =====================
// 2) Extraer letra
// =====================
function extractLyricsFromSongPage(html) {
  const $ = cheerio.load(html);

  const article = $("article").first();
  const blocks = article.find("p, li, h2, h3");

  const lines = [];

  blocks.each((_, el) => {
    const text = normalizeLine($(el).text());
    if (!text) return;
    lines.push(text);
  });

  return cleanLyrics(lines);  // Limpiar duplicados y líneas no deseadas
}

// =====================
// 3) Extraer título
// =====================
function extractTitle(html) {
  const $ = cheerio.load(html);

  const title =
    normalizeLine($("h1").first().text()) ||
    normalizeLine($('meta[property="og:title"]').attr("content") || "") ||
    null;

  return title;
}

// =====================
// RUN
// =====================
async function run() {
  console.log("📥 Leyendo listado:", LIST_URL);
  const listHtml = await fetchHtml(LIST_URL);

  const songs = extractSongLinksFromList(listHtml);

  if (!songs.length) {
    console.log("❌ No encontré canciones en el listado.");
    return;
  }

  console.log(`✅ Encontradas ${songs.length} canciones.`);

  const results = [];

  for (const song of songs) {
    try {
      console.log(`🎵 ${song.numero} -> ${song.url}`);

      const html = await fetchHtml(song.url + "?media=sjjm");

      const title = extractTitle(html);

      // lyrics como STRING
      const lyricsArray = extractLyricsFromSongPage(html);
      const lyrics = lyricsArray.join("\n");

      // Eliminar duplicados de la letra antes de agregarla
      const uniqueLyrics = [...new Set(lyrics.split("\n"))].join("\n");

      results.push({
        id: song.numero,
        numero: song.numero,
        title,
        url: song.url,
        lyrics: uniqueLyrics,  // Letras únicas (sin duplicados)
      });

      console.log(`   ✅ OK (${lyricsArray.length} líneas limpias)`);
    } catch (e) {
      console.log(`   ❌ Error en ${song.numero}: ${e.message}`);
      results.push({
        id: song.numero,
        numero: song.numero,
        title: null,
        url: song.url,
        lyrics: "",
        error: e.message,
      });
    }
  }

  // Guardar en el archivo `lyrics.json`
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");

  console.log("\n🎉 Generado:", OUTPUT_PATH);
}

run();
