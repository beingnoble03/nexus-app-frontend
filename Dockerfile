FROM node

WORKDIR /frontend

COPY . .

RUN npm i --force

EXPOSE 3000