# build
FROM node:16 as build

WORKDIR /app

RUN npm i -g pnpm

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm i

COPY ./ ./

RUN pnpm build

# run
FROM nginx

COPY --from=build /app/dist /dist
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./mime.types /etc/nginx/mime.types

EXPOSE 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
