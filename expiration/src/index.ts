import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";


const start = async () => {
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

    console.log(`Connected to Redis DB`);

  } catch (err) {
    console.error(err);
  }
};

start();
