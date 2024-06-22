FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

#Run prisma migration
RUN npm install @prisma/client
RUN npm install prisma --save-dev


COPY . .    

RUN chmod +x /app/startup.sh

EXPOSE 6003


# Run the startup script
CMD ["/bin/sh", "/app/startup.sh"]


