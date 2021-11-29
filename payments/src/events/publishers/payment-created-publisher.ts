


import { PaymentCreatedEvent, Publisher, Subjects } from '@oscargmk8s/common';
import { Message } from 'node-nats-streaming';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

}