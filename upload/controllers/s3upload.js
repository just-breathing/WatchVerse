const {  CompleteMultipartUploadCommand, ListPartsCommand, CreateMultipartUploadCommand, UploadPartCommand } = require("@aws-sdk/client-s3");
const { pushVideoForEncodingToKafka } = require("./kafka.controller");
const { createVideo } = require("./db.controller");
const {S3ClientConfig} = require("../config/s3client")

async function initializeUpload(req, res) {

  try {
    const s3Client = new S3ClientConfig().s3Client;
    console.log("Initializing Upload .....................");
    const { fileName } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      ContentType: "video/mp4"
    };

    const multipartParams = await s3Client.send(new CreateMultipartUploadCommand(params));
    const uploadID = multipartParams.UploadId;

    res.status(200).json({ uploadID });
  } catch (err) {
    console.error("Error initializing upload:", err);
    res.status(500).send("Upload initialization failed");
  }
  finally{
    console.log("Upload Initialized.......................");
  }
}


 const uploadChunk = async (req, res) => {
    try {

          const s3Client = new S3ClientConfig().s3Client;
          console.log("Initializing Upload .....................");

        console.log('Uploading Chunk .......................');
        const { fileName, chunkID, uploadID } = req.body;

        const chunkParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            UploadId: uploadID,
            PartNumber: parseInt(chunkID) + 1,
            Body: req.file.buffer,
        };
 
        const data = await s3Client.send(new UploadPartCommand(chunkParams));
        
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error uploading chunk:', err);
        res.status(500).send('Chunk could not be uploaded');
    }
 };


 const CompleteUpload = async (req, res) => {
    try {
        const s3Client = new S3ClientConfig().s3Client;
        console.log('Completing Multi part file  uplaod .......................');
        const { fileName, uploadID, title,author,description } = req.body;
        let params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            UploadId: uploadID,
        };

        const parts= await s3Client.send(new ListPartsCommand(params));
        const partsObj = parts.Parts.map((part)=>{
            return {PartNumber:part.PartNumber,ETag:part.ETag};
        })

        params = {
       ...params,
            MultipartUpload: {
                Parts: partsObj
            }
        };
        const { Location } = await s3Client.send(new CompleteMultipartUploadCommand(params));
       await pushVideoForEncodingToKafka(title,fileName);
       await createVideo(title, author, description, fileName);
        res.status(200).json({ success: true, Location });
    } catch (err) {
        console.error('Error Completing  multipart upload:', err);
        res.status(500).send('Multipart upload could not be completed');
    }
 };

module.exports = { initializeUpload,uploadChunk,CompleteUpload };