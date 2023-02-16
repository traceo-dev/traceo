# APP
FROM node:16-alpine3.15 as app-builder

ENV NODE_OPTIONS=--max_old_space_size=8000

WORKDIR /traceo

COPY ./public .
RUN yarn workspace @traceo/app install --frozen-lockfile

ENV REACT_APP_API_URL host.docker.internal \
    REACT_APP_SOCKET_URL host.docker.internal \
    REACT_APP_PERSIST_KEY traceo \
    NODE_ENV production

RUN yarn workspace @traceo/app build:prod

# SERVER
FROM node:16-alpine3.15 as server-builder

ENV NODE_OPTIONS=--max_old_space_size=8000

RUN apk add curl

WORKDIR /traceo

ENV NODE_ENV production \
    APP_ORIGIN host.docker.internal

COPY /lib/package*.json ./
COPY /public/packages/shared/traceo-types /public/packages/shared/traceo-types

RUN yarn install --production=true
RUN yarn global add typescript

COPY /lib .

RUN tsc -p tsconfig.build.json

# FINAL
FROM alpine:3.15

WORKDIR /traceo

# RUN apk add --no-cache ca-certificates bash tzdata musl-utils
# RUN apk add --no-cache openssl ncurses-libs ncurses-terminfo-base --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main

RUN apk --no-cache add nodejs --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

ENV NODE_OPTIONS=--max_old_space_size=8000

COPY --from=app-builder /traceo/packages/app/build ./app

COPY --from=server-builder /traceo/dist ./dist
COPY --from=server-builder /traceo/node_modules ./node_modules
COPY --from=server-builder /public/packages/shared/traceo-types ./node_modules/@traceo/types

EXPOSE 3000

COPY ./scripts/docker/run.sh /run.sh

ENTRYPOINT [ "/run.sh" ]