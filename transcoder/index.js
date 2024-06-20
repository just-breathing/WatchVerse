const KafkaConfig = require("./config/kafka");
const { transcodeAndSaveToS3 } = require("./utils/transcode");


const kafka = new KafkaConfig()
kafka.consume("transcode", (value) => {
    const { fileName, title } = JSON.parse(value)
    transcodeAndSaveToS3(fileName);
})
    




