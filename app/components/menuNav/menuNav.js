
import styles from "./menuNav.module.css";
import { useState, useContext } from "react";
import { AppContext } from "@/app/AppContext";
import { ModalLyrics } from "./modalLyrics/ModalLyrics";
import { Button } from "@heroui/react";


export function MenuNav({lirycs, currentLyrics }) {
  const { setNameAlbum } = useContext(AppContext)


 

  const showTheatrical = () => {
    setNameAlbum("obrasTeatrales")
  }

  return (
    <div className={styles.containerNav}>
      <ul className={styles.navList}>
        <Button className={styles.buttons}>
          <li onClick={showTheatrical}>Obras Teatrales</li>
        </Button>
        
      
      </ul>

    
    </div>
  );
}
