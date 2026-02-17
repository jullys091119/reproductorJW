"use client";

import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { AppContext } from "@/app/AppContext";
import { Card } from "@heroui/react";
import styles from "./containerSongs.module.css";
import Image from "next/image";
import {
  CirclePauseFill,
  CirclePlayFill,
  FontCursor,
  Video,
  CircleChevronRightFill,
  CircleChevronLeftFill
} from "@gravity-ui/icons";
import { MenuNav } from "../menuNav/menuNav";
import { setLirycs } from "@/queries";
import { ModalFullPlayer } from "../modalFullPlayer/ModalFullPlayer";

export function ContainerSongs({ data = [], img, resetKey }) {
  const audioRef = useRef(null);
  const indexRef = useRef(0);

  const { setIdLirycs } = useContext(AppContext);

  const [selected, setSelected] = useState(null);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [currentLyrics, setCurrentLyrics] = useState([]);
  const [infoSong, setInfoSong] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isOpenFullPlayer, setIsOpenFullPlayer] = useState(false)

  // Mantener índice sincronizado
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const formatTime = (duration = 0) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const loadSong = useCallback((file, startTime = 0) => {
    const audio = audioRef.current;
    if (!audio || !file) return;

    audio.src = file;
    audio.load();
    audio.currentTime = startTime;

    setProgress(0);
    setIsPaused(true);
  }, []);

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
    setCurrentLyrics(Object.values(lyrics).filter((l) => l.id === idLyrics));
  };

  const openFullPlayer = (isOpenFullPlayer) => {
    console.log(isOpenFullPlayer)
    setIsOpenFullPlayer(isOpenFullPlayer)
  }

  const playSongByIndex = useCallback(async (i, autoPlay = true) => {
    if (!data?.length) return;

    const song = data[i];
    if (!song?.file) return;

    setIndex(i);
    setSelected(song.id);
    setLyrics(song.idLyrics);

    const title = song.title.length > 25 ? `${song.title.slice(0, 25)}...` : song.title;
    setInfoSong(title);

    if (autoPlay) {
      await loadAndPlay(song.file);
    } else {
      loadSong(song.file);
    }
  }, [data, loadAndPlay, loadSong]);

  const nextSong = useCallback(() => {
    if (!data?.length) return;
    const nextIndex = (indexRef.current + 1) % data.length;
    playSongByIndex(nextIndex, true);
  }, [data, playSongByIndex]);

  const prevSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !data?.length) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const prevIndex = (indexRef.current - 1 + data.length) % data.length;
    playSongByIndex(prevIndex, true);
  }, [data, playSongByIndex]);

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

  const handleSongClick = useCallback(async (item, i) => {
    setIdLirycs(item.idLyrics);
    const isSameSong = selected === item.id;

    if (!isSameSong) {
      await playSongByIndex(i, true);
      return;
    }

    await togglePlayPause();
  }, [selected, playSongByIndex, togglePlayPause, setIdLirycs]);





  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setProgress(0);

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onEnded = () => {
      const nextIndex = (indexRef.current + 1) % data.length;
      playSongByIndex(nextIndex, true);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [data.length, playSongByIndex]);

  // MediaSession
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
    navigator.mediaSession.setActionHandler("previoustrack", prevSong);
    navigator.mediaSession.setActionHandler("nexttrack", nextSong);

    return () => {
      try {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
      } catch { }
    };
  }, [prevSong, nextSong]);

  // Metadata lockscreen
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!data?.length) return;

    const currentSong = data[index];
    if (!currentSong) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title ?? "Canción",
      artist: "Cantemos a nuestro Dios Jehová",
      artwork: img ? [{ src: img, sizes: "512x512", type: "image/png" }] : []
    });
  }, [index, data, img]);

  // Reset
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = "";

    setSelected(null);
    setIndex(0);
    setIsPaused(true);
    setProgress(0);
  }, [resetKey]);

  useEffect(() => {
    console.log(isOpenFullPlayer, "isOpen")
  }, [isOpenFullPlayer])

  return (
    <div>
      <MenuNav
        video={<Video width={20} height={20} />}
        lirycs={<FontCursor height={20} width={20} />}
        currentLyrics={currentLyrics}
      />

      <Card
        role="article"
        aria-label="Lista de canciones"
        className={styles.cardContainerSongs}
        style={{ display: data.length > 0 ? "flex" : "none" }}
      >
        {data.map((item, i) => {
          const title = item.title?.length > 30 ? `${item.title.slice(0, 30)}...` : item.title;
          const isSelected = selected === item.id;
          const timeText = formatTime(item.duration);
          const showImg = img[i]?.img || img;

          return (
            <Card.Header key={`${item.id}-${item.title}`}>

              <div
                className={styles.cardSongContainer}
                onClick={() => handleSongClick(item, i)}
                style={{ backgroundColor: isSelected ? "#9B3E82" : "#292424" }}
                role="button"
                tabIndex={0}
              >
                <div className={styles.containerImage}>
                  <Image src={showImg} width={40} height={40} className={styles.avatarSong} alt="img" />
                  <Card.Title className={styles.colorTitle}>{title}</Card.Title>
                </div>

                {isSelected ? (isPaused ? <CirclePlayFill /> : <CirclePauseFill />) : <p>{timeText}</p>}
              </div>
            </Card.Header>
          );
        })}


        <audio ref={audioRef} preload="metadata" onPlay={() => setIsPaused(false)} onPause={() => setIsPaused(true)} />
      </Card>

      {infoSong && (
        <div style={{maxWidth: "100%", position: "relative"}}>

          <div className={styles.progressbarContainer} onClick={() => setIsOpenFullPlayer(true)}>
            {/* Barra de progreso clickeable */}
            <div
              className={styles.progressBar}
              onClick={(e) => {
                const audio = audioRef.current;
                if (!audio || !audio.duration) return;

                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = clickX / rect.width;

                audio.currentTime = newProgress * audio.duration;
                setProgress(newProgress * 100);
              }}
            >
              <div className={styles.progress} style={{ width: `${progress}%` }} />
            </div>

            <div className={styles.containerImageSong}>
              <Image src={img} width={40} height={40} className={styles.avatarSong} alt="img" />
              {infoSong}
            </div>

            <div className={styles.controls}>
              <CircleChevronLeftFill width={25} height={25} onClick={prevSong} />
              {isPaused ? (
                <CirclePlayFill width={25} height={25} onClick={togglePlayPause} />
              ) : (
                <CirclePauseFill width={25} height={25} onClick={togglePlayPause} />
              )}
              <CircleChevronRightFill width={25} height={25} onClick={nextSong} />
            </div>
        </div>
        </div>
      )}
      {isOpenFullPlayer && (
        <ModalFullPlayer
          open={isOpenFullPlayer}
          close={() => setIsOpenFullPlayer(false)}
          dataSong = {{img:img, name:infoSong}}
        />
      )}
    </div>
  );
}
