ARG NODE_VERSION=20.16

FROM node:${NODE_VERSION}-alpine


WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Use production node environment by default.
ENV NODE_ENV production

# Copy the rest of the source files into the image.
COPY . .

# Build
RUN yarn build && \
    yarn cache clean

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD yarn s:start
