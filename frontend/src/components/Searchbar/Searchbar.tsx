import { useState } from "react";
import "./Searchbar.css"
export default function Searchbar () {
    const [activeTag,setActiveTag] = useState<string>("Все")
    return(
        <div className="searchbar">
            <input className= "searchbar-input card brd" type="search" placeholder="Поиск квизов ..."/>
            <button className={`searchbar-tag card brd ${activeTag === "Все"? "active" : ""}`} onClick={() => setActiveTag("Все")}>Все</button>
            <button className={`searchbar-tag card brd ${activeTag === "Популярные"? "active" : ""}`} onClick={() => setActiveTag("Популярные")}>Популярные</button>
            <button className={`searchbar-tag card brd ${activeTag === "Новые"? "active" : ""}`} onClick={() => setActiveTag("Новые")}>Новые</button>
        </div>
    )
}