# Ignore hadolint version pinning rules
# hadolint global ignore=DL3016,DL3018
FROM docker.io/library/node:18-alpine AS builder
ENV CONFIGURATION=production

RUN apk add --no-cache git npm \
  && rm -rf /var/cache/apk/*
RUN npm install -g @angular/cli

WORKDIR /app
COPY . /app
RUN npm install \
  && ng build "typescript-xmlrpc" --configuration $CONFIGURATION \
  && ng build "cobbler-api" --configuration $CONFIGURATION \
  && ng build "cobbler-frontend" --configuration $CONFIGURATION

FROM docker.io/library/nginx:1.21-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/docker/*.sh /docker-entrypoint.d/
COPY --from=builder /app/dist/cobbler-frontend /usr/share/nginx/html

