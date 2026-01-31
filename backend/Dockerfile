FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/app.js ./app.js
COPY backend/config ./config
COPY backend/controllers ./controllers
COPY backend/db ./db
COPY backend/middleware ./middleware
COPY backend/routes ./routes
COPY backend/services ./services
COPY backend/server.js ./server.js

COPY frontend/src/utils /app/frontend/src/utils
COPY frontend/src/views /app/frontend/src/views

EXPOSE 3000

CMD ["npm", "start"]
