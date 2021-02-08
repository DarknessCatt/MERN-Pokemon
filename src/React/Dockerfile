FROM node:15.7.0-alpine3.10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./app/package.json ./

RUN npm install

CMD ["npm", "start"]
