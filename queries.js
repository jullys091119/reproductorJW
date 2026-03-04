




import { Vibur } from "next/font/google";


export async function getSongs() {
  try {
    const res = await fetch("https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=sjjm&fileformat=MP3&langwritten=S&alllangs=0");
    const data = await res.json();

    const songs = Object.values(data.files.S.MP3)
    const normalSongs = songs.filter(song => !/audiodescripciones/i.test(song.title))
    const videos = await getVideosSongs(normalSongs.length)
    console.log(videos)
    const dataSongs = []
    normalSongs.forEach((element, i) => {
      /*  console.log(element.title) */
      const songData = {
        idLyrics: i + 1,
        id: element.docid,
        title: element.title,
        file: element.file.url,
        duration: element.duration,
        nameAlbum: "Cantemos a Jehová (Reuniones)",
        video: videos[i]?.url
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
        duration: element.duration,
        nameAlbum: "Cantemos a Jehová (Cantadas)"
      }
      dataSongs.push(songData)
    });
    return dataSongs

  } catch (error) {
    console.log(error, "error obteniendo la consulta del album cantadas")
  }
}

export async function getAlbumOriginales() {
  try {
    const res = fetch("https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=osg&fileformat=MP3%2CAAC&alllangs=0&langwritten=S&txtCMSLang=S");
    const data = await (await res).json()
    const video = await getVideosOriginales()
    const songs = Object.values(data.files.S.MP3)
    const normalSongs = songs.filter(song => !/audiodescripciones/i.test(song.title))
    const dataSongs = []
    normalSongs.forEach((element,i) => {
      const songData = {
        id: element.docid,
        title: element.title,
        file: element.file.url,
        duration: element.duration,
        nameAlbum: "Cantemos a Jehová (Originales)",
        video: video[i].url
    
      }
      dataSongs.push(songData)
    });
    return dataSongs

  } catch (error) {
    console.log(error, "error obteniendo la consulta del album originales")
  }
}

export async function getVideosOriginales () {
  try {
     const res = await fetch(
      `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=osg&fileformat=MP3%2CAAC%2CM4V%2CMP4%2C3GP&alllangs=0&langwritten=S&txtCMSLang=S`
    );
     const urlVideo = await res.json();

    const videos = urlVideo.files?.S?.MP4 || [];

    const videosByTrack = new Map();

    videos.forEach(video => {
      if (!videosByTrack.has(video.track)) {
        videosByTrack.set(video.track, []);
      }
      videosByTrack.get(video.track).push(video);
    });

    const dataVideo = [];

    videosByTrack.forEach((videoList) => {
      const preferred =
        videoList.find(v => v.label === "720p") ||
        videoList.sort(
          (a, b) => parseInt(b.label) - parseInt(a.label)
        )[0];

      if (preferred) {
        dataVideo.push({
          url: preferred.file.url,
          title: preferred.title,
          track: preferred.track,
        });
      }
    });

    return dataVideo;
    
  } catch (error) {
    
  }
}


export async function getAlbumCoroOrquesta() {
  try {
    const res = fetch("https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=snv&fileformat=MP3%2CAAC&alllangs=0&langwritten=S&txtCMSLang=S");
    const data = await (await res).json()
    const songs = Object.values(data.files.S.MP3)
    const normalSongs = songs.filter(song => !/audiodescripciones/i.test(song.title))
    const dataSongs = []
    normalSongs.forEach(element => {
      const songData = {
        id: element.docid,
        title: element.title,
        file: element.file.url,
        duration: element.duration,
        nameAlbum: "Cantemos a Jehová (Coro y orquesta)"
      }
      dataSongs.push(songData)
    });
    return dataSongs

  } catch (error) {
    console.log(error, "error obteniendo la consulta del album originales")
  }
}


export async function conGozoAJehovaNiños() {
  try {

    const res = await fetch(
      "https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=pksjj&fileformat=MP3&alllangs=0&langwritten=S&txtCMSLang=S"
    );

    const data = await res.json();

    const songs = Object.values(data.files.S.MP3);

  
    const normalSongs = songs.filter(
      (song) => !/audiodescripciones/i.test(song.title)
    );

    const video = await getVideosAmigoDeJehova();

    const videoMap = new Map(
      video.map((v) => [v.track, v])
    );
    const dataSongs = normalSongs.map((element) => {
      const videoMatch = videoMap.get(element.track);

      return {
        id: element.docid,
        title: element.title,
        file: element.file.url,
        duration: element.duration,
        nameAlbum: "Hazte amigo de Jehová (Cantemos juntos)",
        video: videoMatch?.url || null,
      };
    });

    return dataSongs;

  } catch (error) {
    console.log(error, "error obteniendo la consulta del album originales");
    return [];
  }
}


