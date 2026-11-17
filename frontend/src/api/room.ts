import { apiFetch } from "./client";
import { getAccessToken } from "./auth";
import type { JoinResponse, CreateResponse } from "../types/room";

export async function joinRoom(name: string, emoji_id: number, color_id: number, code: string):Promise<JoinResponse|null>{
    const response = await apiFetch("/api/join",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            name,
            emoji_id,
            color_id,
            code
        })
    })
    return response.status === 201? response.json() : null
}

export async function createRoom(slug: string, token: string):Promise<CreateResponse|null>{
    let response = await apiFetch("/api/create-room",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            slug
        })
    }, token)
    if (response.status === 401) {
        const newAccessToken = await getAccessToken()
        if (newAccessToken){
            response = await apiFetch("/api/create-room",{
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({
                    slug
                })
            }, newAccessToken.newAccessToken)
        } else return null
    }
    return response.status === 201? response.json() : null
}