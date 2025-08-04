FROM node:24-alpine AS build-dependencies
COPY . /app
WORKDIR /app
RUN npm ci


FROM node:24-alpine AS build
COPY . /app/
COPY --from=build-dependencies /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build


FROM node:24-alpine AS runtime-dependencies
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev


# runtime
FROM node:24-alpine
COPY ./package.json package-lock.json /app/
COPY --from=runtime-dependencies /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
