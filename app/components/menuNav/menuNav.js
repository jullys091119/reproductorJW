
import styles from "./menuNav.module.css";
import { useState, useContext } from "react";
import { AppContext } from "@/app/AppContext";
import { ModalLyrics } from "./modalLyrics/ModalLyrics";
import { Button } from "@heroui/react";


export function MenuNav({ video, lirycs, currentLyrics }) {
  const { setNameAlbum } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false);

  const showLyrics = async () => {
    setIsOpen(true)
  };

  const showTheatrical = () => {
    setNameAlbum("obrasTeatrales")
  }

  return (
    <div className={styles.containerNav}>
      <ul className={styles.navList}>
        <Button className={styles.buttons}>
          <li onClick={showTheatrical}>Obras Teatrales</li>
        </Button>
        <li onClick={showLyrics} style={{ cursor: "pointer" }}>{lirycs}</li>
        <li>{video}</li>
      </ul>

      <ModalLyrics
        currentLyrics={currentLyrics}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      />
    </div>
  );
}
