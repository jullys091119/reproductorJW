"use client";

import { Rocket } from "@gravity-ui/icons";
import { Modal } from "@heroui/react";
import styles from "./ModalFullPlayer.module.css";
import Image from "next/image";
import {
  CirclePauseFill,
  CirclePlayFill,
  CaretRight,
  CaretLeft,
} from "@gravity-ui/icons";
import { useContext } from "react";
import { AppContext } from "@/app/AppContext";

export function ModalFullPlayer({
  open,
  close,
  dataSong,
  prevSong,
  nextSong,
  togglePlayPause,
  ProgressBar,
  currentTime,
  duration,
  nameAlbum,
  imageAlbum,
}) {
  const { isPaused } = useContext(AppContext);

  const handleToggle = () => {
    togglePlayPause();
  };

  const formatTime = (time = 0) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const resolveImage = () => {
    if (typeof dataSong?.img === "string") return dataSong.img;
    if (dataSong?.img?.src) return dataSong.img.src;
    if (typeof imageAlbum === "string") return imageAlbum;
    return null;
  };

  const album = resolveImage();

  return (
    <div className="flex flex-wrap gap-4">
      <Modal>
        <Modal.Backdrop isOpen={open}>
          <Modal.Container size="full">
            <Modal.Dialog className={styles.container}>
              <div className={styles.containerAlbumImage}>
                <div className={styles.cuadrado}>
                  <div className={styles.circle}>
                    {album && (
                      <Image
                        src={album}
                        width={500}
                        height={500}
                        className={styles.circleImage}
                        alt="Album cover"
                      >
                      </Image>
                    )}
                    <div className={styles.circleBlack}>
                       <div className={styles.circleWhite}></div>
                    </div>
                  </div>
                </div>
              </div>

              <Modal.CloseTrigger onClick={close} />

              <Modal.Header>
                <Modal.Icon className="bg-default text-foreground">
                  <Rocket className="size-5" />
                </Modal.Icon>
              </Modal.Header>

              <Modal.Body>
                <header>
                  <p className={styles.title}>{dataSong?.name}</p>
                  <p>{nameAlbum}</p>
                </header>

                <main>
                  <div className={styles.containerProgress}>
                    <ProgressBar />
                    <div className={styles.containerTimer}>
                      <p>{formatTime(currentTime)}</p>
                      <p>{formatTime(duration)}</p>
                    </div>
                  </div>

                  <div className={styles.fullcontrols}>
                    <CaretLeft
                      width={40}
                      height={40}
                      color="rgb(155, 62, 130)"
                      onClick={prevSong}
                    />

                    {isPaused ? (
                      <CirclePlayFill
                        width={80}
                        height={80}
                        color="rgb(155, 62, 130)"
                        onClick={handleToggle}
                      />
                    ) : (
                      <CirclePauseFill
                        width={80}
                        height={80}
                        color="rgb(155, 62, 130)"
                        onClick={handleToggle}
                      />
                    )}

                    <CaretRight
                      width={40}
                      height={40}
                      color="rgb(155, 62, 130)"
                      onClick={nextSong}
                    />
                  </div>
                </main>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}