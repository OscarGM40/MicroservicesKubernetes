import request from 'supertest';
import { app } from '../../app'
import mongoose from 'mongoose';

jest.mock('../../nats-wrapper')

it('returns a 404 is the ticket is not found', async () => {
  const id =  new mongoose.Types.ObjectId().toHexString();
   await request(app) 
     .get(`/api/tickets/${id}`)
     .send()
     .expect(404)
    //  console.log(response.body)
    //  expect(response.status).toEqual(404);
})



it('returns the ticket whether the ticket is  found', async () => {
   //puedo guardar uno y tratar de pedirlo despues.Eso confirmará que se guardó!Hay mas opciones que esta
   const title = 'concert';
   const price = 20;

   const response = await request(app)
     .post('/api/tickets/')
     .set('Cookie',global.signin())
     .send( { title, price } )
     .expect(201); //realmente no testeo esto

   const ticketResponse = await request(app)
     .get(`/api/tickets/${response.body.id}`)
     .send()
     .expect(200); // este si es el test

   expect(ticketResponse.body.id).toEqual(response.body.id)
   expect(ticketResponse.body.price).toEqual(response.body.price)
})