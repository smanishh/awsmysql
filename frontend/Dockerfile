FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist/angular-app/browser /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/certs

COPY certs/server.crt /etc/nginx/certs/server.crt
COPY certs/server.key /etc/nginx/certs/server.key

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
