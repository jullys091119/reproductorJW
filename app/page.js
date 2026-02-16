"use client"
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./AppContext";
import { getAlbumCantadas, getAlbumCoroOrquesta, getAlbumOriginales, getSongs, conGozoAJehovaNiños, conGozoAJehovaNiñosOriginales, getObrasTeatrales } from "@/queries";
import imgCantadas from "./portadas/cantadas.jpg";
import coroOrquesta from "./portadas/coro.jpg";
import originales from "./portadas/originales.jpg"
import orquesta from "./portadas/coroOrquesta.jpg"
import { Header } from "./components/Header/Header";
import { Trending } from "./components/trending/Trending";
import { TrendingSkeletons } from "./components/trending/trendingSkeleton/trendingSkeletons";
import { ContainerSongs } from "./components/containerSongs/containerSongs";


export default function Home() {
  const { nameAlbum, setImageAlbum, imageAlbum } = useContext(AppContext)
  const [isMounted, setIsMounted] = useState(true);
  const [dataSongs, setDataSongs] = useState([])

  useEffect(() => {
    setIsMounted(false)
    const loadAlbum = async () => {
      if (nameAlbum === "reuniones") {
        const data = await getSongs();
        setDataSongs(data)
        setImageAlbum("https://cms-imgp.jw-cdn.org/img/p/sjjm/univ/pt/sjjm_univ_lg.jpg")
      } else if (nameAlbum === "cantadas") {
        const data = await getAlbumCantadas();
        setDataSongs(data)
        setImageAlbum("https://cms-imgp.jw-cdn.org/img/p/sjjc/univ/pt/sjjc_univ_lg.jpg")
      } else if (nameAlbum === "originales") {
        const data = await getAlbumOriginales();
        setDataSongs(data)
        setImageAlbum("https://cms-imgp.jw-cdn.org/img/p/osg/univ/pt/osg_univ_lg.jpg")
      } else if (nameAlbum === "orquesta") {
        const data = await getAlbumCoroOrquesta();
        setDataSongs(data)
        setImageAlbum("https://cms-imgp.jw-cdn.org/img/p/snv/univ/pt/snv_univ_lg.jpg")
      } else if (nameAlbum === "Amigo de Jehová") {
        const data = await conGozoAJehovaNiños();
        setDataSongs(data)
        setImageAlbum(imageAlbum)
      } else if (nameAlbum === "Amigo de Jehová O.") {
        const data = await conGozoAJehovaNiñosOriginales();
        setDataSongs(data)
        setImageAlbum(imageAlbum)
      }else if (nameAlbum === "obrasTeatrales") {
        const data = await getObrasTeatrales();
        setDataSongs(data)
        setImageAlbum(data)
      }
    }
    loadAlbum()

  }, [nameAlbum])

  return (
    <div className="container">
      <Header />
      {!isMounted ? <Trending /> : <TrendingSkeletons />}
      <ContainerSongs data={dataSongs} img={imageAlbum} resetKey={nameAlbum} />
    </div>
  );
}
