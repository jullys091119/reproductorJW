"use client"
import { useEffect, useRef, useState, useContext } from 'react';
import { Card } from '@heroui/react';
import styles from "./containerSongs.module.css"
import Image from 'next/image';
import { CirclePauseFill, CirclePlayFill } from '@gravity-ui/icons';



export function ContainerSongs({ data, img, resetKey }) {
  const [currentSong, setCurrentSong] = useState("")
  const [selected, setSelected] = useState(null)
  const [isPaused, setIsPaused] = useState(false);

  const audioRef = useRef();

  

  const playSong = async (file, id) => {
    setCurrentSong(file)
    setSelected(prev => (prev === id ? null : id))
    setIsPaused(false);
    audioRef.current.src = file
    await audioRef.current.play()
  }

  const togglePause = (e) => {
    e.stopPropagation();
    setIsPaused((prev) => !prev);
  };


  useEffect(() => {
    if (!audioRef.current) return;

    if (currentSong) {
      audioRef.current.play();
    }
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPaused) audioRef.current.pause();
    else audioRef.current.play();
  }, [isPaused]);

  useEffect(() => {
  setSelected(null)
  setCurrentSong("")
  setIsPaused(false)
}, [resetKey])

  const RenderAudio = ({ link }) => {
    return (
      <audio ref={audioRef} src={`${link || null}`} >
        Your browser does not support the <code>audio</code> element.
      </audio>
    )
  }

  return (

    <Card role="article" aria-labelledby="card-title" className={styles.cardContainerSongs}>
      {
        data.map((item, i) => {
          const titleCut = item.title.length > 25
            ? `${item.title.slice(0, 30)}...`
            : item.title;
          const minutes = Math.floor(item.duration / 60)
          const seconds = Math.round(item.duration % 60)
          const colored = selected === item.id
          return (
            <Card.Header key={`${item.title}-${item.id}`}>
              <div className={styles.cardSongContainer} onClick={() => playSong(item.file, item.id)} style={{
                backgroundColor: colored
                  ? "#9B3E82"
                  : "#292424"
              }}>
                <div className={styles.containerImage}>
                  <Image
                    src={img}
                    className={styles.avatarSong}
                    alt='img'
                  />
                  <Card.Title id="card-title" className={styles.colorTitle}>{titleCut}</Card.Title>
                </div>
                {colored ? (
                  isPaused ? (
                    <CirclePauseFill onClick={(e) => togglePause(e)} />

                  ) : (
                    <CirclePlayFill onClick={(e) => togglePause(e)} />
                  )
                ) : <p>{minutes} : {seconds}</p>}
              </div>
            </Card.Header>

          )
        })
      }
      <RenderAudio link={currentSong} />
    </Card>
  )
}

