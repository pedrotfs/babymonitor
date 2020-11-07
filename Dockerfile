FROM node:alpine

#app dir
WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "npm", "start"]