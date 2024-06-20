const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg")
const ffmpegStatic = require("ffmpeg-static")
const { S3ClientConfig } = require("../config/s3client"); 
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
ffmpeg.setFfmpegPath(ffmpegStatic)

dotenv.config();

const s3 = new S3ClientConfig().s3Client;
const bucketName = process.env.S3_BUCKET_NAME;
const hlsFolder = 'hls';

const transcodeAndSaveToS3 = async (videoFileName) => {
    console.log('Starting script');
    console.time('req_time');

    try {
        if (!fs.existsSync(hlsFolder)) {
            fs.mkdirSync(hlsFolder);
        }
        // Extract the file extension
        const fileExtension = videoFileName.split('.').pop();

        console.log('Downloading video file locally');
        const writeStream = fs.createWriteStream(`local.${fileExtension}`);
        const readStream = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: videoFileName }));
        readStream.Body.pipe(writeStream);
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        console.log(`Downloaded S3 video file locally: local.${fileExtension}`);


        const resolutions = [
            {
                resolution: '320x180',
                videoBitrate: '500k',
                audioBitrate: '64k',
            },
            {
                resolution: '854x480',
                videoBitrate: '1000k',
                audioBitrate: '128k',
            },
            {
                resolution: '1280x720',
                videoBitrate: '2500k',
                audioBitrate: '192k',
            },
        ];

        const variantPlaylists = [];
        for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
            console.log(`HLS conversion starting for ${resolution}`);
            const outputFileName = `${videoFileName.replace(
                `.${fileExtension}`,
                `_${resolution}.m3u8`
            )}`;
            const segmentFileName = `${videoFileName.replace(
                `.${fileExtension}`,
                `_${resolution}_%03d.ts`
            )}`;
            await new Promise((resolve, reject) => {
                ffmpeg(`./local.${fileExtension}`)
                    .outputOptions([
                        `-c:v h264`,
                        `-b:v ${videoBitrate}`,
                        `-c:a aac`,
                        `-b:a ${audioBitrate}`,
                        `-vf scale=${resolution}`,
                        `-f hls`,
                        `-hls_time 50`,
                        `-hls_list_size 0`,
                        `-hls_segment_filename ${hlsFolder}/${segmentFileName}`,
                        `-map 0:v:0`, // map only the video stream
                        `-map 0:a:0?`, // map only the audio stream
                    ])
                    .output(`${hlsFolder}/${outputFileName}`)
                    .on('start', (commandLine) => {
                        console.log(`Spawned ffmpeg with command: ${commandLine}`);
                    })
                    .on('progress', (progress) => {
                        console.log(JSON.stringify(progress));
                    })
                    .on('end', () => resolve())
                    .on('error', (err, stdout, stderr) => {
                        console.error('Error:', err.message);
                        console.error('ffmpeg stderr:', stderr);
                        console.error('ffmpeg stdout:', stdout);
                        reject(err);
                    })
                    .run();
            });
            const variantPlaylist = {
                resolution,
                outputFileName,
            };
            variantPlaylists.push(variantPlaylist);
            console.log(`HLS conversion done for ${resolution}`);
        }

        console.log(`HLS master m3u8 playlist generating`);
        let masterPlaylist = variantPlaylists
            .map((variantPlaylist) => {
                const { resolution, outputFileName } = variantPlaylist;
                const bandwidth =
                    resolution === '320x180'
                        ? 676800
                        : resolution === '854x480'
                        ? 1353600
                        : 3230400;
                return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
            })
            .join('\n');
        masterPlaylist = `#EXTM3U\n` + masterPlaylist;

        const masterPlaylistFileName = `${videoFileName.replace(
            `.${fileExtension}`,
            `_master.m3u8`
        )}`;
        const masterPlaylistPath = `${hlsFolder}/${masterPlaylistFileName}`;
        fs.writeFileSync(masterPlaylistPath, masterPlaylist);
        console.log(`HLS master m3u8 playlist generated`);

        console.log(`Deleting locally downloaded S3 video file`);
        fs.unlinkSync(`local.${fileExtension}`);
        console.log(`Deleted locally downloaded S3 video file`);

        console.log(`Uploading media m3u8 playlists and ts segments to S3`);

        // Upload HLS files to S3
        const uploadFiles = async (filePath, key) => {
            const fileContent = fs.readFileSync(filePath);
            const params = {
                Bucket: process.env.S3_PROCESSED_BUCKET_NAME,
                Key: key,
                Body: fileContent,
            };
           const res =  await s3.send(new PutObjectCommand(params));
           console.log(res);
           fs.unlinkSync(filePath);
        };

        const hlsFiles = fs.readdirSync(hlsFolder);
        for (const file of hlsFiles) {
            await uploadFiles(`${hlsFolder}/${file}`, `${videoFileName.replace(".", "-")}/${file}`);
        }

        console.log('All HLS files uploaded to S3');
        console.timeEnd('req_time');
    } catch (error) {
        console.error('Error:', error);
        console.timeEnd('req_time');
    }
};


module.exports = { transcodeAndSaveToS3 };