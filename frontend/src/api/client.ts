import { API_URL } from "../config";

export async function apiFetch(
    path: string,
    options: RequestInit = {},
    token?: string,
    ): Promise<Response> {

    const headers = new Headers(
    options.headers,);

    if (token) {
        headers.set("Authorization",`Bearer ${token}`,);
    }

    return fetch(`${API_URL}${path}`, {...options,headers,});
}