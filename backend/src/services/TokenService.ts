import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { User } from "../types/user.js";

export class TokenService {
    async generateRefreshToken(userId: number): Promise<string> {
        const refreshToken = crypto.randomBytes(64).toString("hex")
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: userId,
                expiresAt: expiresAt,
            },
        });

        return refreshToken
    }

    async validateRefreshToken(token: string): Promise<User | null> {
        const refreshToken = await prisma.refreshToken.findUnique({
            where: { token },
        });

        if (!refreshToken) {
            return null
        }

        if (refreshToken.expiresAt < new Date()) {
            await prisma.refreshToken.delete({
                where: { token },
            })
            return null
        }
        const user = await prisma.user.findUnique({
            where: { id: refreshToken.userId },
        })
        return user
    }

    async revokeRefreshToken(token: string) {
        await prisma.refreshToken.deleteMany({
            where: { token },
        })
    }
}