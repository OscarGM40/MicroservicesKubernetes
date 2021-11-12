

import { Publisher, Subjects, TicketCreatedEvent } from "@oscargmk8s/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
   readonly subject =  Subjects.TicketCreated;
}