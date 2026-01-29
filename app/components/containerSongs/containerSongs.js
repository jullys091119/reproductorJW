"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@heroui/react";
import styles from "./containerSongs.module.css";
import Image from "next/image";
import { CirclePauseFill, CirclePlayFill } from "@gravity-ui/icons";

export function ContainerSongs({ data, img, resetKey }) {
  const [selected, setSelected] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [index, setIndex] = useState(0);

  const audioRef = useRef(null);

  const loadAndPlay = async (file) => {
    if (!audioRef.current) return;
    audioRef.current.src = file;
    audioRef.current.load();
    try {
      await audioRef.current.play();
      setIsPaused(false);
    } catch {}
  };

  const nextSong = async () => {
    if (!data?.length) return;
    const nextIndex = (index + 1) % data.length;
    setIndex(nextIndex);
    const next = data[nextIndex];
    if (!next?.file) return;
    setSelected(next.id);
    await loadAndPlay(next.file);
  };

  const handleSongClick = async (item, i) => {
    if (!audioRef.current) return;

    const isSameSong = selected === item.id;

    if (!isSameSong) {
      setSelected(item.id);
      setIndex(i);
      await loadAndPlay(item.file);
      return;
    }

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPaused(false);
      } catch {}
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    setSelected(null);
    setIsPaused(true);
    setIndex(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [resetKey]);

  return (
    <Card role="article" aria-labelledby="card-title" className={styles.cardContainerSongs}>
      {data.map((item, i) => {
        const titleCut = item.title.length > 25 ? `${item.title.slice(0, 30)}...` : item.title;
        const minutes = Math.floor(item.duration / 60);
        const seconds = Math.round(item.duration % 60);
        const colored = selected === item.id;

        return (
          <Card.Header key={`${item.title}-${item.id}`}>
            <div
              className={styles.cardSongContainer}
              onClick={() => handleSongClick(item, i)}
              style={{
                backgroundColor: colored ? "#9B3E82" : "#292424",
              }}
            >
              <div className={styles.containerImage}>
                <Image src={img} className={styles.avatarSong} alt="img" />
                <Card.Title id="card-title" className={styles.colorTitle}>
                  {titleCut}
                </Card.Title>
              </div>

              {colored ? (
                isPaused ? (
                  <CirclePlayFill />
                ) : (
                  <CirclePauseFill />
                )
              ) : (
                <p>
                  {minutes} : {seconds}</p>
              )}
            </div>
          </Card.Header>
        );
      })}

      <audio ref={audioRef} onEnded={nextSong} />
    </Card>
  );
}
