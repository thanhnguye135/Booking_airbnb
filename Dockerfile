FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y iputils-ping && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:dev"]