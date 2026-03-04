"use client"
import { useContext, useEffect, useRef } from "react"
import { AppContext } from "@/app/AppContext"

export default function VideoSongs({nextSong}) {
    const { video,setEndVideo, setOpenVideo } = useContext(AppContext)

    const handleVideoEnded = () => {
        setEndVideo(true);
        setOpenVideo(false)
        nextSong()
    };
    return (
        <video
            width="420"
            height="440"
            controls
            preload="auto"
            autoPlay
            onEnded={handleVideoEnded}
            style={{borderRadius: "15px"}}
        >
            <source src={video} type="video/mp4" />
        </video>
    )
}