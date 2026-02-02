import Link from "next/link";
import styles from "./menuNav.module.css";
import { setLirycs } from "@/queries";
import { useState } from "react";
import { ModalLyrics } from "./modalLyrics/ModalLyrics";

export function MenuNav({ video, lirycs, idLyrics }) {
  const [currentLyrics, setCurrentLyrics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const showLyrics = async () => {
    setIsOpen(true);
    const lyrics = await setLirycs(idLyrics);
    // filtramos la canción correcta
    setCurrentLyrics(Object.values(lyrics).filter((lyric) => lyric.id === idLyrics));
  };

  return (
    <div className={styles.containerNav}>
      <ul className={styles.navList}>
        <li><Link href="/">Canciones</Link></li>
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
