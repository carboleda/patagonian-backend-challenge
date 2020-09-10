FROM node:12.18.3

WORKDIR /usr/src

# Copy resources
COPY config/.env.production ./.env
COPY . ./server/

# Install depdendecies
RUN cd server; npm install --only=production

# Compile project
RUN cd server; npm run build

# Bind port and execute app
EXPOSE 8888
CMD ["node", "server/dist/src"]
