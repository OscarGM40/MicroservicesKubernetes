import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) 
  {
    throw new Error('JWT_KEY must be defined manually in the cluster!');
  }
  
  if (!process.env.MONGO_URI) 
  {
    throw new Error('MONGO_URI must be provided for auth-depl.yaml');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { // fijate que auth-mongo-srv es el Service ClusterIP,lo añadiré un PVC,pero necesitaré ese Service también! También creo la base de datos 'auth' al conectar
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Connected to database ${mongoose.connection.name}`);
    console.log('ci added')
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Auth service up on port 3000");
  });
};

start();
