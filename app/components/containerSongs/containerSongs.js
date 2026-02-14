"use client";
import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { AppContext } from "@/app/AppContext";
import { Card } from "@heroui/react";
import styles from "./containerSongs.module.css";
import Image from "next/image";
import { CirclePauseFill, CirclePlayFill, FontCursor, Video, CircleChevronRightFill, CircleChevronLeftFill } from "@gravity-ui/icons";
import { MenuNav } from "../menuNav/menuNav";
import { setLirycs } from "@/queries";

export function ContainerSongs({ data = [], img, resetKey }) {
  const { idLyrics, setIdLirycs } = useContext(AppContext)
  const [selected, setSelected] = useState(null);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [currentLyrics, setCurrentLyrics] = useState([])
  const [infoSong, setInfoSong] = useState({})



  const audioRef = useRef(null);

  const formatTime = (duration = 0) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const loadAndPlay = useCallback(async (file, startTime = 0) => {
    const audio = audioRef.current;
    if (!audio || !file) return;

    audio.src = file;
    audio.load();
    audio.currentTime = startTime;

    try {
      await audio.play();
      setIsPaused(false);
    } catch {
      setIsPaused(true);
    }
  }, []);


  const setLyrics = async (idLyrics) => {
    const lyrics = await setLirycs(idLyrics);
    setCurrentLyrics(Object.values(lyrics).filter((lyric) => lyric.id === idLyrics));
  }

  const playSongByIndex = useCallback(
    async (i) => {
      if (!data?.length) return;
      const song = data[i];
      setLyrics(song.idLyrics)
      if (!song?.file) return;

      setIndex(i);
      setSelected(song.id);
      await loadAndPlay(song.file);
    },
    [data, loadAndPlay]
  );

  const nextSong = useCallback(async () => {
    if (!data?.length) return;
    const nextIndex = (index + 1) % data.length;
    await playSongByIndex(nextIndex);
  }, [data, index, playSongByIndex]);

  const prevSong = useCallback(async () => {
    if (!data?.length) return;
    const prevIndex = (index - 1 + data.length) % data.length;
    await playSongByIndex(prevIndex);
  }, [data, index, playSongByIndex]);

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPaused(false);
      } catch {
        setIsPaused(true);
      }
    } else {
      audio.pause();
      setIsPaused(true);
    }
  }, []);

  const handleSongClick = useCallback(
    async (item, i) => {
      setIdLirycs(item.idLyrics)
      const song = item.title.length > 25 ? `${item.title.slice(0, 25)}...` : item.title
      setInfoSong({
        name: song,
        duration: item.duration
      })

      const isSameSong = selected === item.id;

      if (!isSameSong) {
        await playSongByIndex(i);
        return;
      }

      await togglePlayPause();
    },
    [selected, playSongByIndex, togglePlayPause]
  );


  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", async () => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        await audio.play();
        setIsPaused(false);
      } catch {
        setIsPaused(true);
      }
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      setIsPaused(true);
    });

    navigator.mediaSession.setActionHandler("previoustrack", prevSong);
    navigator.mediaSession.setActionHandler("nexttrack", nextSong);

    return () => {
      // limpieza (algunos navegadores no lo requieren, pero es buena práctica)
      try {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
      } catch { }
    };

  }, [nextSong, prevSong]);


  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!data?.length) return;

    const currentSong = data[index];


    if (!currentSong) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title ?? "Canción",
      artist: "Cantemos a nuestro Dios Jehová",
      artwork: img
        ? [{ src: img, sizes: "512x512", type: "image/png" }]
        : [],
    });
  }, [index, data, img, idLyrics]);

  useEffect(() => {
    setSelected(null);
    setIndex(0);
    setIsPaused(true);

    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = "";
  }, [resetKey]);


  useEffect(() => {

    console.log(infoSong, "<<")
  }, [infoSong])


  return (
    <div>
      <MenuNav
        video={<Video width={30} height={30} />}
        lirycs={<FontCursor height={30} width={30} />}
        currentLyrics={currentLyrics}
      />

      <Card
        role="article"
        aria-label="Lista de canciones"
        className={styles.cardContainerSongs}
        style={{ display: data.length > 0 ? "flex" : "none" }}

      >

        {data.map((item, i) => {
          const title =
            item.title?.length > 30 ? `${item.title.slice(0, 30)}...` : item.title;

          const isSelected = selected === item.id;
          const timeText = formatTime(item.duration);

          return (
            <Card.Header key={`${item.id}-${item.title}`}>

              <div
                className={styles.cardSongContainer}
                onClick={() => handleSongClick(item, i)}
                style={{ backgroundColor: isSelected ? "#9B3E82" : "#292424" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSongClick(item, i);
                  }
                }}
                aria-label={`Reproducir ${item.title}`}
              >
                <div className={styles.containerImage}>
                  <Image
                    src={img}
                    width={40}
                    height={40}
                    className={styles.avatarSong}
                    alt="img"
                  />

                  <Card.Title id={`song-${item.id}`} className={styles.colorTitle}>
                    {title}
                  </Card.Title>

                </div>

                {isSelected ? (
                  isPaused ? (
                    <CirclePlayFill />
                  ) : (
                    <CirclePauseFill />
                  )
                ) : (
                  <p>{timeText}</p>
                )}
              </div>
            </Card.Header>

          );
        })}
        <audio
          ref={audioRef}
          onEnded={nextSong}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
        />
      </Card>

      {infoSong && <div className={styles.progressbarContainer}>
        <div className={styles.containerImageSong}>
          <Image
            src={img || null}
            width={40}
            height={40}
            className={styles.avatarSong}
            alt="img"
          />

          {infoSong.name}

        </div>
        <div className={styles.controls}>
          <CircleChevronLeftFill width={25} height={25} />
          <CirclePlayFill width={25} height={25} />
          <CircleChevronRightFill width={25} height={25} />
        </div>

      </div>}
    </div>
  );
}
