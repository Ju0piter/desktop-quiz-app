import './RoomPage.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef} from "react";
import { QRCodeSVG } from 'qrcode.react';
import OrientationOverlay from '../../components/OrientationOverlay/OrientationOverlay';
import TimerBar from '../../components/TimerBar/TimerBar';
import logoIcon from '../../assets/pngwing.com.png'
import { EMOJIS, PLAYER_COLORS } from '../../constants/player.avatar';
import type { Question, Option } from '../../types/quiz';

type ServerMessage = 
    | { type: "joined", role: "host", code: string }
    | { type: "joined", role: "player", playerId: string, name: string, is_master_player: boolean }
    | { type: "presence", players: { playerId: string, name: string, emoji_id: number, color_id: number, is_master_player: boolean }[]}
    | { type: "show-banner" }
    | { type: "start-questions" }
    | { type: "new-question", index: number, total: number, text: string, options: Option[], endsAt: number }
    | { type: "round-result", correctAnswerId: number, endsAt: number }
    | { type: "game-end", leaderBoard: {playerId: string, score: number}[] }

export default function RoomPage () {
    const wsRef = useRef<WebSocket|null>(null)
    const [timerQuestionEndsAt, setTimerQuestionEndsAt] = useState<number | null>(null);
    const letters = ["A","B","C","D"]
    const { linkCode } = useParams<{linkCode: string}>()
    const storedToken = (() => {
        try {
            const stored = localStorage.getItem(`room:${linkCode}`);
            if (!stored) return null;
            const { token } = JSON.parse(stored);
            return token;
        } catch {
            return null;
        }
    })()
    const [role, setRole] = useState<'host'|'player'|null>(null)
    const [code, setCode] = useState<string|null>(null)
    const [players, setPlayers] = useState<{playerId:string;name:string; emoji_id: number, color_id: number, is_master_player: boolean}[]>([])
    const [isMasterPlayer, setIsMasterPlayer] = useState<boolean> (false)
    const [showStartBanner, setShowStartBanner] = useState<boolean> (false)
    const [isGameStarted, setIsGameStarted] = useState<boolean> (false)
    const [isQuestionsStarted, setIsQuestionsStarted] = useState<boolean> (false)
    const [indexQuestion, setIndexQuestion] = useState<number> (0)
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number|null> (null)
    const [question, setQuestion] = useState<Question|null> (null)
    const [answerIsSented, setAnswerIsSented] = useState<boolean> (false)
    const [leaderBoard, setLeaderBoard] = useState<{playerId: string, score: number} []> ([])
    const [isLeaderBoardStarted, setIsLeaderBoardStarted] = useState<boolean> (false)
    const navigate = useNavigate()

    useEffect(() => {
        
        if (!storedToken) {
            navigate("/")
            return
        }
        const protocol = location.protocol === "https:" ? "wss" : "ws"
        const ws = new WebSocket(`${protocol}://${location.host}/ws/room/${linkCode}`)
        wsRef.current = ws
        console.log(storedToken)
        ws.onopen = () => ws.send(JSON.stringify({ type: 'join', token: storedToken }))
        ws.onmessage = (e) => {
            const msg: ServerMessage = JSON.parse(e.data)
            if (msg.type === 'joined')  { 
                setRole(msg.role) 
                if (msg.role === 'host') {
                    setCode(msg.code)
                } else {
                    setIsMasterPlayer(msg.is_master_player)
                }
            }
            if (msg.type === 'presence') setPlayers(msg.players)
            if (msg.type === 'show-banner') {
                setIsGameStarted(true)
                setShowStartBanner(true)
                setTimeout(() => {
                    setShowStartBanner(false)
                }, 18_000)
            }
            if (msg.type === 'start-questions') setIsQuestionsStarted(true)
            if (msg.type === 'new-question') {
                setIndexQuestion(msg.index)
                setQuestion({
                    question: msg.text,
                    answer_id: null,
                    options: msg.options
                })
                setSelectedAnswerIndex(null)
                setAnswerIsSented(false)
                setTimerQuestionEndsAt(msg.endsAt)
            } 
            if (msg.type === 'round-result') {
                setQuestion((prev) => (prev? {
                    ...prev,
                    answer_id: msg.correctAnswerId
                }: null))
            }
            if (msg.type === 'game-end') {
                setLeaderBoard(msg.leaderBoard)
                setIsLeaderBoardStarted(true)
            }

        }
        return () => {
            ws.close()
            wsRef.current = null
        }
    }, [linkCode, navigate, storedToken])


    return (
        <div className="room-page">
            {role && role === 'host' && (
                <div className="host-page">
                    <div className={`room-page-main ${isGameStarted? "" : "visible"}`}>
                        <OrientationOverlay/>
                        <div className="room-left-zone">
                            <div className="room-main-info">
                                <Link
                                    to= "/"
                                    className="back-button card brd">
                                    Назад в каталог
                                </Link>
                                <div className="blue-text mrgn">ПОДКЛЮЧЕНИЕ К ИГРЕ</div>
                                <div className="hero-title">Возьмите телефон,</div>
                                <div className="hero-title">откройте <strong className='gradient-text'>quizzi.club/join</strong></div>
                                <div className="hero-title">и введите код</div>
                                <div className="hero-description mrgn">Никаких приложений — просто введите код комнаты на сайте.</div>
                                <div className="hero-description">Первый, кто подключится к комнате, становится ведущим.</div>
                                <div className="hero-description">Игра начнётся, как только ведущий запустит первый вопрос.</div>
                                <div className="room-code card">
                                    <div className="code-info">КОД КОМНАТЫ</div>
                                    <div className="code-text">{code?.toUpperCase()}</div>
                                </div>
                            </div>

                            <div className="room-qr">
                                <div className="iphone-img">
                                    <h2>или отсканируй</h2>
                                    <h2 className='gradient-text'>QR-код</h2>
                                    <div className="qr-code">
                                        <QRCodeSVG
                                            value={`https://quizzi.club/join?code=${code?.toUpperCase()}`}
                                            size={220}
                                            bgColor={"#ffffff00"}
                                            fgColor={"#ffffffd7"}
                                            level="H"
                                        />
                                        <img className= "qr-logo" src={logoIcon} alt="logo" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="room-right-zone">
                            <div className="lobby-info card brd">
                                <div className="green-diod"></div>
                                <div className="">Лобби открыто · ждём игроков</div>
                            </div>
                            <div className="players-list card brd">
                                <div className="players-info">
                                    <div className="players-info-text">ИГРОКИ</div>
                                    <div className="players-info-count">{players.length} / 20</div>
                                </div>
                                <div className="players-players">
                                    {players.map((player, index) => (
                                        <div className="players-player card brd" key={index}>
                                            <div className="player-emoji brd" style={{backgroundColor: PLAYER_COLORS[player.color_id]}}>{EMOJIS[player.emoji_id]}</div>
                                            {player.name}</div>
                                    ))}
                                </div>

                            </div>

                        </div>

                    </div>
                    {/* ПРАВИЛА ИГРЫ */}
                    <div className={`start-banner ${showStartBanner? "visible" : ""}`}>
                        <div className="start-banner-rules card brd">
                            <div className="rules-header gradient-text"> ПРАВИЛА ИГРЫ</div>
                            <div className="rules-text"><strong className='blue-text'>Вопрос на экране. </strong>На главном экране появляется вопрос и 4 варианта ответа.</div>
                            <div className="rules-text"><strong className='blue-text'>Выбор на телефоне. </strong>На экране вашего смартфона появятся кнопки, соответствующие вариантам на главном экране. Нажмите на ту, которую считаете правильной.</div>
                            <div className="rules-text"><strong className='blue-text'>Таймер. </strong>На каждый вопрос дается ограниченное время. Если не успеть нажать кнопку до конца отсчета, ответ не засчитается.</div>
                            <div className="rules-text"><strong className='blue-text'>Блокировка ответа. </strong>После нажатия кнопки изменить свой выбор уже нельзя.</div>
                            <div className="rules-text"><strong className='blue-text'>Подсчет очков. </strong>За каждый правильный ответ вы получаете 1 балл. За неправильный ответ или пропуск хода баллы не начисляются и не списываются.</div>
                            <div className="rules-text"><strong className='blue-text'>Итоги раунда. </strong>После окончания времени на главном экране подсвечивается правильный ответ, а вы видите на телефоне, удалось ли вам угадать.</div>
                            <div className="rules-text"><strong className='blue-text'>Определение победителя. </strong>После финального вопроса на главном экране появится таблица лидеров. Побеждает игрок, набравший наибольшее количество баллов.</div>
                        </div>
                    </div>
                    {/* ВОПРОСЫ */}
                    <div className={`questions-banner ${isQuestionsStarted && !isLeaderBoardStarted? "visible" : ""}`}>
                        <div className="questions-banner-main card brd" key={indexQuestion}>
                            <div className="question-number gradient-text">ВОПРОС {indexQuestion + 1}</div>
                            <div className="questions-banner-text">{question?.question}</div>
                            <div className="options">
                                {question?.options.map((option, index) => (
                                    <div key={index} className={`option-card brd ${question.answer_id === index? "correct-answer" : ""}`}>
                                        <div className="circle-answer-index ">{letters[index]}</div>
                                        <div className="option-text">{option.option}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* ТАБЛИЦА РЕЗУЛЬТАТОВ */}
                    <div className={`leaderboard ${isLeaderBoardStarted? "visible" : ""}`}>
                        <div className="leaderboard-main card brd">
                            <div className="leaderboard-text gradient-text">РЕЗУЛЬТАТЫ</div>
                            <div className="leaderboard-players">
                                {leaderBoard.map((playerBoard, index) => (
                                    <div className={`leaderboard-player card brd ${index === 0 ? "winner" : ""} `} key={index}>
                                        <div className="player-emoji brd" style={{backgroundColor: PLAYER_COLORS[players.find((player) => player.playerId === playerBoard.playerId)?.color_id ?? 0]}}>{EMOJIS[players.find((player) => player.playerId === playerBoard.playerId)?.emoji_id ?? 0]}</div>
                                        <div className="player-name">{players.find((player) => player.playerId === playerBoard.playerId)?.name ?? `Игрок ${index}`}</div>
                                        <div className="player-score">{playerBoard.score}</div>
                                    </div>
                                ))}
                            </div>
                            <button className='start-game-button' onClick={(() => (navigate("/")))}>ЗАВЕРШИТЬ</button>
                        </div>
                    </div>
                    {/* ТАЙМЕР */}
                    <div className={`timer-question ${isQuestionsStarted && !isLeaderBoardStarted? "visible" : ""}`}>
                        <TimerBar
                            endsAt={timerQuestionEndsAt}
                        />
                    </div>

                </div>
            )}
            {/* ЭКРАН ИГРОКА------------------------------------------------------------------------------ */}
            {role && role === "player" && (
                <div className="room-page-player">
                    {/* МАСТЕР-БАР */}
                    {isMasterPlayer && (
                        <div className="master-player">
                            <div className="master-player-bar brd">управление игрой</div>
                        </div>
                    )}
                    {/* КНОПКА СТАРТА */}
                    {!isGameStarted && isMasterPlayer && (
                        <button className="start-game-button"
                            onClick={(() => {
                                if (wsRef.current?.readyState === WebSocket.OPEN){
                                    wsRef.current?.send(JSON.stringify({ type: 'start-game', token: storedToken }))                                                
                                }
                            })}> Начать игру
                        </button>
                    )}
                    {/* ВОПРОСЫ */}
                    {isQuestionsStarted && (
                        <div className="room-page-player-main">
                            <div className="questions-banner-main mobile-bunner card brd" key={indexQuestion}>
                                <div className="options">
                                    {question?.options.map((option, index) => (
                                        <button key={index} className={`option-card-mobile brd card 
                                                         ${question.answer_id === index? "correct-answer" : ""}
                                                         ${selectedAnswerIndex === index ? "selected-answer" : ""}
                                                         ${selectedAnswerIndex === index && selectedAnswerIndex !== question.answer_id && question.answer_id !== null ? "wrong-answer" : ""}`}
                                             disabled={ answerIsSented }
                                             onClick={(()=> (setSelectedAnswerIndex(index)))}>
                                            <div className="option-text-mobile">{letters[index]}: {option.option}</div>
                                        </button>
                                    ))}
                                </div>
                                <button className='button-sumbit-answer'
                                        disabled={selectedAnswerIndex === null || answerIsSented}
                                        onClick={(() => {if (wsRef.current?.readyState === WebSocket.OPEN){
                                                            wsRef.current?.send(JSON.stringify({ type: 'answer-to-the-question', token: storedToken, question_id: indexQuestion, answer_id:selectedAnswerIndex }))                                                
                                                         }
                                                         setAnswerIsSented(true)})}>
                                            ОТПРАВИТЬ
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}