export async function conGozoAJehovaNiñosOriginales() {
  try {
    const res = fetch("https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=pkon&fileformat=MP3%2CAAC&alllangs=0&langwritten=S&txtCMSLang=S");
    const data = await (await res).json()
    const songs = Object.values(data.files.S.MP3)
    const normalSongs = songs.filter(song => !/audiodescripciones/i.test(song.title))
    const video =  await getVideosAmigoJehovaOriginales()
    const dataSongs = []
    normalSongs.forEach((element,i) => {
      const songData = {
        id: element.docid,
        title: element.title,
        file: element.file.url,
        duration: element.duration,
        nameAlbum: "Hazte amigo de Jehová (canciones originales)",
        video: video[i].url
      }
      dataSongs.push(songData)
    });


    return dataSongs
  } catch (error) {
    console.log(error, "error obteniendo la consulta del album originales")
  }
}



export async function getVideosAmigoJehovaOriginales () {
  try {
     const res = await fetch(
      `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=pkon&fileformat=MP3%2CAAC%2CM4V%2CMP4%2C3GP&alllangs=0&langwritten=S&txtCMSLang=S`
    );
     const urlVideo = await res.json();

    const videos = urlVideo.files?.S?.MP4 || [];

    const videosByTrack = new Map();

    videos.forEach(video => {
      if (!videosByTrack.has(video.track)) {
        videosByTrack.set(video.track, []);
      }
      videosByTrack.get(video.track).push(video);
    });

    const dataVideo = [];

    videosByTrack.forEach((videoList) => {
      const preferred =
        videoList.find(v => v.label === "720p") ||
        videoList.sort(
          (a, b) => parseInt(b.label) - parseInt(a.label)
        )[0];

      if (preferred) {
        dataVideo.push({
          url: preferred.file.url,
          title: preferred.title,
          track: preferred.track,
        });
      }
    });

    return dataVideo;
    
  } catch (error) {
    
  }
}



export async function getObrasTeatrales() {

  const pubCode = [
    "iart", "iaze", "iaoh", "iawx", "iapv", "iame", "iajn", "iacu",
    "iaru", "iaey", "iath", "iajj", "iaeb", "iada"
  ];

  const allSongs = [];

  try {

    for (const pub of pubCode) {

      const res = await fetch(
        `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=${pub}&fileformat=MP3%2CAAC&alllangs=0&langwritten=S&txtCMSLang=S`
      );

      const data = await res.json();

      const all = data?.files?.S?.MP3;
      if (!all) continue;

      all.forEach(track => {
        allSongs.push({
          id: `${pub}-${track.track}`,
          title: track.title,
          file: track.file.url,
          duration: track.duration,
          img: `https://assetsnffrgf-a.akamaihd.net/assets/a/${pub}/univ/wpub/${pub}_univ_lg.jpg`,
          nameAlbum: "Obras teatrales en audio",
        });
      });
    }

    return allSongs;

  } catch (error) {
    console.log(error, "error obteniendo obras teatrales");
    return [];
  }
}




export async function setLirycs() {
  try {
    const res = await fetch("/lyrics.json");
    const data = await res.json();

    const lyricsById = data.reduce((acc, song) => {
      acc[song.id] = {
        id: song.id,
        numero: song.numero,
        title: song.title,
        url: song.url,
        lyrics: song.lyrics,
      };
      return acc;
    }, {});

    return lyricsById;
  } catch (error) {
    console.log(error, "No se pudieron setear la letra");
    return {};
  }
}


export async function getVideosSongs(data) {
  try {
    const dataVideo = []
    for (let i = 1; i < data; i++) {
      const res = await fetch(`https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=sjjm&fileformat=m4v%2Cmp4%2C3gp%2Cmp3&alllangs=0&track=${i}&langwritten=S&txtCMSLang=S`)
      const urlVideo = await res.json()
      const video = {
        url: urlVideo.files.S.MP4[3].file?.url,
        title: urlVideo.files.S.MP4[3].title,
        img: urlVideo.files.S.MP4[3].trackImage.url,
      }
      dataVideo.push(video)
    }
    return dataVideo
  } catch (error) {
    console.log(error)
  }
}


export async function getVideosAmigoDeJehova() {

  try {
    const res = await fetch(
      `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=pksjj&fileformat=MP3%2CAAC%2CM4V%2CMP4%2C3GP&alllangs=0&langwritten=S&txtCMSLang=S`
    );

    const urlVideo = await res.json();

    const videos = urlVideo.files?.S?.MP4 || [];

    const videosByTrack = new Map();

    videos.forEach(video => {
      if (!videosByTrack.has(video.track)) {
        videosByTrack.set(video.track, []);
      }
      videosByTrack.get(video.track).push(video);
    });

    const dataVideo = [];

    videosByTrack.forEach((videoList) => {
      const preferred =
        videoList.find(v => v.label === "720p") ||
        videoList.sort(
          (a, b) => parseInt(b.label) - parseInt(a.label)
        )[0];

      if (preferred) {
        dataVideo.push({
          url: preferred.file.url,
          title: preferred.title,
          track: preferred.track,
        });
      }
    });

    return dataVideo;

  } catch (error) {
    console.log("Error obteniendo videos:", error);
    return [];
  }
}