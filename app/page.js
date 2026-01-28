"use client"
import React,{useEffect, useState} from "react";
import { getSongs } from "@/queries";
import { Header } from "./components/Header/Header";
import { Trending } from "./components/trending/Trending";
import { TrendingSkeletons } from "./components/trending/trendingSkeleton/trendingSkeletons";
import { MenuNav } from "./components/menuNav/menuNav";
import { ContainerSongs } from "./components/containerSongs/containerSongs";

export default function Home() {
  const [isMounted, setIsMounted] = useState(true);
  const [dataSongs, setDataSongs] = useState([])

  useEffect(()=> {
    const loadSongs = async () => {
      const dataSongs  = await getSongs()
        setDataSongs(dataSongs)
       /*  console.log(dataSongs, "data songs") */
        setIsMounted(false)
    }
    loadSongs()
  },[])
   
  return (
    <div className="container">
      <Header />
      {!isMounted ?<Trending/>:<TrendingSkeletons/>}
      <MenuNav/>
      <ContainerSongs data={dataSongs}/>
    </div>
  );
}
