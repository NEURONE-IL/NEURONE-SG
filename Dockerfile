FROM node:10-alpine

# Create directories
RUN mkdir -p /home/node/neurone-sg/node_modules && chown -R node:node /home/node/neurone-sg

# Set workdirectory
WORKDIR /home/node/neurone-sg

# Set npm global folder
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Copy package files
COPY Server/package*.json ./

# Set user
USER node

# Install backend dependencies
RUN npm install

# Copy backend code
COPY --chown=node:node Server/ ./

# Copy frontend code
COPY --chown=node:node Client/ ./ui

# Load frontend environment variables
ARG SERVER_ROOT
ARG NEURONE_URL

# Load port environment variable
ARG APP_PORT

# Build frontend
RUN npm install -g @angular/cli
RUN cd ui && npm install && ng build --prod --output-path ../public
# RUN cd ui && cp -R ./dist/neurone-sg/ ../public/

# Replace variables in env.js
RUN npm install -g envsub
RUN cd public/assets && envsub env.template.js env.js

# Expose port
EXPOSE ${APP_PORT}

# Run
CMD [ "node", "Server/app.js" ]