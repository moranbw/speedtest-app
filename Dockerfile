FROM node:lts-slim AS build

COPY client/package*.json /client/
RUN npm --prefix ./client install ./client
COPY server/package*.json /server/
RUN npm --prefix ./server install ./server

COPY . .

RUN npm --prefix ./server run build
RUN npm --prefix ./client run build

FROM node:lts-slim

COPY --from=build /dist /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        iperf3 apt-transport-https ca-certificates curl gnupg \
        && \
    curl -o script.deb.sh https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh \
        && \
    chmod +x script.deb.sh && ./script.deb.sh && rm script.deb.sh \
        && \
    apt-get install -y --no-install-recommends speedtest \
        && \
    rm -rf /var/lib/apt/lists/* \

USER node

WORKDIR /app

EXPOSE 5000

ENTRYPOINT [ "node", "index.js"]
