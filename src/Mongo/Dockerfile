FROM mongo:4.2.12-bionic

RUN mkdir /usr/src/mongo
COPY ./seed.json /usr/src/mongo
COPY ./populate.sh /docker-entrypoint-initdb.d/
WORKDIR /usr/src/mongo
