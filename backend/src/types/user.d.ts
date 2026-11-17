interface User {
    id:number,
    email:string,
    nickname:string
}

interface RefreshToken {
    refreshToken: string;
}

export interface RegisterDataRequest {
    email: string;
    nickname: string;
    password: string;
}

export interface LoginDataRequest {
    email: string;
    password: string;
}