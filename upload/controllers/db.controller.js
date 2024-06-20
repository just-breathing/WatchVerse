const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function createVideo(title, author = "", description = "", fileName) {
    fileName = fileName.replace(".", "-");
    const newVideo = await prisma.Video.create({
        data: {
            title,
            description,
            author,
            fileName
        }
    });
    console.log(`Created new video with ID: ${newVideo.id}`);
}

module.exports = { createVideo };



