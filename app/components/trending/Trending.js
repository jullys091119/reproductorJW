"use client"
import { useEffect, useContext } from "react"
import { AppContext } from "@/app/AppContext"
import CardTrending from "./cardTrending/CardTrending"
import CardTrendingChild from "./cardTrendingChild/cardTrendingChild"
import VideoSongs from "../Video/Video"


export function Trending() {
  const { openVideo,nextSong } = useContext(AppContext)

  return (
    <div>
      {
        openVideo ? (
          <VideoSongs nextSong={nextSong} />
        ) : (
          <>
            <CardTrending />
            <CardTrendingChild />
          </>
        )
      }
    </div>
  )
}