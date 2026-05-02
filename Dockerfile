FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server.js ./server.js
COPY src ./src
COPY views ./views
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]
