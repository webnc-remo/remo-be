#_______________________________________________________________________________________________________________________
# Build dist
FROM node:20.13.1 AS dist
COPY package.json package-lock.json ./

RUN npm install --ignore-scripts

COPY ./src ./src
COPY ./nest-cli.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./

RUN npm run build:prod

#_______________________________________________________________________________________________________________________
# Build node
FROM node:20.13.1 AS node_modules
COPY package.json package-lock.json ./

RUN npm install --omit=dev --ignore-scripts

#_______________________________________________________________________________________________________________________
# Build image
FROM node:20.13.1

ARG PORT=3000
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules
COPY --from=dist package.json /usr/src/app/package.json

EXPOSE $PORT

CMD [ "npm", "run", "start:prod" ]
