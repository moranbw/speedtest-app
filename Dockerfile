FROM node:lts-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        apt-transport-https ca-certificates dirmngr gnupg1 iperf3 \
        && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 379CE192D401AB61 \
        && \
    echo "deb https://ookla.bintray.com/debian generic main" | tee  /etc/apt/sources.list.d/speedtest.list \
        && \     
    apt-get update \
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