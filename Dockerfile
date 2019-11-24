FROM node:9
MAINTAINER Mike Harris "hello@mikemjharris.com"

ADD package.json /tmp/package.json
RUN cd /tmp && npm --no-color install
RUN mkdir -p /var/www/ && cp -a /tmp/node_modules /var/www/

ADD . /var/www/

WORKDIR /var/www/

RUN npm install 

RUN npm run build-prod

CMD npm start

EXPOSE 8001

