import { Question } from "../types/quiz.js";
import { broadcast } from "../services/RoomService.js";

export interface GameSession {
    questions: Question[],
    currentIndex: number,
    phase: 'QUESTION' | 'REVEAL' | 'FINISHED',
    endsAt: number;
    answers: Map<string, number|null>,
    leaderBoard: Map<string, number>,
    timer: NodeJS.Timeout | null,
}

export const activeGames = new Map<string, GameSession>();

export function startQuestion(linkCode: string, game: GameSession) {

    const question = game.questions[game.currentIndex]
    const durationMs = 20_000

    game.phase = 'QUESTION'
    game.answers.forEach(( _ , player_id) => {
        game.answers.set(player_id, null)
    })
    game.endsAt = Date.now() + durationMs

    broadcast(linkCode, {
        type: 'new-question',
        index: game.currentIndex,
        total: game.questions.length,
        text: question.question,
        options: question.options,
        endsAt: game.endsAt,
    });

    game.timer = setTimeout(() => {
        revealAnswer(linkCode, game)
    }, durationMs)
}

function revealAnswer(linkCode: string, game: GameSession) {

    if (game.timer) clearTimeout(game.timer)

    const question = game.questions[game.currentIndex]
    const revealDurationMs = 5_000

    game.phase = 'REVEAL'
    game.endsAt = Date.now() + revealDurationMs

    // Тут логика начисления очков игрокам из game.answers...

    broadcast(linkCode, {
        type: 'round-result',
        correctAnswerId: question.answer_id,
        endsAt: game.endsAt,
    });

    game.answers.forEach((value, player_id) => {
        if (value === question.answer_id) {
            const score = game.leaderBoard.get(player_id) ?? 0
            game.leaderBoard.set(player_id, score + 1 )
        }
    })

    game.timer = setTimeout(() => {
        game.currentIndex++
        if (game.currentIndex < game.questions.length) {
            startQuestion(linkCode, game)
        } else {
            game.phase = 'FINISHED'
            const leaderBoard = [...game.leaderBoard.entries()]
                                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                                .map(([playerId, score]) => ({ playerId, score }))
            broadcast(linkCode, { type: 'game-end', leaderBoard })
            activeGames.delete(linkCode)
        }
    }, revealDurationMs)
}
