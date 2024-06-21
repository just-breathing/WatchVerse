const {Kafka} = require("kafkajs");
class KafkaConfig {
   constructor(){
       this.kafka = new Kafka({
           clientId: "wv-consumer",
           brokers: ['localhost:9092','localhost:9093','localhost:9094'],
        // brokers:["kafka1:29092","kafka2:29092","kafka3:29092"]

           retry: {
            retries: 5,
            initialRetryTime: 1000,
          },
        })
       this.producer = this.kafka.producer()
       this.consumer = this.kafka.consumer({groupId: "WVC-uploader"})
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
           await this.consumer.subscribe({topics:[topic],fromBeginning: true})
           await this.consumer.run({
               eachMessage: async({
                   topic, partition,message
               }) =>{
                   const value = message.value.toString()
                   callback(value)
               }
           })
        
       } catch (error) {
           console.log(error)
       }
   }
}

module.exports = KafkaConfig;