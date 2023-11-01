FROM node:16
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
EXPOSE 3000
ENV NODE_COMMAND=dev

# If you want to use a different command, pass the NODE_COMMAND env variable to 
# docker-compose up --build

# Ex. NODE_COMMAND=build docker-compose up --build

ENTRYPOINT ["sh", "-c", "./wait-for-it.sh db:3306 --timeout=60 -- npx prisma migrate dev && npm run $NODE_COMMAND"]