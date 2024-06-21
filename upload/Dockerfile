FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .    

#Run prisma migration
RUN npx prisma migrate dev --name init

#Run prisma generate
RUN npx prisma generate

EXPOSE 6001

CMD ["npm", "start"]