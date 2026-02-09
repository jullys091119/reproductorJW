"use client"
import { createContext, useState } from "react"
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [nameAlbum, setNameAlbum] = useState("")
    const [imageAlbum, setImageAlbum] = useState("")
      const [idLyrics, setIdLirycs] = useState("");


    return (
        <AppContext.Provider value={{
            nameAlbum, setNameAlbum,
            imageAlbum, setImageAlbum,
            idLyrics, setIdLirycs
        }}>
            {children}
        </AppContext.Provider>
    )
}
