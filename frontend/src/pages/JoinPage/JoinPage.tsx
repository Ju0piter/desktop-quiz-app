import './JoinPage.css'
import { useState } from "react"
import { createPortal } from "react-dom"
import { useSearchParams, useNavigate } from 'react-router-dom';
import { joinRoom } from '../../api/room';
import { EMOJIS, PLAYER_COLORS } from '../../constants/player.avatar';

interface JoinFormData {
    name: string,
    code: string
}

type JoinStatus = "inProcess" | "unsuccessfull"
type EmojiStatus = "inProcess" | "selected"

interface ChangeUserEmojiProps {
    userEmojiId: number,
    userColorId: number,
    onEmojiChange: (id: number) => void,
    onColorChange: (id: number) => void,
    onClose: () => void
}

function ChangeUserEmoji ({ userEmojiId, userColorId, onEmojiChange, onColorChange, onClose,}: ChangeUserEmojiProps) {
    return (
        createPortal(
            <div className="overlay-set-emoji">
                <div className="set-emoji-window brd">
                    <h3 className='gradient-text'>Выбирай свой аватар!</h3>
                    <div className="current-emoji emoji brd" style={{backgroundColor: PLAYER_COLORS[userColorId] }}>{EMOJIS[userEmojiId]}</div>
                    <div className="emojis-list">
                        {EMOJIS.map((emoji, index) => (
                            <div 
                                className={`emoji brd ${index === userEmojiId? "correct-set" : ""}`} 
                                key={index}
                                onClick={(() => (onEmojiChange(index)))}>
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <div className="colors-list">
                        {PLAYER_COLORS.map((color, index) => (
                            <div 
                                className={`color brd ${index === userColorId? "correct-set" : ""}`} 
                                key={index}
                                style={{backgroundColor: color }}
                                onClick={(() => (onColorChange(index)))}>
                                
                            </div>
                        ))}
                    </div>
                    <button 
                        className="set-emoji-button"
                        onClick={onClose}>
                        Применить изменения
                    </button>
                </div>
            </div>, document.body   
        )
    )
}

export default function JoinPage () {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParamsCode = searchParams.get("code")

    const [status, setStatus] = useState<JoinStatus>("inProcess")
    const [formData, setFormData] = useState<JoinFormData>({
        name: "",
        code: searchParamsCode? searchParamsCode : ""
    })
    const [userEmojiId, setUserEmojiId] = useState<number>(() => Math.floor(Math.random() * 12))
    const [userColorId, setUserColorId] = useState<number>(() => Math.floor(Math.random() * 12))
    const [emojiSelectionStatus, setEmojiSelectionStatus] = useState<EmojiStatus> ("selected")
    
    function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit (e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        setStatus("inProcess")
        const joinData = await joinRoom(formData.name, userEmojiId, userColorId, formData.code.toLowerCase())
        if (joinData) {
            localStorage.setItem(`room:${joinData.linkCode}`, JSON.stringify({ token: joinData.token }))
            navigate(`/room/${joinData.linkCode}`)
        } else {
            setStatus("unsuccessfull")
        }
    }

    return(
        <main className="join">
            <form className="join-form" onSubmit={handleSubmit}>
                <h2>Присоединись к <strong className='gradient-text'>ИГРЕ</strong></h2>
                    <div className="emoji-input" 
                        onClick={(()=> (setEmojiSelectionStatus("inProcess")))}
                        style={{backgroundColor: PLAYER_COLORS[userColorId] }}>
                        {EMOJIS[userEmojiId]}
                    </div>
                    <input 
                    className="join-input card brd"
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={handleChange}
                    minLength={3}
                    required 
                    />
                <input 
                    className="join-input card brd code"
                    type="text"
                    name="code"
                    placeholder="Код"
                    value={formData.code}
                    onChange={handleChange}
                    minLength={6}
                    maxLength={6}
                    required 
                />
                {status === "unsuccessfull" && (
                    <h4 className="red-text">код комнаты не найден</h4>
                )}
                <button type="submit" className="button-join">
                    ПРИСОЕДИНИТЬСЯ
                </button>
            </form>
            {emojiSelectionStatus === "inProcess" && (
                <ChangeUserEmoji 
                    userEmojiId={userEmojiId}
                    userColorId={userColorId}
                    onEmojiChange={setUserEmojiId}
                    onColorChange={setUserColorId}
                    onClose={() => setEmojiSelectionStatus("selected")}
                />
            )}
        </main>
    )
}