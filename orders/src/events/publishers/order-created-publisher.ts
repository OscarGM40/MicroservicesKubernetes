

import { Publisher, OrderCreatedEvent, Subjects } from '@oscargmk8s/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

// new OrderCreatedPublisher(natsWrapper.client).publish({});