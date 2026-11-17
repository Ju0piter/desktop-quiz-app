import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
        proxy: {
            "/api": {
                target : "http://localhost:3000",
                changeOrigin: true,
                secure: true
                },
            "/ws": {
                target: "ws://localhost:3000",
                ws: true,
                changeOrigin: true
                }
            }
    }
})
