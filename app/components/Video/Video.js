"use client"
import { useContext, useEffect, useRef } from "react"
import { AppContext } from "@/app/AppContext"


export default function VideoSongs() {
    const { video,setVideoPause, videoPause } = useContext(AppContext)
    const videoRef = useRef(null)

    useEffect(() => {
     setVideoPause(videoRef)
     console.log(videoPause?.current)
    }, [video, videoPause])
    return (
        <video
           
            controls
            preload="auto"
            autoPlay
            ref={videoRef}
            style={{borderRadius: "20px"}}
        >
            <source src={video} type="video/mp4" />
        </video>
    )
}