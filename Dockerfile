FROM node:14 AS build

WORKDIR /app

ADD ./react-app/package*.json /app/react-app/
ADD ./server/package*.json /app/server/
ADD ./bin/install-all.sh /app/bin/
RUN ./bin/install-all.sh
ADD . /app
RUN ./bin/test-all.sh
RUN ./bin/prepare-deploy.sh

FROM gcr.io/distroless/nodejs:14
COPY --from=build /app/build /build
WORKDIR /build
CMD ["src/server.js"]
