import type { FastifyInstance } from "fastify";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { Question } from "../types/quiz.js";
import { GameSession, startQuestion, activeGames } from "../services/GameService.js";
import { broadcast, broadcastPresence, roomClients, ClientMessage, Connection } from "../services/RoomService.js";

export async function roomRoutes (app: FastifyInstance) {
    app.post<{Body: { slug: string}}> ("/api/create-room",{ onRequest: [app.authenticate] }, async (request, reply) => {
        const { slug } = request.body  // сделать валидацию slug
        try {
            const quiz = await prisma.quiz.findFirst({ where: {slug}})
            if (!quiz) {
                return reply.status(404).send({ error: "Quiz not found" })
            }
            const code = crypto.randomInt(0, Math.pow(36,6)).toString(36).padStart(6,"0")
            const linkCode = crypto.randomBytes(16).toString("hex")
            const hostToken = crypto.randomBytes(64).toString("hex")
            await prisma.room.create({
                data: {
                    userId: request.user.id,
                    slug: slug,
                    code: code,
                    linkCode: linkCode,
                    hostToken: hostToken,
                },
            })
            return reply.code(201).send({linkCode, hostToken})
        } catch (error) {
            console.error("Error create room:", error);
            reply.status(500).send({ error: "Failed to create room" });
        }
        
    })

    app.post<{Body: { code: string, emoji_id: number, color_id: number, name: string}}> ("/api/join", async (request, reply) => {
        const { name, emoji_id, color_id, code } = request.body  // сделать валидацию code и name
        try {
            const room = await prisma.room.findFirst({ where: { code }})
            if (!room) {
                return reply.status(404).send({ error: "Room not found" })
            }
            const token = crypto.randomBytes(64).toString("hex")
            await prisma.player.create({
                data: {
                    roomId: room.id,
                    token: token,
                    name: name,
                    emoji_id: emoji_id,
                    color_id: color_id
                },
            })
            return reply.code(201).send({linkCode: room.linkCode, token})
        } catch (error) {
            console.error("Error join room:", error);
            reply.status(500).send({ error: "Failed to join room" });
        }
        
    })    

    app.get<{Params: {linkCode: string}}>("/ws/room/:linkCode", {websocket: true}, async (socket, request) => {
        const { linkCode } = request.params   // сделать валидацию linkCode
        try {
            let conn: Connection| null = null
            socket.on("message", async (raw) => {
                let message: ClientMessage
                try {
                    message = JSON.parse(raw.toString("utf-8"))
                } catch { return }
                const room = await prisma.room.findFirst({where: { linkCode }})
                if (!room){
                    socket.close(1008, "Room not found")
                    return
                }
                if (message.type === "join") {
                    if (message.token === room.hostToken) {
                        conn = {kind: "host", roomId: room.id, socket}
                    } else {
                        const player = await prisma.player.findUnique({where:{token: message.token}})
                        if (!player || player.roomId !== room.id) {
                            socket.close(1008, "Invalid token")
                            return
                        }
                        const existing = [...(roomClients.get(linkCode)) ?? []]
                            .find(c => c.kind === "player" && c.playerId === player.id)
                        if (existing) {
                            existing.socket.close(1001, "Replaced by new connection")
                        }
                        const wasMaster = existing?.kind === "player" && existing.is_master_player
                        const hasMaster = [...(roomClients.get(linkCode)) ?? []].some(c => c.kind === "player" && c.is_master_player)
                        const isMasterPlayer = wasMaster || !hasMaster
                        conn = {kind: "player", roomId: room.id, playerId: player.id, name: player.name, emoji_id: player.emoji_id, color_id: player.color_id, is_master_player: isMasterPlayer, socket}
                    }
                    if (!roomClients.has(linkCode)) {roomClients.set (linkCode, new Set())}
                    roomClients.get(linkCode)!.add(conn)
                    if (activeGames.has(linkCode) && conn.kind === "player") {
                        activeGames.get(linkCode)?.answers.set(conn.playerId, null)
                        activeGames.get(linkCode)?.leaderBoard.set(conn.playerId, 0)
                    }
                    socket.send(JSON.stringify(conn.kind === "host"?
                        {
                            type: "joined",
                            role: "host",
                            code: room.code

                        }:
                        {
                            type: "joined",
                            role: "player",
                            playerId: conn.playerId,
                            name: conn.name,
                            is_master_player: conn.is_master_player

                        }
                    ))
                    broadcastPresence(linkCode)
                }
                if (message.type === "start-game") {
                    if (message.token === room.hostToken) return
                    const player = await prisma.player.findUnique({where:{token: message.token}})
                    if (player && [...(roomClients.get(linkCode)) ?? []].some(c => c.kind === "player" && c.playerId === player.id && c.is_master_player)) {
                        
                        if (!activeGames.has(linkCode)){

                            const quiz = await prisma.quiz.findUnique({
                                where: {slug: room.slug},
                                include: {
                                    questions: {
                                        include: {
                                            options: true
                                        }
                                    }
                                }
                            })
                            if (!quiz) return

                            const questions: Question[] = quiz.questions.map((q) => ({
                                question: q.question,
                                answer_id: q.answer_id,
                                options: q.options.map((o) => ({
                                    id: o.id,
                                    option: o.option
                                }))
                            }))
                            const players = [...(roomClients.get(linkCode)) ?? []].filter((c) => c.kind ==="player").map((p) => p.playerId)
                            const session: GameSession = {
                                questions,
                                currentIndex: 0,
                                phase: "QUESTION",
                                endsAt: 0,
                                answers: new Map(players.map((playerId) => [playerId, null])),
                                leaderBoard: new Map(players.map((playerId) => [playerId, 0])),
                                timer: null
                            }
                            activeGames.set(linkCode, session)
                            broadcast(linkCode, { type: 'show-banner' })
                            setTimeout(()=> {
                                broadcast(linkCode, { type: 'start-questions' })
                                startQuestion(linkCode, activeGames.get(linkCode)!)
                            }, 10_000)
                        }    
                    }
                    return
                }
                if (message.type === "answer-to-the-question") {
                    if (!activeGames.has(linkCode) || message.token === room.hostToken) return
                    const player = await prisma.player.findUnique({where:{token: message.token}})
                    if (player && [...(roomClients.get(linkCode)) ?? []].some(c => c.kind === "player" && c.playerId === player.id)) {
                        if (activeGames.get(linkCode)!.endsAt > Date.now() 
                            && activeGames.get(linkCode)!.currentIndex === message.question_id 
                            && activeGames.get(linkCode)!.answers.get(player.id) === null) {
                                activeGames.get(linkCode)!.answers.set(player.id, message.answer_id)
                                broadcast(linkCode, {type: "answer-accepted", player_id: player.id})
                        }
                    }
                    return
                }

            })
            socket.on("close", () => {
                if (!conn) return
                roomClients.get(linkCode)?.delete(conn)

                if (conn.kind === "player" && conn.is_master_player) {
                    const nextMaster = [...(roomClients.get(linkCode)) ?? []].find(c => c.kind === "player")
                    if (nextMaster) {nextMaster.is_master_player = true}
                }
                broadcastPresence(linkCode)
                if (roomClients.get(linkCode)?.size === 0) {
                    roomClients.delete(linkCode)
                }
            })

        } catch (error) {
            console.error("Error join room:", error);
            socket.close(1011, "Error join room")
            return
        }
    })
}