FROM node:20

WORKDIR /app/backend

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "backend/server.js"]