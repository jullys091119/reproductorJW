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
import { ModalLyrics } from "../menuNav/modalLyrics/ModalLyrics";

export function ContainerSongs({ data = [], img, resetKey }) {
  const audioRef = useRef(null);
  const indexRef = useRef(0);

  const { setIdLirycs, isPaused, setIsPaused,setOpenVideo, setVideo } = useContext(AppContext);

  const [selected, setSelected] = useState(null);
  const [index, setIndex] = useState(0);
  const [currentLyrics, setCurrentLyrics] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [infoSong, setInfoSong] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isOpenFullPlayer, setIsOpenFullPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [nameAlbum, setNameAlbum] = useState("")
  const [imageAlbum, setImageAlbum] = useState("")
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const formatTime = (time = 0) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const loadAndPlay = useCallback(async (file) => {
    const audio = audioRef.current;
    if (!audio || !file) return;

    audio.src = file;
    audio.load();

    try {
      await audio.play();
      setIsPaused(false);
    } catch {
      setIsPaused(true);
    }
  }, [setIsPaused]);

  const setLyrics = async (idLyrics) => {
    const lyrics = await setLirycs(idLyrics);
    setCurrentLyrics(Object.values(lyrics).filter(l => l.id === idLyrics));
  };

  const playSongByIndex = useCallback(async (i) => {
    if (!data?.length) return;

    const song = data[i];
    if (!song?.file) return;

    setIndex(i);
    setSelected(song.id);
    setLyrics(song.idLyrics);
    setNameAlbum(song.nameAlbum)
    const showImg = img[i]?.img || img;
    setImageAlbum(showImg)

    const title =
      song.title.length > 25
        ? `${song.title.slice(0, 25)}...`
        : song.title;

    setInfoSong(title);

    await loadAndPlay(song.file);
  }, [data, loadAndPlay]);

  const nextSong = useCallback(() => {
    if (!data?.length) return;
    const nextIndex = (indexRef.current + 1) % data.length;
    playSongByIndex(nextIndex);
  }, [data, playSongByIndex]);

  const prevSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !data?.length) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const prevIndex =
      (indexRef.current - 1 + data.length) % data.length;

    playSongByIndex(prevIndex);
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
  }, [setIsPaused]);

  const handleSongClick = useCallback(
    async (item, i) => {
      setIdLirycs(item.idLyrics);
      const isSameSong = selected === item.id;

      if (!isSameSong) {
        await playSongByIndex(i);
        return;
      }

      await togglePlayPause();
    },
    [selected, playSongByIndex, togglePlayPause, setIdLirycs]
  );

  const ProgressBar = () => (
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
      <div
        className={styles.progress}
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  const ControlsReproductor = () => {

    return (

      <div className={styles.progressbarContainer}>
        <ProgressBar />

        <div className={styles.containerImageSong}>
          <Image
            src={imageAlbum}
            width={40}
            height={40}
            className={styles.avatarSong}
            alt="img"
          />
          {infoSong}
        </div>

        <div className={styles.controls}>
          <CircleChevronLeftFill
            width={25}
            height={25}
            onClick={(e) => {
              e.stopPropagation();
              prevSong();
            }}
          />

          {isPaused ? (
            <CirclePlayFill
              width={25}
              height={25}
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
            />
          ) : (
            <CirclePauseFill
              width={25}
              height={25}
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
            />
          )}

          <CircleChevronRightFill
            width={25}
            height={25}
            onClick={(e) => {
              e.stopPropagation();
              nextSong();
            }}
          />
        </div>
      </div>
    )
  };

  const showLyrics = async (e) => {
    e.stopPropagation()
    setIsOpen(true)
  };

  const handleVideo  = (e, video) => {
    e.stopPropagation()
    setOpenVideo(true)
    setVideo(video)
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
      setProgress(0);
    };

    const onTimeUpdate = () => {
      if (!audio.duration) return;

      const current = audio.currentTime;
      const total = audio.duration;

      setCurrentTime(current);
      setProgress((current / total) * 100);
    };

    const onEnded = () => {
      const nextIndex =
        (indexRef.current + 1) % data.length;
      playSongByIndex(nextIndex);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = "";

    setSelected(null);
    setIndex(0);
    setIsPaused(true);
    setProgress(0);
  }, [resetKey, setIsPaused]);

  return (
    <div>
      <MenuNav
        currentLyrics={currentLyrics}
      />

      <ModalLyrics
        currentLyrics={currentLyrics}
        isOpen={isOpen}
        close={() => setIsOpen(false)}

      />

      <Card
        className={styles.cardContainerSongs}
        style={{ display: data.length > 0 ? "flex" : "none" }}
      >
        {data.map((item, i) => {
          const title =
            item.title?.length > 25
              ? `${item.title.slice(0, 25)}...`
              : item.title;

          const isSelected = selected === item.id;
          const timeText = formatTime(item.duration);
          const showImg = img[i]?.img || img;
         
          return (
            <Card.Header key={`${item.id}-${item.title}`}>
              <div
                className={styles.cardSongContainer}
                onClick={() => handleSongClick(item, i)}
                style={{
                  backgroundColor: isSelected
                    ? "#9B3E82"
                    : "#292424",
                }}
              >
                <div className={styles.containerImage}>
                  <Image
                    src={showImg}
                    width={40}
                    height={40}
                    className={styles.avatarSong}
                    alt="img"
                  />
                  <Card.Title className={styles.colorTitle}>
                    <p>{title}</p>
                    {
                      isSelected &&
                      <div className={styles.containerIcons}>
                        <Video width={20} height={20} color="white" onClick={(e)=> handleVideo(e, item.video)} />
                        <FontCursor height={20} width={20} color="white" onClick={(e) => showLyrics(e)} />
                      </div>
                    }
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
          preload="metadata"
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
        />
      </Card>

      {infoSong && (
        <div
          style={{ maxWidth: "100%" }}
          onClick={() => setIsOpenFullPlayer(true)}
        >
          <ControlsReproductor img={img} />
        </div>
      )}

      {isOpenFullPlayer && (
        <ModalFullPlayer
          open={isOpenFullPlayer}
          close={() => setIsOpenFullPlayer(false)}
          dataSong={{ img, name: infoSong }}
          prevSong={prevSong}
          nextSong={nextSong}
          togglePlayPause={togglePlayPause}
          ProgressBar={ProgressBar}
          currentTime={currentTime}
          duration={duration}
          nameAlbum={nameAlbum}
          imageAlbum={imageAlbum}
        />
      )}
    </div>
  );
}