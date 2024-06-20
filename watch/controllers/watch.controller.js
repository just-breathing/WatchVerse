const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3ClientConfig } = require("../config/s3client");
const { GetObjectCommand } = require("@aws-sdk/client-s3");



// const generateSignedUrl = async (videoKey) => {
//     try {
//         const s3= new S3ClientConfig().s3Client;
//         const url = await getSignedUrl(s3, new GetObjectCommand({
//             Bucket: process.env.S3_PROCESSED_BUCKET_NAME,
//             Key: videoKey
//         }), { expiresIn: 3600 });
//         console.log("signed URL : ", url);
//         return url
//     } catch (err) {
//         if (err.message.includes('Resolved credential object is not valid')) {
//             console.error('Error generating pre-signed URL: Access denied. Please check your AWS credentials.');
//         } else {
//             console.error('Error generating pre-signed URL:', err);
//         }
//         throw err;
//     }
// };
const getUrl = async (req, res) => {
    try {
        const videoKey = req.query.key; 
        console.log('video key is ', videoKey);
        // const signedUrl = await generateSignedUrl(videoKey);
        const key=videoKey.replace(".","-");
        const fileName = Array.from(videoKey.split('.'))[0];
        const url = `https://${process.env.S3_PROCESSED_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${key}/${fileName}_master.m3u8`;
        res.json({ url });
        console.log(url);
    } catch (err) {
        console.error('Error generating pre-signed URL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
 }
 
module.exports = {getUrl};