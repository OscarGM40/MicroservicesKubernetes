import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear()

const stan = nats.connect('ticketing',randomBytes(6).toString('hex'),{
   url: 'http://localhost:4222'
})

stan.on('connect',() => {
   console.log('Listener connected to NATS')
   
   stan.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
   }) //fin close
   
   // en Nats se usan métodos encadenados para pasar las opciones
   //irán como tercer argumento del stan.subscribe()
   // recuerda que hay que pasar a Manual siempre
   /*    const options = stan
   .subscriptionOptions()
   .setManualAckMode(true)
   .setDeliverAllAvailable()
   .setDurableName('accounting-service') */
   
   // recuerda que setDeliver + setDurable necesitan el group 
   // stan.subscribe(channel)
   /*    const subscription = stan.subscribe('ticket:created','OrdersServiceQueueGroup',options); */
   
   /*    subscription.on('message', (msg: Message) => {
      console.log(`Message ${ msg.getSequence() } received`);
      console.log(JSON.parse( msg.getData() as string));
      msg.ack();
   }) */

   const listener = new TicketCreatedListener(stan);   
   listener.listen();
   
})

// SIGNAL INTERRUPTED ó SIGNT
process.on('SIGINT', () => stan.close());
// SIGNAL TERMINATED ó SIGTERM
process.on('SIGTERM', () => stan.close())