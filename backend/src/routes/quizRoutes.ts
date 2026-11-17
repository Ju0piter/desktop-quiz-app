import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import type { Quiz }  from "../types/quiz.js";

interface quizParams {
    slug: string
}

export async function quizzesRoutes (app: FastifyInstance) {
    app.get("/api/quiz-list", async (request, reply) => {
        try {
            const quizzes = await prisma.quiz.findMany({
                select:{
                    id: true,
                    slug: true,
                    title: true,
                    tagline: true,
                    image_url: true,
                    category: true,
                    difficulty: true,
                    duration: true,
                    is_popular: true,
                    is_new: true,
                    _count:{
                        select:{questions:true}
                    }
                }
            });
            const formattedQuizzes: Quiz[] = quizzes.map(({_count, ...quiz})=> ({
                ...quiz, questions_count: _count.questions}))
            return reply.status(200).send(formattedQuizzes)
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            reply.status(500).send({ error: "Failed to fetch quizzes" });
            }
    });

    app.get<{Params: quizParams}>("/api/quiz/:slug", async (request, reply) => {

        const slugParams = request.params.slug //  <---- проверка на валидность
        
        try {
            const quizData = await prisma.quiz.findFirst({
                where: {
                    slug: slugParams
                },
                select:{
                    title: true,
                    tagline: true,
                    description: true,
                    image_url: true,
                    category: true,
                    difficulty: true,
                    duration: true,
                    is_popular: true,
                    is_new: true,
                    questions: {
                        where: {
                            is_sample: true,
                        },
                        select: {
                            question: true,
                            answer_id: true,
                            options: {
                                select: {
                                    id: true,
                                    option: true
                                }
                            }
                        }
                    },
                    _count:{
                        select:{questions:true}
                    }
                },
            });

            if (!quizData) {
                return reply.status(404).send({ error: "Quiz not found" })
            }
            const {_count, ...quiz} = quizData
            const formattedQuiz: Quiz = {...quiz, questions_count: _count.questions}
            return reply.status(200).send(formattedQuiz)

        } catch (error) {
            console.error("Error fetching quiz:", error);
            reply.status(500).send({ error: "Failed to fetch quiz" });
            }    
    })


}