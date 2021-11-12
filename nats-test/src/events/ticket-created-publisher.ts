import { Publisher } from "./base-publisher";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";


// l crear la subclase ya le paso el canal,luego no tendré que especificarlo más
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
   // subject: Subjects.TicketCreated = Subjects.TicketCreated;
   readonly subject = Subjects.TicketCreated;

}