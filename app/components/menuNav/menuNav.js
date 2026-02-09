
import Link from "next/link";
import styles from "./menuNav.module.css";
import { useState, useContext } from "react";
import { ModalLyrics } from "./modalLyrics/ModalLyrics";

export function MenuNav({ video, lirycs, currentLyrics}) {
  const [isOpen, setIsOpen] = useState(false);

  const showLyrics = async () => {
    setIsOpen(true)
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
