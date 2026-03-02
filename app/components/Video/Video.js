"use client"
import { useContext, useEffect } from "react"
import { AppContext } from "@/app/AppContext"
export default function VideoSongs() {
    const { video, setVideo } = useContext(AppContext)

    console.log(video, "este es el video")
    useEffect(() => {

    }, [video])
    return (
        <video
            width="420"
            height="440"
            controls
            preload="auto"
            autoPlay
        >
            <source src={video} type="video/mp4" />
        </video>
    )
}