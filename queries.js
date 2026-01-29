export async function getSongs() {
  try {
    const res = await fetch("https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=sjjm&fileformat=MP3&langwritten=S&alllangs=0");
    const data = await res.json();

    const songs = Object.values(data.files.S.MP3)
    const normalSongs = songs.filter(song => !/audiodescripciones/i.test(song.title))
    const dataSongs = []
    normalSongs.forEach(element => {
      /*  console.log(element.title) */
      const songData = {
        id: element.docid,
        title: element.title,
        file: element.file.url,
        duration: element.duration
      }
      dataSongs.push(songData)
    });
    return dataSongs
  } catch (err) {
    console.error("Error obteniendo canciones:", err);
    throw err;
  }
}


export async function getAlbumCantadas() {
  try {
    const res = fetch("https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=sjjc&fileformat=MP3&alllangs=0&langwritten=S&txtCMSLang=S");
    const data = await (await res).json()
    const songs = Object.values(data.files.S.MP3)
    const normalSongs = songs.filter(song => !/audiodescripciones/i.test(song.title))
    const dataSongs = []
    normalSongs.forEach(element => {
      const songData = {
        id: element.docid,
        title: element.title,
        file: element.file.url,
        duration: element.duration
      }
      dataSongs.push(songData)
    });
    return dataSongs

  } catch (error) {
    console.log(error, "error obteniendo la consulta del album cantadas")
  }
}

