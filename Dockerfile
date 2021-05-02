FROM node:10-alpine

# Create directories
RUN mkdir -p /home/node/neurone-sg/node_modules && chown -R node:node /home/node/neurone-sg

# Set workdirectory
WORKDIR /home/node/neurone-sg

# Copy package files
COPY Server/package*.json ./

USER node

# Install backend dependencies
RUN npm install

# Copy backend code
COPY --chown=node:node Server/ ./

# Copy frontend code
COPY --chown=node:node Client/ ./ui

# Build frontend
RUN cd ui && npm install @angular/cli && npm install && npm run build
RUN cd ui && cp -R ./dist/neurone-sg/ ../public/ && ls ../public

# Expose port
EXPOSE 3002

# Run
CMD [ "node", "Server/app.js" ]