FROM node:lts-slim

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
	    && \
    mkdir /app /build-tmp /app/client

COPY . /build-tmp/

RUN cd /build-tmp \
        && \
    npm run deploy \
        && \
    cp -rt /app/ *.json node_modules server.js \
        && \
    cp -r client/dist /app/client/ \
	    && \
    rm -rf /build-tmp

USER node

WORKDIR /app

EXPOSE 5000

ENTRYPOINT [ "npm", "run", "start"]
