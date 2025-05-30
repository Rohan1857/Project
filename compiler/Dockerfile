FROM node:20-alpine

RUN apk update && \
    apk add --no-cache g++ openjdk17-jdk python3 py3-pip

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "compiler.js"]