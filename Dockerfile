FROM node:8-alpine

COPY . /src

WORKDIR /src

RUN npm install

CMD [ "npm", "start" ]
