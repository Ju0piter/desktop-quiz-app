import { buildApp } from "./app.js";

const start = async () => {
    try{
        const app = await buildApp();
        const port = process.env.PORT || 3000;
        await app.listen({ port: Number(port), host: "0.0.0.0" });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
}

start()
