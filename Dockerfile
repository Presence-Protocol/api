# Dockerfile

FROM node:current-alpine3.20
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json yarn.lock .
RUN  yarn
COPY . .