FROM node:19-slim

COPY . .

RUN npm install --force

EXPOSE 3333

CMD ["npm", "run", "start:dev"]