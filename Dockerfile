FROM node:10-alpine

RUN mkdir -p /home/node/neurone-sg/node_modules && chown -R node:node /home/node/neurone-sg

WORKDIR /home/node/neurone-sg

COPY Server/package*.json ./

USER node

RUN npm install

COPY --chown=node:node Server/ ./

EXPOSE 3002

CMD [ "node", "Server/app.js" ]