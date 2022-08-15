# For production mode

# FROM node:16-alpine as dependencies
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci

# FROM node:16-alpine as builder
# WORKDIR /app
# COPY . .
# COPY --from=dependencies /app/node_modules ./node_modules
# RUN npm run build

# FROM node:16-alpine as runner
# WORKDIR /app
# ENV NODE_ENV production

# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# CMD ["npm", "run", "start"]

# For development mode

FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
