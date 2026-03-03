"use client"
import { useContext, useEffect } from "react"
import { AppContext } from "@/app/AppContext"
export default function VideoSongs() {
    const { video,setEndVideo, setOpenVideo } = useContext(AppContext)


    useEffect(() => {

    }, [video])

    const handleVideoEnded = () => {
        setEndVideo(true);
        setOpenVideo(false)
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