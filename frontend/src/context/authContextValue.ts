import { createContext } from 'react';
import type { User } from '../types/user';

export interface AuthContextType {
    accessToken: string | null
    user: User | null
    isLoading: boolean
    setToken: (token: string | null) => void
    login: (token: string, userData: User) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)