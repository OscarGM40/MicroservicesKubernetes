import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";


// este custom Event deberá tener un subject
interface Event {
   subject: Subjects;
   data:any;
}

// fijate que en TS puedo acceder al genérico,no sólo se usa para definir reglas de herencia => T['subject']
export abstract class Listener<T extends Event> {
   abstract subject:T['subject'];
   abstract queueGroupName:string;
   private client: Stan;  
   abstract onMessage(data:T['data'],msg:Message):void;
   private ackWait = 5 * 1000; // hay 5 secs para confirmar

   subscriptionOptions() {
      return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName);
   }

   listen(){
      const subscription = this.client.subscribe(
         this.subject,
         this.queueGroupName,
         this.subscriptionOptions()
      );

      subscription.on('message', (msg: Message) => {
         console.log(
            `Message received: ${this.subject} / ${this.queueGroupName}`
         );
         const parsedData = this.parseMessage(msg);
         this.onMessage(parsedData,msg);
      })
   }

   parseMessage(msg: Message){
      const data = msg.getData();
      return typeof data === 'string' 
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf-8'))
   }

   constructor(client: Stan) {
      this.client = client;
   }
}