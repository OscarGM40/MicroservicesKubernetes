import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  console.log('Starting...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined manually in the cluster!');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Mongo Uri must be provided in the depl.yaml for tickets microservice!');
  }
  
  if (!process.env.NATS_URL) {
    throw new Error('Nats_url must be provided in the depl.yaml for tickets microservice!');
  }
  
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Nats_client-id must be provided in the depl.yaml for tickets microservice!');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Nats_cluster_id must be provided in the depl.yaml for tickets microservice!');
  }


  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
     );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit();
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    
    await mongoose.connect(process.env.MONGO_URI, { // fijate que auth-mongo-srv es el Service ClusterIP,lo añadiré un PVC,pero necesitaré ese Service también! También creo la base de datos 'auth' al conectar
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Connected to database ${mongoose.connection.name}`);

  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Payments service up on port 3000");
  });
};

start();
