FROM node:10-alpine

WORKDIR /home/app

COPY package.json package-lock.json ./

RUN apk --no-cache --virtual build-dependencies add \
  python \
  make \
  g++ \
  && npm install \
  && apk del build-dependencies

COPY . .

EXPOSE 3000

CMD npm start