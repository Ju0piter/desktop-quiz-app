import "./Searchbar.css";

type SearchbarProps = {
    searchQuery?: string,
    setSearchQuery: (query:string) => void,
    activeTag?: string,
    setActiveTag: (tag:string) => void
}

export default function Searchbar({
    searchQuery,
    setSearchQuery,
    activeTag,
    setActiveTag,
}:SearchbarProps) {
    const tags = ["Все", "Популярные", "Новые"]

    return (
        <div className="searchbar">
            <input
                className="searchbar-input card brd"
                type="search"
                placeholder="Поиск квизов ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {tags.map((tag) => (
                <button
                    key={tag}
                    className={`searchbar-tag card brd ${activeTag === tag ? "active" : ""}`}
                    onClick={() => setActiveTag(tag)}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
}