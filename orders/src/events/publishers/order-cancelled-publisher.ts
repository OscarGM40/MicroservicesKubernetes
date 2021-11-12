


import { Publisher, Subjects, OrderCancelledEvent } from '@oscargmk8s/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}