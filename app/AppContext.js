"use client"
import { createContext, useState } from "react"
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [nameAlbum, setNameAlbum] = useState("")
    const [imageAlbum, setImageAlbum] = useState("")


    return (
        <AppContext.Provider value={{
            nameAlbum, setNameAlbum,
            imageAlbum, setImageAlbum
        }}>
            {children}
        </AppContext.Provider>
    )
}
