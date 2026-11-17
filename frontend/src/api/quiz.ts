import { apiFetch } from "./client";
import type { Quiz } from "../types/quiz";

export async function getQuizList():Promise<Quiz[]> {
    const response = await apiFetch("/api/quiz-list")
    if (!response.ok) {
        throw new Error("Не удалось загрузить квизы");
    }
    return response.json()
}


export async function getQuiz(slug:string):Promise<Quiz> {
    const response = await apiFetch(`/api/quiz/${slug}`)
    if (!response.ok) {
        throw new Error("Не удалось загрузить квизы");
    }
    return response.json()
}

