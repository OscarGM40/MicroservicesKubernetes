import {Schema,model,Document,Model} from "mongoose";
import { Password } from '../services/password';

// Interfaz que describe las propiedades que son requeridas para crear un nuevo User
interface UserAttrs {
   email: string;
   password: string;
}

//Interfaz para un único User
export interface UserDoc extends Document{
  email: string;
  password: string;
}

// Interfaz que describe las propiedades que un UserModel tiene
// Esto especifica las propiedades que tiene que tener toda la coleccion,a diferencia del Document que es para un Documento
interface UserModel extends Model<UserDoc> {
   build(attrs: UserAttrs):UserDoc;
}
 
const userSchema = new Schema<UserDoc>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
},{
  toJSON:{
    transform(doc,ret){
      ret.id = ret._id;
      delete ret._id;
      delete ret.password; 
      delete ret.__v; // versionKey:false también hace lo mismo
    }
  }
});
//usar 'function' me permite tener con 'this' scope sobre el current user que está siendo guardado.Con una arrow function subiria el contexto y perdería visión sobre él
userSchema.pre('save',async function(done){
  //al usuario se le suele dar la opcion de cambiar el email,en este caso no es necesario cambiar la password.Por eso sólo lo hacemos si se modifica la password.Fijate que crear un usuario para mongoose significa modificar una password también y entrará por esta lógica
  if(this.isModified('password')){
    //fijate como accedo con this.get(prop)
    const hashed = await Password.toHash( this.get('password'));
    this.set('password',hashed);  
  }
  done(); //finalizo la asincronía,parece que hay problemas y desde cierta versión pasó a simplemente done; <- yo no los tengo

});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}; 

const User = model<UserDoc,UserModel>('User',userSchema);

/* Ya no se crea con new User sino con Model.build
 * es un método estático asinto -_-;
 * const user = User.build({
 * email:"test@test.com",
 * password:"2321"
}) */


export { User};
