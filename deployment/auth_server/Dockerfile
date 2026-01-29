FROM node:20-alpine AS build

WORKDIR /app

COPY auth_server/package*.json ./

RUN npm ci

COPY auth_server/ .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist/

EXPOSE 3001

CMD ["node", "dist/server.js"]
