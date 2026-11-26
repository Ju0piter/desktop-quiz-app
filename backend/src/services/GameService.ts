import { Question } from "../types/quiz.js";
import { broadcast } from "../services/RoomService.js";

export interface GameSession {
    questions: Question[],
    currentIndex: number,
    phase: 'QUESTION' | 'REVEAL' | 'FINISHED',
    endsAt: number|null,
    answers: Map<string, number|null>,
    leaderBoard: Map<string, number>,
    timer: NodeJS.Timeout | null,
    paused: boolean,
    remainingMs: number | null,
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

export function pauseGame(linkCode: string) {
    const game = activeGames.get(linkCode)
    if (!game || game.paused || game.phase === 'FINISHED') return
    if (!game.timer) return

    clearTimeout(game.timer)
    game.timer = null
    game.remainingMs = Math.max(0, (game.endsAt ?? 0) - Date.now())
    game.endsAt = null
    game.paused = true

    broadcast(linkCode, {
        type: 'game-paused',
        phase: game.phase,
        remainingMs: game.remainingMs,
    })
}

export function continueGame(linkCode: string) {
    const game = activeGames.get(linkCode)
    if (!game || !game.paused) return

    const remaining = game.remainingMs ?? 0
    game.paused = false
    game.remainingMs = null
    game.endsAt = Date.now() + remaining

    broadcast(linkCode, {
        type: 'game-continue',
        phase: game.phase,
        endsAt: game.endsAt,
    })

    if (game.phase === 'QUESTION') {
        game.timer = setTimeout(() => revealAnswer(linkCode, game), remaining)
    } else if (game.phase === 'REVEAL') {
        game.timer = setTimeout(() => advance(linkCode, game), remaining)
    }
}

function advance(linkCode: string, game: GameSession) {
    game.currentIndex++
    if (game.currentIndex < game.questions.length) {
        startQuestion(linkCode, game)
    } else {
        game.phase = 'FINISHED'
        const leaderBoard = [...game.leaderBoard.entries()]
            .sort(([, a], [, b]) => b - a)
            .map(([playerId, score]) => ({ playerId, score }))
        broadcast(linkCode, { type: 'game-end', leaderBoard })
        activeGames.delete(linkCode)
    }
}

function revealAnswer(linkCode: string, game: GameSession) {

    if (game.timer) clearTimeout(game.timer)

    const question = game.questions[game.currentIndex]
    const revealDurationMs = 5_000

    game.phase = 'REVEAL'
    game.endsAt = Date.now() + revealDurationMs

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

    game.timer = setTimeout(() => advance(linkCode, game), revealDurationMs)
}
