"use client"
import React, { useEffect } from "react";
import { Header } from "./components/Header/Header";
import { setSongs, getSongs } from "@/queries";
export default function Home() {
  useEffect(() => {
    setSongs();
    const loadData = async () => {
      const data = await getSongs()
      console.log(data)
    }
    loadData()
  }, []);

  return (
    <div className="container">
      <Header />
    </div>
  );
}
