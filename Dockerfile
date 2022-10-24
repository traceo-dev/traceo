# APP
FROM node:16-alpine3.15 as app-builder

WORKDIR /traceo

COPY ./app/package.json ./
COPY ./app/yarn.lock ./

RUN yarn install

COPY ./app/tsconfig.json ./
COPY ./app .

ENV REACT_APP_API_URL=docker.host.internal
ENV REACT_APP_SOCKET_URL=docker.host.internal
ENV NODE_ENV=production

RUN yarn build

# SERVER
FROM node:16-alpine3.15 as server-builder

WORKDIR /traceo

COPY package*.json ./

RUN yarn install
COPY . .

ENV NODE_ENV=production \
    APP_ORIGIN=docker.host.internal

RUN yarn build

# FINAL
# FROM node:16-alpine3.15
FROM alpine:3.15

WORKDIR /traceo

# RUN apk add --no-cache ca-certificates bash tzdata musl-utils
# RUN apk add --no-cache openssl ncurses-libs ncurses-terminfo-base --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main
# RUN apk upgrade ncurses-libs ncurses-terminfo-base --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main
# RUN apk info -vv | sort

RUN apk --no-cache add nodejs yarn --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

COPY --from=app-builder /traceo ./app
COPY --from=server-builder /traceo .

EXPOSE 8080

COPY ./run.sh /run.sh

ENTRYPOINT [ "./run.sh" ]