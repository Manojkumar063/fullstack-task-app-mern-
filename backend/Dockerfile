FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm ci --only=production
COPY . .
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
EXPOSE 5000
CMD ["node", "server.js"]
