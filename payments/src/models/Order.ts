

import { OrderStatus } from '@oscargmk8s/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// interfaz sólo para el tipado
interface OrderAttrs {
   id: string;
   version: number;
   userId: string;
   price: number;
   status: OrderStatus;
}
// en el doc no es necesario el id pues un documento va a tener uno
interface OrderDoc extends mongoose.Document {
   version: number;
   userId: string;
   price: number;
   status: OrderStatus;
}
// el Modelo es la Coleccion,no el documento,lógicamente build es de la coleccion
interface OrderModel extends mongoose.Model<OrderDoc> {
   build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema({
   userId: { type: String, required: true, },
   price: { type: Number, required: true, },
   status: { type: String, required: true, },
   // no meto la version porque lo va a gestionar el plugin
   }, {
   toJSON: {
      transform(doc, ret) {
         ret.id = ret._id;
         delete ret._id;
      },
   },
})

OrderSchema.set('versionKey','version');
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttrs) => {

   return new Order({
      _id: attrs.id,
      version: attrs.version,
      price: attrs.price,
      userId: attrs.userId,
      status: attrs.status,
   })
}
 
const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);
export { Order };