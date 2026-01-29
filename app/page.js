"use client"
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./AppContext";
import { getAlbumCantadas, getSongs } from "@/queries";
import imgCantadas from "./portadas/cantadas.jpg";
import coroOrquesta from "./portadas/coro.jpg";
import { Header } from "./components/Header/Header";
import { Trending } from "./components/trending/Trending";
import { TrendingSkeletons } from "./components/trending/trendingSkeleton/trendingSkeletons";
import { MenuNav } from "./components/menuNav/menuNav";
import { ContainerSongs } from "./components/containerSongs/containerSongs";

export default function Home() {
  const { nameAlbum, setImageAlbum, imageAlbum } = useContext(AppContext)
  const [isMounted, setIsMounted] = useState(true);
  const [dataSongs, setDataSongs] = useState([])
  const [resetColor, setResetColor] = useState(true)


  useEffect(() => {
    setIsMounted(false)
    const loadAlbum = async () => {
      if (nameAlbum === "reuniones") {
        const data = await getSongs();
        setDataSongs(data)
        setImageAlbum(imgCantadas)
      } else if (nameAlbum === "cantadas") {
        const data = await getAlbumCantadas();
        setDataSongs(data)
        setImageAlbum(coroOrquesta)
      }
    }
    loadAlbum()

    if(nameAlbum) {
      setResetColor(false)
    }
  }, [nameAlbum])

  return (
    <div className="container">
      <Header />
      {!isMounted ? <Trending /> : <TrendingSkeletons />}
      <MenuNav />
      <ContainerSongs data={dataSongs} img={imageAlbum} setColor={setResetColor}  resetKey={nameAlbum} />
    </div>
  );
}
