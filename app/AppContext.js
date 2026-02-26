"use client"
import { createContext, useState } from "react"
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [nameAlbum, setNameAlbum] = useState("")
    const [imageAlbum, setImageAlbum] = useState("")
    const [idLyrics, setIdLirycs] = useState("");
    const [isPaused, setIsPaused] = useState(true);

    return (
        <AppContext.Provider value={{
            nameAlbum, setNameAlbum,
            imageAlbum, setImageAlbum,
            idLyrics, setIdLirycs,
            isPaused, setIsPaused
        }}>
            {children}
        </AppContext.Provider>
    )
}
