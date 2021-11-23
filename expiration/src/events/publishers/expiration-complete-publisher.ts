

import { Subjects, Publisher, ExpirationCompleteEvent } from "@oscargmk8s/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
   readonly subject = Subjects.ExpirationComplete;
}