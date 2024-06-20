# Watch Verse - a Video Streaming Platform 
- used NEXT.Js  for UI and NODE.JS for micro services
- Kafka for asynchronous communication between microservices
- Docker compose to run 3 kafka brokers, postgres DB and Kafka UI
- upload, watch and transcoder microservices respectively built to upload a video to s3, transcode video to different formats to implement ABS Adaptive Bit rate Streaming - HLS
- used AWS S3 to store videos using 2 buckets one for processes videos and another one for unprocesses videos.
- used Postgres DB with prisma ORM to store video meta data such as author, description, title and file name.


# to run locally
- 
- first pull this repo and  run ```bash docker compose up```
- install dependencies in each service ```bash npm i ```
- add .env file to upload, watch and transcoder folders
    ```
    S3_ACCESS_KEY=<AWS S3 Access Key>
    S3_SECRET_ACCESS_KEY = <AWS  SECRET ACCESS KEY>
    S3_BUCKET_REGION = <BUCKET REGION>
    S3_BUCKET_NAME = <BUCKET NAME>
    S3_PROCESSED_BUCKET_NAME= <BUCKET NAME>
    DATABASE_URL = <postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public> 
    ```
- start individual services such as upload, watch and transcoder just go into each folder and in a different terminal enter ```run node index ```
- to start UI ```npm run dev```