FROM node:12.15.0-buster-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates gnupg1 apt-transport-https dirmngr \
        && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 379CE192D401AB61 \
        && \
    echo "deb https://ookla.bintray.com/debian buster main" | tee  /etc/apt/sources.list.d/speedtest.list \
        && \     
    apt-get update \
        && \
    apt-get install -y --no-install-recommends speedtest \
        && \
    mkdir /app /build-tmp /app/client

COPY . /build-tmp/

RUN cd /build-tmp \
        && \
    npm run deploy \
        && \
    cp -rt /app/ *.json node_modules server.js \
        && \
    cp -r client/build /app/client/

WORKDIR /app
    
RUN rm -rf /build-tmp

EXPOSE 5000
CMD npm run start
