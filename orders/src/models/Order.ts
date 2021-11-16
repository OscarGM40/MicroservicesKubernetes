import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@oscargmk8s/common';
import { TicketDoc } from './Ticket';

export { OrderStatus };


interface OrderAttrs {
   userId: string;
   status: OrderStatus;
   expiresAt: Date;
   ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
   userId: string;
   status: OrderStatus;
   expiresAt: Date;
   ticket: TicketDoc;
   version:number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
   build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema({
   userId: { type: String, required: true },
   status: { 
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
      required: true },
   expiresAt:{ type: mongoose.Schema.Types.Date },
   ticket:{type: mongoose.Schema.Types.ObjectId,ref:'Ticket'}
},{
   // versionKey:false,
   toJSON:{
      transform(doc,ret){
         ret.id = ret._id;
         delete ret._id; 
      }
   }
})

OrderSchema.set('versionKey','version');
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs:OrderAttrs) => {
   return new Order(attrs);
}

const Order = mongoose.model<OrderDoc,OrderModel>('Order',OrderSchema);
export { Order };
