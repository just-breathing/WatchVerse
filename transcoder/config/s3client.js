const { S3Client } = require("@aws-sdk/client-s3");


class S3ClientConfig {

    constructor() {
        this.s3Client = new S3Client({
            region:process.env.S3_BUCKET_REGION,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            }
          });
    }


}

module.exports = {S3ClientConfig}