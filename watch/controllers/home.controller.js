const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllVideos = async(req, res) => {
    const prisma = new PrismaClient();
    try {
        const allData = await prisma.Video.findMany();
        console.log(allData);
        return res.status(200).send(allData);
      } catch (error) {
        console.log('Error fetching data:', error);
        return res.status(400).send();
      }
}

module.exports = {getAllVideos}