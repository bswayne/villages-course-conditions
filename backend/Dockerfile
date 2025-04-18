# Use an official Node runtime as a parent image
FROM node:23-alpine AS builder

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Bundle app source
COPY . .

# Define environment variables (defaults, can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=3001
# FRONTEND_URL will be set at runtime via docker-compose or docker run
# FIREBASE_ADMIN_SDK_JSON_CONTENT will be set at runtime

EXPOSE 3001

# Define the command to run your app using node
CMD [ "node", "app.js" ]

# --- Optional Healthcheck ---
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
#   CMD curl -f http://localhost:3001/ || exit 1