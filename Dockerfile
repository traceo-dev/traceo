# APP
FROM node:16-alpine3.15 as app-builder

WORKDIR /traceo

COPY ./app/package.json .
COPY ./app/yarn.lock .

RUN yarn install

COPY ./app/tsconfig.json .
COPY ./app .

ENV REACT_APP_API_URL host.docker.internal \
    REACT_APP_SOCKET_URL host.docker.internal \
    NODE_ENV production

RUN yarn build:prod

# SERVER
FROM node:16-alpine3.15 as server-builder

RUN apk add curl
# RUN curl -sf https://gobinaries.com/tj/node-prune | sh

WORKDIR /traceo

ENV NODE_ENV production \
    APP_ORIGIN host.docker.internal

COPY package*.json ./

RUN yarn install --production=true
RUN yarn global add typescript
# RUN node-prune

COPY . .

RUN tsc -p tsconfig.build.json

# FINAL
FROM alpine:3.15

WORKDIR /traceo

# RUN apk add --no-cache ca-certificates bash tzdata musl-utils
# RUN apk add --no-cache openssl ncurses-libs ncurses-terminfo-base --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main

RUN apk --no-cache add nodejs --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

COPY --from=app-builder /traceo/build ./app
COPY --from=server-builder /traceo/dist ./dist
COPY --from=server-builder /traceo/node_modules ./node_modules

EXPOSE 3000

COPY ./scripts/docker/run.sh /run.sh

ENTRYPOINT [ "/run.sh" ]