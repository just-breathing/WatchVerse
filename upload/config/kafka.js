const {Kafka} = require("kafkajs");
class KafkaConfig {
   constructor(){
       this.kafka = new Kafka({
           clientId: "wv-producer",
        //    brokers: ['localhost:9092','localhost:9093','localhost:9094'],
        brokers:["kafka1:29092","kafka2:29092","kafka3:29092"],
        })
       this.producer = this.kafka.producer()
       this.consumer = this.kafka.consumer({groupId: "Watch-Verse-uploader"})
   }

   async produce(topic, message){
       try {
            await this.producer.connect()
           console.log("kafka connected... : ")
           console.log("Producer Data : ", message)
           
           await this.producer.send({
               topic: topic,
               messages: message
           })     
       } catch (error) {
           console.log(error)
       }finally{
           await this.producer.disconnect()
       }  }

   async consume(topic , callback){
       try {
           await this.consumer.connect()
           await this.consumer.subscribe({topic: topic, fromBeginning: true})
        //    await this.consumer.run({
        //        eachMessage: async({
        //            topic, partition,message
        //        }) =>{
        //            const value = message.value.toString()
        //            callback(value)
        //        }
        //    })
         this.consumer.on('message', (message) => {
            const value = message.value.toString()
            callback(value)
        })
       } catch (error) {
           console.log(`kafka error : ${error}`)
       }
   }
}

module.exports = KafkaConfig;