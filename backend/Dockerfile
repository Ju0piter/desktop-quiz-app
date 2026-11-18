FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts ./
COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]