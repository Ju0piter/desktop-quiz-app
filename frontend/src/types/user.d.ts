export interface User {
    id: number;
    email: string;
    nickname: string;
}

export interface UserLoginResponse {
    user: User,
    accessToken: string
}