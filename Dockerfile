FROM docker.io/library/node:18-alpine AS builder

RUN apk add --update git npm \
  && rm -rf /var/cache/apk/*
RUN npm install -g @angular/cli

WORKDIR /app
COPY . /app
RUN npm install \
  && ng build "typescript-xmlrpc" \
  && ng build "cobbler-api" \
  && ng build "cobbler-frontend"

FROM docker.io/library/nginx:1.21-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist/cobbler-frontend /usr/share/nginx/html

