import { FastifyRequest, FastifyReply } from 'fastify';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { id: number; email: string, nickname:string }
        user: { id: number; email: string, nickname: string }
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
}
