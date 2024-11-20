# Stage 1 - building node_modules and dist folder
FROM node:20.13.1-alpine3.20 as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Stage 2
FROM node:20.13.1-alpine3.20
WORKDIR /usr/src/app
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist dist
COPY package*.json ./
RUN npm prune --production && \
  chown -R node:node /usr/src/app
USER node
ENV NODE_ENV production
CMD [ "node", "dist/src/main.js" ]
