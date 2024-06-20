const KafkaConfig =require("../config/kafka");



 const pushVideoForEncodingToKafka = async(title, fileName) => {
    try {
        const message = {
            "fileName": fileName,
            "title": title
        }
        const kafkaconfig = new KafkaConfig()
        const msgs = [
            {
                key: "video",
                value: JSON.stringify(message)
            }
        ]
        await kafkaconfig.produce("transcode", msgs)
        console.log("Sent Data to Kafka");
 
    } catch (error) {
        console.log(`kafka error : ${error}`)
    }
}

module.exports = { pushVideoForEncodingToKafka }