FROM docker.io/library/node:16-alpine AS BUILDER

RUN apk add --update git npm \
  && rm -rf /var/cache/apk/*
RUN npm install -g @angular/cli

WORKDIR /app
COPY . /app
RUN npm install
RUN ng build "typescript-xmlrpc"
RUN ng build "cobbler-api"
RUN ng build "cobbler-frontend"

FROM docker.io/library/nginx:1.21-alpine
WORKDIR /usr/share/nginx/html
COPY --from=BUILDER /app/dist/cobbler-frontend /usr/share/nginx/html

