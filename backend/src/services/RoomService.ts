import { WebSocket } from "@fastify/websocket";

// export type ClientMessage = 
//     | { type: "join", token: string}
//     | { type: "start-game", token: string}
//     | { type: "pause-game", token: string}
//     | { type: "continue-game", token: string}
//     | { type: "change-master", token: string, new_master_id: string}
//     | { type: "answer-to-the-question", token: string, question_id: number, answer_id: number}

export type Connection = 
    | {kind: "host", roomId: string, socket: WebSocket}
    | {kind: "player", 
       roomId: string, 
       playerId: string, 
       name: string, 
       emoji_id: number, 
       color_id: number,
       is_master_player: boolean, 
       socket: WebSocket}

export const roomClients = new Map<string, Set<Connection>>()

export function broadcast(linkCode: string, msg: object) {
    const raw = JSON.stringify(msg)
    for (const c of roomClients.get(linkCode) ?? []) {
        if (c.socket.readyState === 1) c.socket.send(raw)
    }
}

export function broadcastPresence(linkCode: string) {
    const players = [...(roomClients.get(linkCode) ?? [])]
    .filter(c => c.kind === 'player')
    .map(c => ({ playerId: c.playerId, name: c.name, emoji_id: c.emoji_id, color_id: c.color_id, is_master_player: c.is_master_player }))
    broadcast(linkCode, { type: 'presence', players })
}

export function singleBroadcast(socket: WebSocket, msg: object) {
    const raw = JSON.stringify(msg)
    if (socket.readyState === 1) socket.send(raw)
}