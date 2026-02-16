import { useContext } from "react";
import { AppContext } from "@/app/AppContext";
import { Card } from "@heroui/react";
import styles from "./../cardTrending/CardTrending.module.css";
import Image from "next/image";

export default function CardTrendingChild() {
  const { setNameAlbum,setImageAlbum } = useContext(AppContext)
  const album = [
    {
      id: 1,
      name: "Amigo de Jehová",
      img: "https://cms-imgp.jw-cdn.org/img/p/pksjj/univ/pt/pksjj_univ_lg.jpg",
    },
    {
      id: 2,
      name: "Amigo de Jehová O.",
      img: "https://cms-imgp.jw-cdn.org/img/p/pkon/univ/pt/pkon_univ_lg.jpg",
    }
  ];
  
  const selectAlbum = (select, img) => {
    setNameAlbum(select)
    setImageAlbum(img)
  }

  return (
    <div>
      <p className="pl-5">Niños</p>

      <Card className={`border-none ${styles.card}`} variant="transparent">
        {album.map((item) => (
          <div
            key={item.id}
            onClick={() => selectAlbum(item.name, item.img)}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <div className="relative z-0 h-[100px] w-[100px] shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
              <Image
                alt={item.name}
                className="pointer-events-none object-cover select-none"
                loading="eager"
                src={item.img.replace("http://", "https://")}
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
    </div>
  );
}
