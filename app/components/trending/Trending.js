"use client"
import { useEffect, useContext } from "react"
import { AppContext } from "@/app/AppContext"
import CardTrending from "./cardTrending/CardTrending"
import CardTrendingChild from "./cardTrendingChild/cardTrendingChild"
import Video from "../Video/Video"



export function Trending() {
  const { openVideo } = useContext(AppContext)

  return (
    <div>
      {
        openVideo ? (<Video />) : (
          <>
            <CardTrending />
            <CardTrendingChild />
          </>

        )
      }
    </div>
  )
}