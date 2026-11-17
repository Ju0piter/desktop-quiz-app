import './QuizPage.css'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom"


import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Topbar from '../../components/Topbar/Topbar';
import { getQuiz } from '../../api/quiz';
import type { Quiz } from "../../types/quiz";
import { useAuth } from "../../context/AuthContext"
import { createRoom } from '../../api/room';

function AuthWarning ({onClose}: {onClose: () => void}) {
    return (
        createPortal(
            <div className="warning-overlay">
                <div className="warning-window brd">
                    <h2>Авторизуйся, чтобы играть</h2>
                    <button className="back-button-warning"
                            onClick={onClose}>
                            OK    
                    </button>
                </div>
            </div>,document.body
        )
    )
}

export default function QuizPage () {
    const { user, accessToken, logout } = useAuth()
    const { slug } = useParams <{slug: string}>() // <--- подгружать slug[] и проходить валидацию на них
    if (!slug || Number(slug) || slug.length <= 3) { return (<NotFoundPage />) }
    
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz> ()
    const [isLoading, setIsLoading] = useState<boolean> (true)
    const [showWarningAuth, setShowWarningAuth] = useState<boolean> (false)
    const [error, setError] = useState<string|null> (null)
    const letters = ["A","B","C","D"]

    const handlePlayClick = async () => {
        if (!user) {
            setShowWarningAuth(true)
        } else {
            let createRoomData = await createRoom(slug, accessToken! )
            if (createRoomData) {
                localStorage.setItem(`room:${createRoomData.linkCode}`, JSON.stringify({ token: createRoomData.hostToken }))
                navigate(`/room/${createRoomData.linkCode}`)
            } else {
                logout()
                setShowWarningAuth(true)
            }
        }
    }

    useEffect(() => {
        const LoadQuiz = async () => {
            try{
                setIsLoading(true)
                const quizData = await getQuiz(slug)
                setQuiz(quizData)
            }catch (error){
                setError("Не удалось загрузить квиз :(")
                console.error(error)
            }finally{
                setIsLoading(false)
            }
        }
        LoadQuiz()
    },[]);


    return(
        <main className="quiz-page">
            <header className="quiz-header">
                <Topbar />
            </header>

            <Link
                to= "/"
                className="back-button card brd">

                    Назад

            </Link>

            {isLoading && <p>Загружаем квизы ... </p>}

            {error && <p>{error}</p>}

            {!isLoading && !error && quiz && (
                <div className="quiz">

                    <div className="quiz-img-div brd">
                        <img src={quiz.image_url} alt="" className='quiz-image' />
                        <div className="quiz-title-block">
                            <div className="quiz-title">{quiz.title}</div>
                            <div className="quiz-tagline">{quiz.tagline}</div>
                        </div>
                    </div>

                    <div className="quiz-main">
                        <div className="quiz-left-zone">
                            <h4 className='blue-text'>ОПИСАНИЕ</h4>
                            <div className='dark-text'>{quiz.description}</div>

                            <div className="quiz-sample-questions">
                                <h4 className='blue-text'>ПРИМЕРЫ ВОПРОСОВ</h4>
                                {quiz.questions?.map((quistion, index) => (
                                    <div className="question card brd" key={index}>
                                        <h4>{`${index + 1}. ${quistion.question}`}</h4>
                                        <div className="options">
                                            {quistion.options.map((option, index) => (
                                                <div key={index} className=
                                                {`option brd ${Number(quistion.answer_id) === index? "correct" : ""}`}>
                                                    <div className="circle-answer brd">{letters[index]}</div>
                                                    <div className="option-option">{option.option}</div>
                                                    
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>



                        <div className="quiz-right-zone">
                            <div className="quiz-info card brd">
                                <div className="quiz-info-data">
                                    <div className="quiz-info-data-tag">ВОПРОСОВ</div>
                                    <div className="quiz-info-data-value">{quiz.questions_count}</div>
                                </div>
                                <div className="quiz-info-data">
                                    <div className="quiz-info-data-tag">ДЛИТЕЛЬНОСТЬ</div>
                                    <div className="quiz-info-data-value">{quiz.duration} минут</div>
                                </div>
                                <div className="quiz-info-data">
                                    <div className="quiz-info-data-tag">СЛОЖНОСТЬ</div>
                                    <div className="quiz-info-data-value">{quiz.difficulty}</div>
                                </div>
                                <div className="quiz-info-data">
                                    <div className="quiz-info-data-tag">СЫГРАНО</div>
                                    <div className="quiz-info-data-value">12.5 К</div>
                                </div>
                            </div>
                            <button className="button-play" onClick={handlePlayClick}>▶ ИГРАТЬ СЕЙЧАС</button>
                            <div className="help-info brd">
                                <div className="icon-help">💡</div>
                                <div className="help-text">
                                    <strong className='blue-text'>Как это работает: </strong>
                                    нажмите «Играть сейчас», чтобы открыть экран комнаты. Участники подключаются к вам, отсканировав QR-код или введя код комнаты.
                                </div>
                            </div>


                        </div>

                    </div>
                    {showWarningAuth && <AuthWarning onClose={(() => (setShowWarningAuth(false)))} />}
                    <div className="footer"></div>

                </div>
            )}

            
        </main>
    )
}