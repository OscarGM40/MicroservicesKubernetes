import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app'; 
import request from "supertest";
// import jwt from "jsonwebtoken";

declare global {
   namespace NodeJS {
      interface Global{
         signin():Promise<string[]>;
      }
   }
}

let mongo: any;
//Antes de ejecutar cualquier test hay que levantar la DB
beforeAll(async () => { 
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

global.signin = async () => {
   const email = 'test@test.com';
   const password = 'password';

   const response = await request(app)
      .post('/api/users/signup')
      .send({
         email,password
      })
      .expect(201);

   const cookie = response.get('Set-Cookie');
      
   return cookie;
      
}