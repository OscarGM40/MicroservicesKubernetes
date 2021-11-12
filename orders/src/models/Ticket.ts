import mongoose from "mongoose";
import { Order, OrderStatus } from "./Order";


interface TicketAttrs {
   id: string;
   title: string;
   price: number;
}

export interface TicketDoc extends mongoose.Document {
   title: string;
   price: number;
   isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
   build(attrs: TicketAttrs): TicketDoc;
}

const TicketSchema = new mongoose.Schema<TicketDoc>({
   title:{type:String, required:true},
   price:{type:Number, required:true,min:0},
}, {
   versionKey:false,
   toJSON:{
      transform(doc,ret){
         ret.id = doc._id;
         delete ret._id;
      }
   }
})
// fijate que si creo un método lo tengo que definir 
TicketSchema.statics.build = (attrs:TicketAttrs) => {
   const { id,...rest} = attrs;

   return new Ticket({
      _id: attrs.id, 
      ...rest,
   });
}


TicketSchema.methods.isReserved = async function() {
   
   const existingOrder = await Order.findOne({
      ticket: this,
      status:{
         $in:[
            OrderStatus.Created,
            OrderStatus.AwaitingPayment,
            OrderStatus.Complete,
         ]
      }
   })
   return !!existingOrder;
}


const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',TicketSchema)
export { Ticket };