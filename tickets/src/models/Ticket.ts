import { Schema, model, Model, Document } from "mongoose";

// Interfaz que designa las propiedade requeridas para crear un nuevo Ticket.Es una simple interfaz para el tipado
interface TicketAttrs {
   title: string;
   price: number;
   userId: string;
}

// Interfaz que describe las propiedades que tendrá un Ticket una vez en la BBDD.Hereda de Document
interface TicketDoc extends Document {
   title: string;
   price: number;
   userId: string;
}

// Interfaz para el Model/Coleccion.Extiende de Model<T extends Document> donde T será la interface de arriba que heredó de Document
// Aqui solo digo que implemetaré el método build,pero ese método lo desarrollo más abajo y como estático además
interface TicketModel extends Model<TicketDoc> {
   build(attrs: TicketAttrs):TicketDoc;
}

const ticketSchema = new Schema<TicketDoc>({
   title: {
      type: String,
      required: true,
   },
   price: { 
      type: Number,
      required:true
   },
   userId: {
      type: String,
      required:true
   }
},{
   versionKey:false,
   toJSON:{
      transform(doc,ret){
         ret.id = doc._id;
         delete ret._id;
      }
   }
});

// ojo con usar arrow funcions y perder el contexto
// vamos a crear el método build para tener autocompletado
ticketSchema.statics.build = (attrs: TicketAttrs) => {
   return new Ticket(attrs);
}


const Ticket = model<TicketDoc,TicketModel>('Ticket',ticketSchema);

export { Ticket };