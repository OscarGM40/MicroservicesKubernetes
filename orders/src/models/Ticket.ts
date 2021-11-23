import mongoose from "mongoose";
import { Order, OrderStatus } from "./Order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
   id: string;
   title: string;
   price: number;
}

export interface TicketDoc extends mongoose.Document {
   title: string;
   price: number;
   version: number;
   isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
   build(attrs: TicketAttrs): TicketDoc;
   findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

const TicketSchema = new mongoose.Schema({
   title: { type: String, required: true },
   price: { type: Number, required: true, min: 0 },
}, {
   toJSON: {
      transform(doc, ret) {
         ret.id = doc._id;
         delete ret._id;
      }
   }
})

TicketSchema.set('versionKey','version');
TicketSchema.plugin(updateIfCurrentPlugin);

// fijate que si creo un método,sea para statics o para methods lo tengo que definir 
TicketSchema.statics.build = (attrs: TicketAttrs) => {
   // const { id } = attrs;

   return new Ticket({
      _id: attrs.id,
      title: attrs.title,
      price: attrs.price,
   });
}

// es obvio que el argumento tiene que ser un objeto con las propiedaedes id y version,asinto no me seas prehistoric
TicketSchema.statics.findByEvent = (event: {
   id: string;
   version: number
}) => {
   return Ticket.findOne({
      _id: event.id,
      version: event.version,
   });
};


TicketSchema.methods.isReserved = async function () {

   const existingOrder = await Order.findOne({
      ticket: this as any,
      status: {
         $in: [
            OrderStatus.Created,
            OrderStatus.AwaitingPayment,
            OrderStatus.Complete,
         ]
      }
   })
   return !!existingOrder;
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema)
export { Ticket };