
import { Publisher, Subjects, TicketUpdatedEvent } from "@oscargmk8s/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
   readonly subject =  Subjects.TicketUpdated;
}