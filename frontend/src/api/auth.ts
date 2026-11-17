import { apiFetch } from "./client";
import type { User } from "../types/user";

interface AccessTokenResponse {
    newAccessToken: string
}

export async function getAccessToken():Promise<AccessTokenResponse|null> {
    const response = await apiFetch("/api/auth/refresh",{
        method: "POST",
        credentials: "include"
    })

    return response.status === 201? response.json() : null
}

export async function getMe(accessToken:string):Promise<User|null>{
    const response = await apiFetch("/api/auth/me", {}, accessToken)

    return response.status === 200? response.json() : null
}

export async function revokeRefresh(){
    await apiFetch("/api/auth/logout",{
        method: "POST",
        credentials: "include"
    })
}

export async function registerUser(email: string, nickname: string, password: string){
    const response = await apiFetch("/api/auth/register",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            email,
            nickname,
            password
        })
    })
    return response.status === 201? response.json() : null
}

export async function loginUser(email: string, password: string){
    const response = await apiFetch("/api/auth/login",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            email,
            password
        }),
        credentials: "include"
    })
    return response.status === 201? response.json() : null
}