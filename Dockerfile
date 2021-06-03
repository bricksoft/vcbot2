FROM node:14 as build
# Create app directory
ENV NODE_ENV=production
WORKDIR /build
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY index.ts ./
COPY src ./src
RUN yarn --production=false && yarn build

FROM node:14
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/dist .
COPY package.json ./
COPY yarn.lock ./
RUN yarn --production=true
CMD ["node", "index.js"]

VOLUME /app/config
