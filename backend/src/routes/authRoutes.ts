import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { AuthService} from "../services/AuthService.js";
import { TokenService } from "../services/TokenService.js";
import {
    RegisterDataSchema,
    LoginDataSchema,
    EmailParamSchema,
    NicknameParamSchema,
} from '../schemas/auth.js';

const authService = new AuthService()
const tokenService = new TokenService()

export const authRoutes: FastifyPluginAsyncTypebox = async(app) => {

    app.post("/api/auth/register", {
        schema: { body: RegisterDataSchema }
    }, async (request, reply) => {
        const { email, nickname, password } = request.body
        const availableEmail = authService.isAvailableEmail(email)
        const availableNickname = authService.isAvailableNickname(nickname)
        if (!availableEmail || !availableNickname) {
            return reply.code(401).send({ error: "User with this email or nickname already exists"})
        }
        try {
            const user = await authService.registerUser(email, nickname, password)
            return reply.code(201).send({ user })
        } catch (error) {
            request.log.error(error); 
            return reply.code(500).send({ error: "Internal Server Error" })
        }
    })

    app.get("/api/auth/register/available-email/:email", {
        schema: { params: EmailParamSchema }
    }, async (request, reply) => {
        const { email } = request.params
        const isAvailable = await authService.isAvailableEmail(email)
        return reply.code(200).send({"available": isAvailable})
    })

    app.get("/api/auth/register/available-nickname/:nickname", {
        schema: { params: NicknameParamSchema }
    }, async (request, reply) => {
        const { nickname } = request.params
        const isAvailable = await authService.isAvailableNickname(nickname)
        return reply.code(200).send({"available": isAvailable})
    })

    app.post("/api/auth/login", {
        schema: { body: LoginDataSchema }
    }, async (request, reply) => {
        const { email, password } = request.body
        try {
            const user = await authService.authenticateUser(email, password)
            if (!user) {
                return reply.code(401).send({ error: "Invalid email or password" })
            }
            const accessToken = app.jwt.sign({ id: user.id, email: user.email, nickname: user.nickname }, { expiresIn: '15m' })
            const refreshToken = await tokenService.generateRefreshToken(user.id)
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                path: '/api/auth',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return reply.code(201).send( {user, accessToken} )
        } catch (error) {
            request.log.error(error); 
            return reply.code(500).send({ error: "Internal Server Error" })
        }
    })

    app.post("/api/auth/refresh", async (request, reply) => {
        const refreshToken = request.cookies.refreshToken
        if (!refreshToken) {
            return reply.code(401).send({ error: "Refresh token is missing" })
        }
        try {
            const user = await tokenService.validateRefreshToken(refreshToken)
            if (!user) {
                return reply.code(401).send({ error: "Invalid or expired refresh token" })
            }
            const newAccessToken = app.jwt.sign({ id: user.id, email: user.email, nickname: user.nickname }, { expiresIn: '15m' })
            const newRefreshToken = await tokenService.generateRefreshToken(user.id)
            reply.setCookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                path: '/api/auth',
                maxAge: 30 * 24 * 60 * 60 * 1000 
            });
            return reply.code(201).send({ newAccessToken })
        } catch (error) {
            request.log.error(error); 
            return reply.code(500).send({ error: "Internal Server Error" })
        }
    })

    app.post("/api/auth/logout", async (request, reply) => {
        const refreshToken = request.cookies.refreshToken
        if (!refreshToken) {
            return reply.code(400).send({ error: "Refresh token is missing" })
        }
        try {
            await tokenService.revokeRefreshToken(refreshToken)
            return reply.code(200).send({ message: "Logged out successfully" })
        } catch (error) {
            request.log.error(error); 
            return reply.code(500).send({ error: "Internal Server Error" })
        } finally {
            reply.clearCookie('refreshToken', { path: '/api/auth' })
        }
    })

    app.get("/api/auth/me", { onRequest: [app.authenticate] }, async (request, reply) => {
        return reply.code(200).send(request.user)
    })
}