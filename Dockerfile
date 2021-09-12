FROM node:14-alpine

WORKDIR /app

COPY package.json /app

COPY . /app

RUN rm -rf node_modules/

RUN npm install

RUN npm update

CMD ["node", "server.js"]

EXPOSE 3000