import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export const authPlugin = fp(async (fastify: FastifyInstance) => {
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.code(401).send({ error: 'Invalid access token' })
        }
    });
});
