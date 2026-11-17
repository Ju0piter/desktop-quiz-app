import "./Quizlist.css"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getQuizList } from "../../api/quiz"
import type { Quiz } from "../../types/quiz";

export default function Quizlist () {
    const [quizzes, SetQuizzes] = useState<Quiz[]> ()
    const [isLoading, SetIsLoading] = useState<boolean> (true)
    const [error, SetError] = useState<string|null> (null)

    useEffect(() => {
        const LoadQuizzes = async () => {
            try{
                SetIsLoading(true)
                const quizzesData = await getQuizList()
                SetQuizzes(quizzesData)
            }catch (error){
                SetError("Не удалось загрузить квизы :(")
                console.error(error)
            }finally{
                SetIsLoading(false)
            }
        }
        LoadQuizzes()
    },[]);


    return(
        <div className="quiz-list">

            {isLoading && <p>Загружаем квизы ... </p>}

            {error && <p>{error}</p>}

            {!isLoading && !error && quizzes &&(
                <div className="quiz-list-quizzes">
                    {quizzes.map((quiz) => (
                        <Link
                            to={`/quiz/${quiz.slug}`}
                            key={quiz.slug} 
                            className="quiz-card brd">
                                
                            <div className="quiz-card-top">
                                <img src={quiz.image_url} alt="" className="quiz-img"/>
                            </div>
                            <div className="quiz-card-main">
                                <h2>{quiz.title}</h2>
                                <div className="quiz-card-tagline">{quiz.tagline}</div>
                                <div className="quiz-card-footer">
                                    <div>⏱️{quiz.duration} мин</div>
                                    <div className="quiz-card-footer-questions">🎮{quiz.questions_count} вопросов</div>
                                </div>
                            </div>
                        </Link> 
                    ))}
                </div>
            )}

        </div>
    )
}