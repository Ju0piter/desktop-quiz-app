import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import type { User } from "../../generated/prisma/client.js";

type PublicUser = Pick<User, "id" | "email" | "nickname">

export class AuthService {
    async registerUser(email: string, nickname: string, password: string): Promise<PublicUser> {
        
        const hashedPassword = await bcrypt.hash(password, 10)
        return prisma.user.create({
            data: {
                email,
                nickname,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                nickname: true
            }
        });
        
    }

    async authenticateUser(email: string, password: string): Promise<PublicUser | null> {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return null
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return null
        }

        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname
        }
    }

    async isAvailableEmail(email: string): Promise<boolean> {
        const isAvailable = await prisma.user.findUnique({ where: { email } })
        return !isAvailable? true : false
    }

    async isAvailableNickname(nickname: string): Promise<boolean> {
        const isAvailable = await prisma.user.findUnique({ where: { nickname } })
        return !isAvailable? true : false
    }
}