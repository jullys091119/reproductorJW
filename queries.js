export async function getSongs() {
  try {
    const res = await fetch("https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=sjjm&fileformat=MP3&langwritten=S&alllangs=0");
    const data = await res.json();
    
    const  songs  = Object.values(data.files.S.MP3)
    const dataSongs = []
    songs.forEach(element => {
      const songData =  {
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