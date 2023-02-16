#!/bin/sh

set -e

SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

NODE_ENV=production         \
    JWT_SECRET=$SECRET      \
        node dist/main