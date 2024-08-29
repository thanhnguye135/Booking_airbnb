###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20 As development

WORKDIR /usr/src/app

COPY package*.json yarn*.lock ./

RUN yarn global add @nestjs/cli

RUN yarn install --force

COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma

RUN yarn run build

###################
# BUILD FOR PRODUCTION
###################

FROM node:20 As build

WORKDIR /usr/src/app

COPY package*.json yarn*.lock ./

RUN yarn global add @nestjs/cli

#In order to run 'yarn run build' we need access to the Nest CLI which is a dev dependency.
#In the previous development stage we ran 'yarn install' which installed all dependencies,
#so we can copy over the node_modules directory from the development image
COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

#Run the build command which creates the production bundle
RUN yarn run build

#Set NODE_ENV environment variable
ENV NODE_ENV production

#Running 'yarn install' removes the existing node_modules directory and passing in
# --production ensures that only the production dependencies are installed.
#This ensures that the node_modules directory is as optimized as possible
RUN yarn install --production --force && yarn cache clean --force

###################
# PRODUCTION
###################

FROM node:20 As production

WORKDIR /usr/src/app

#Copy the bundled code from the build stage to the production image
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY package*.json yarn*.lock ./

RUN yarn global add npm@10.8.2

CMD npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/main.js

