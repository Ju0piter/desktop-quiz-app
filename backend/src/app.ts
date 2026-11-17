import { config } from "dotenv"; 
import cors from "@fastify/cors";
import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from '@fastify/cookie';
import websocket from "@fastify/websocket";
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { authPlugin } from "./plugins/authPlugin.js";
import { authRoutes } from "./routes/authRoutes.js";
import { quizzesRoutes } from "./routes/quizRoutes.js";
import { roomRoutes } from "./routes/roomRoutes.js";

export async function buildApp() {
    config()
    const app = Fastify({
        logger: true,
    }).withTypeProvider<TypeBoxTypeProvider>()
    await app.register(cors, {origin: 'http://127.0.0.1:5173', credentials: true})
    await app.register(websocket)
    app.register(authPlugin)
    if (process.env.SECRET_JWT && process.env.SECRET_COOKIE) {
        app.register(fastifyCookie, { secret: process.env.SECRET_COOKIE})
        app.register(fastifyJwt, {secret: process.env.SECRET_JWT})
    } else { throw new Error("SECRET_JWT and SECRET_COOKIE must be set in environment variables")}

    app.register(authRoutes)
    app.register(quizzesRoutes)
    app.register(roomRoutes)

    return app
}
