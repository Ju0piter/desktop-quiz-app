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

    return fetch(path, {...options,headers,});
}