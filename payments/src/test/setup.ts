import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
   namespace NodeJS {
      interface Global{
         signin(id?:string):string[];
      }
   }
}
// va aqui porque se va a requirir realmente rápido esta env
process.env.STRIPE_KEY ='sk_test_51JfryfBi2097CnFhxxFcHZ4xLJHfwJnU7NZIxrKUTRXGX27xXTlbTDWtvjZkR8JjNtti54NMnJjsCTJmAZZBVqSJ00uH0nX3k1'

let mongo: any;
//Antes de ejecutar cualquier test hay que levantar la DB
beforeAll(async () => { 
   // es el mejor sitio realmente ya que todos quieren ese fake client:Stan.Pero no funciona por algún motivo que no explicó Stephen(diria que es la ruta)
   // jest.mock('../nats-wrapper')
   process.env.JWT_KEY='cualquiercosa';
   process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
   
   mongo = new MongoMemoryServer();
   const mongoUri= await mongo.getUri();
   
   await mongoose.connect(mongoUri,{
      useNewUrlParser: true,
      useUnifiedTopology: true
   });
});

//Antes de cada test queremos limpiar todas las colecciones de datos
beforeEach(async () => {
   jest.clearAllMocks();
   const collections = await mongoose.connection.db.collections();
   
   for (let collection of collections) {
      await collection.deleteMany({});
   }
});

//Despues de todos los test queremos parar el mongodb-server en memoria y que mongoose se desconecte de él
afterAll(async () => {
   // Para evitar Memory Leaks usar este orden
   await mongoose.connection.close();
   await mongo.stop();
});  


// @ts-ignore
global.signin = (id?:string) => {
   // Build a JWT payload { id, email}
   const payload = {
      id: id || new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com',
   }
   // Create de JWT with jwt.sign
   const token = jwt.sign(payload,process.env.JWT_KEY!)
   
   // Build session Object { jwt: MY_JWT}
   const session = {jwt: token}
   
   // Turn that session into JSON
   const sessionJSON = JSON.stringify(session)
   
   // Take JSON and encode it as base64
   const base64 = Buffer.from(sessionJSON).toString('base64'); 
   
   // return a string that's the cookie with the encoded data
      return [`express:sess=${base64}`];  
}