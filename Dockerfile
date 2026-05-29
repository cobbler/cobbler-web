# Ignore hadolint version pinning rules
# hadolint global ignore=DL3016,DL3018
FROM docker.io/library/node:20-alpine AS builder
ENV CONFIGURATION=production

RUN apk add --no-cache git npm \
  && rm -rf /var/cache/apk/*
RUN npm install -g @angular/cli

WORKDIR /app
COPY . /app
RUN npm install \
  && ng build "typescript-xmlrpc" --configuration=$CONFIGURATION \
  && ng build "cobbler-api" --configuration=$CONFIGURATION \
  && ng build "cobbler-frontend" --configuration=$CONFIGURATION

FROM docker.io/nginxinc/nginx-unprivileged:1.31-alpine
WORKDIR /usr/share/nginx/html
USER 0
RUN ["rm", "index.html", "50x.html"]
USER 101
COPY --from=builder /app/docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/docker/*.sh /docker-entrypoint.d/
COPY --from=builder /app/dist/cobbler-frontend/browser /usr/share/nginx/html
