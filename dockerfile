# Dockerfile for Frontend
FROM node:14

WORKDIR /app

# Копирование package.json и установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование остального кода и сборка
COPY . .
RUN npm run build

# Указываем порт и команду запуска
EXPOSE 3000
CMD ["npm", "start"]
