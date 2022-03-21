FROM node:12-alpine
WORKDIR /app
COPY . .
RUN npm i
CMD ["node", "/app/app.js"]