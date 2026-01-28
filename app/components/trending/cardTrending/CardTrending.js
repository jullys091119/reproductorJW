
import { Card } from "@heroui/react";
import styles from "./CardTrending.module.css"
import imgCantadas from "../../../portadas/cantadas.jpg";
import imgCantemosGozo from "../../../portadas/cantemosConGozo.jpg"
import coroOrquesta from "../../../portadas/coro.jpg";
import originales from "../../../portadas/originales.jpg"
import Image from "next/image";

export default function CardTrending() {
  return (
    <Card className={["border-none", styles.card]} variant="transparent" >
      <div>
        <div className="relative z-0 h-[140px] w-[120px] shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
          <Image
            alt="imgCantadas"
            className="pointer-events-none  object-cover select-none"
            loading="eager"
            src={imgCantadas.src}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

          />
        </div>
        <div className={styles.containerAlbumName}>
          <p className={styles.albumName}>Cantemos con gozo (reuniones)</p>
        </div>
      </div>
      <div>
        <div className="relative h-[140px] w-[120px] shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
          <Image
            alt="imgCantadas"
            className="pointer-events-none  object-cover select-none"
            loading="eager"
            src={imgCantemosGozo.src}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className={styles.containerAlbumName}>
          <p className={styles.albumName}>Cantemos con gozo a Jehová</p>
        </div>
      </div>
      <div>
        <div className="relative h-[140px] w-[120px] shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
          <Image
            alt="imgCantadas"
            className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
            loading="eager"
            src={coroOrquesta.src}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className={styles.containerAlbumName}>
          <p className={styles.albumName}>Cantemos con gozo(cantadas)</p>
        </div>
      </div>
       <div>
        <div className="relative h-[140px] w-[120px] shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
          <Image
            alt="imgCantadas"
            className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
            loading="eager"
            src={originales.src}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className={styles.containerAlbumName}>
          <p className={styles.albumName}>Canciones Originales</p>
        </div>
      </div>
    </Card>
  );
}
