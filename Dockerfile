FROM node:16 as build
# Create app directory
ENV NODE_ENV=production
WORKDIR /build
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY index.ts ./
COPY src ./src
RUN yarn --production=false && yarn build

FROM node:16
ENV NODE_ENV=production SUPPRESS_NO_CONFIG_WARNING=true NODE_CONFIG_DIR=/config:/app/config DATA_DIR=/config
WORKDIR /app
COPY --from=build /build/dist .
COPY package.json ./
COPY yarn.lock ./
COPY config/custom-environment-variables.json ./config/
COPY config/default.json ./config/
RUN yarn
CMD ["node", "index.js"]
VOLUME /config
