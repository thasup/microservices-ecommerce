# Development image (used by skaffold) — runs the Next.js dev server
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
