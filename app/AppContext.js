"use client"
import { createContext, useState } from "react"
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [nameAlbum, setNameAlbum] = useState("")
    const [imageAlbum, setImageAlbum] = useState("")
    const [idLyrics, setIdLirycs] = useState("");
    const [isPaused, setIsPaused] = useState(true);
    const [openVideo, setOpenVideo] = useState(false)
    const [video, setVideo] = useState("")

    return (
        <AppContext.Provider value={{
            nameAlbum, setNameAlbum,
            imageAlbum, setImageAlbum,
            idLyrics, setIdLirycs,
            isPaused, setIsPaused,
            openVideo, setOpenVideo,
            video, setVideo
        }}>
            {children}
        </AppContext.Provider>
    )
}
