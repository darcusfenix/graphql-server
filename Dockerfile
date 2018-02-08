FROM node:latest
MAINTAINER Juan Crisostomo

RUN mkdir -p /opt/app
COPY . /opt/app
RUN cd /opt/app && npm install

WORKDIR /opt/app

ENV HOST 0.0.0.0

CMD ["npm", "run", "start"]
