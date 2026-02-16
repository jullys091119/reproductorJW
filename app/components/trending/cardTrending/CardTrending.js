
import { useContext } from "react";
import { AppContext } from "@/app/AppContext";
import { Card } from "@heroui/react";
import styles from "./CardTrending.module.css"
import Image from "next/image";


export default function CardTrending() {
  const { setNameAlbum } = useContext(AppContext)
  const selectAlbum = (select) => {
    setNameAlbum(select)
  }

  const album = [
    { id: 1, name: "reuniones", img: "https://cms-imgp.jw-cdn.org/img/p/sjjm/univ/pt/sjjm_univ_lg.jpg" },
    { id: 2, name: "cantadas", img: "https://cms-imgp.jw-cdn.org/img/p/sjjc/univ/pt/sjjc_univ_lg.jpg" },
    { id: 3, name: "originales", img: "https://cms-imgp.jw-cdn.org/img/p/osg/univ/pt/osg_univ_lg.jpg" },
    { id: 4, name: "orquesta", img: "https://cms-imgp.jw-cdn.org/img/p/snv/univ/pt/snv_univ_lg.jpg" },
  ]

  return (
    <Card className={["border-none", styles.card]} variant="transparent">
      {album.map((item) => (
        <div
          key={item?.id}
          onClick={() => selectAlbum(item.name)}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <div className="relative z-0 h-[100px] w-[100px] shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
            <Image
              alt={item.name}
              className="pointer-events-none object-cover select-none"
              loading="eager"
              src={item.img?.replace("http://", "https://")}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className={styles.containerAlbumName}>
            <p className={styles.albumName}>{item.name}</p>
          </div>
        </div>
      ))}
    </Card>
  )
}
