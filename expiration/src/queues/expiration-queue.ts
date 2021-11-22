import Queue  from "bull";


interface Payload {
   orderId: string;

}
// recuerda que los avisos que envie Kutxabank nunca van a usar enlaces a externos
// el nombre de la QueueGroup podría ser cualquier String(en este caso order:expiration tiene mucho sentido)
// el segundo argumento es un objeto con las options
const expirationQueue = new Queue<Payload>("order:expiration",{
   redis: {
      host: process.env.REDIS_HOST,
   }
})

// job is wrapping the payload,the data,which is orderId:'sfsf' 
expirationQueue.process(async (job) => {
   console.log("I want to publish an expiration:complete event for orderId", job.data.orderId);
});

export { expirationQueue };
