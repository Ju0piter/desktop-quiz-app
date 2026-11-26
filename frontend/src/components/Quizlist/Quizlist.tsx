import "./Quizlist.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getQuizList } from "../../api/quiz";
import type { Quiz } from "../../types/quiz";

type QuizlistProps = {
    searchQuery?: string
    activeTag?: string
}

export default function Quizlist({ searchQuery = "", activeTag = "Все" }: QuizlistProps) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                setIsLoading(true)
                const quizzesData = await getQuizList()
                setQuizzes(quizzesData)
            } catch (err) {
                setError("Не удалось загрузить квизы 😔");
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        loadQuizzes()
    }, [])

    const filteredQuizzes = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()

        return quizzes.filter((quiz) => {
            const matchesSearch =
                !q ||
                quiz.title.toLowerCase().includes(q) ||
                quiz.tagline.toLowerCase().includes(q) ||
                quiz.category.toLowerCase().includes(q)

            let matchesTag = true
            if (activeTag === "Популярные") matchesTag = quiz.is_popular
            else if (activeTag === "Новые") matchesTag = quiz.is_new

            return matchesSearch && matchesTag
        })
    }, [quizzes, searchQuery, activeTag])

    return (
        <div className="quiz-list">
            {isLoading && <p>Загружаем квизы ... </p>}
            {error && <p>{error}</p>}

            {!isLoading && !error && filteredQuizzes.length === 0 && (
                <p>Ничего не найдено 😔</p>
            )}

            {!isLoading && !error && filteredQuizzes.length > 0 && (
                <div className="quiz-list-quizzes">
                    {filteredQuizzes.map((quiz) => (
                        <Link
                            to={`/quiz/${quiz.slug}`}
                            key={quiz.slug}
                            className="quiz-card brd"
                        >
                            <div className="quiz-card-top">
                                <img src={quiz.image_url} alt="" className="quiz-img" />
                                <div className="quiz-card-badge">
                                    {quiz.is_new && (
                                        <span className="badge">НОВИНКА</span>
                                    )}
                                    {quiz.is_popular && (
                                        <span className="badge">ПОПУЛЯРНОЕ</span>
                                    )}
                                </div>
                            </div>
                            <div className="quiz-card-main">
                                <h2>{quiz.title}</h2>
                                <div className="quiz-card-tagline">{quiz.tagline}</div>
                                <div className="quiz-card-footer">
                                    <div>⏱️{quiz.duration} мин</div>
                                    <div className="quiz-card-footer-questions">
                                        🎮{quiz.questions_count} вопросов
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}