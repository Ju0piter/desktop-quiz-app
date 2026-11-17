import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken, getMe, revokeRefresh } from '../api/auth';
import type { User } from '../types/user';

interface AuthContextType {
    accessToken: string | null,
    user: User | null,
    isLoading: boolean,
    setToken: (token: string | null) => void,
    login: (token: string, userData: User) => void,
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function initializeAuth() {
        try {
            const accessTokenData = await getAccessToken()

            if (accessTokenData) {
                setAccessToken(accessTokenData.newAccessToken)

                const userData = await getMe(accessTokenData.newAccessToken)

                if (userData) {
                    setUser(userData)
                }
            }

        } catch (error) {
            console.error('Ошибка инициализации авторизации:', error);
        } finally {
            setIsLoading(false)
        }
    }

    initializeAuth();
    }, []);

    const login = (token: string, userData: User) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        revokeRefresh()
    };

    return (
        <AuthContext.Provider value={{ accessToken, user, isLoading, setToken: setAccessToken, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
    return context;
};
