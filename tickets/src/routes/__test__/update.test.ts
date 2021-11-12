import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper')

describe('pruebas en update ticket', () => {


   test('should returns a 404 if the provided id does not exists', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      await request(app)
         .put('/api/tickets/' + id)
         .set('Cookie', global.signin())
         .send({
            title: 'titulo',
            price: 40
         })
         .expect(404);
   })

   test('should returns a 401 if the user is not authenticated', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      await request(app)
         .put('/api/tickets/' + id)
         .send({
            title: 'titulo',
            price: 40
         })
         .expect(401);

   })

   test('should returns a 401 if the user is not the owner of the ticket', async () => {
      // es un post para crear
      const response = await request(app)
         .post('/api/tickets')
         .set('Cookie', global.signin())
         .send({
            title: 'titulo created',
            price: 44
         })

      //al ser ya random global.signin () seré otro user
      const updated = await request(app)
         .put(`/api/tickets/${response.body.id}`)
         .set('Cookie', global.signin())
         .send({
            title: 'titulo updated',
            price: 40
         })
         .expect(401);
      //debe seguir sin actualizarse 
      expect(updated.body.title).toBe(undefined)
   })

   test('should returns a 400 if the user provides an invalid price or title', async () => {
      const cookie = global.signin();
      // creo el post
      const response = await request(app)
         .post('/api/tickets')
         .set('Cookie', cookie)
         .send({
            title: 'titulo created',
            price: 44
         })

      // sin llamar a global.signin() mando valores inválidos
      await request(app)
         .put(`/api/tickets/${response.body.id}`)
         .set('Cookie', cookie)
         .send({
            title: '',
            price: 44
         })
         .expect(400);
      // ahora el precio negativo

      await request(app)
         .put(`/api/tickets/${response.body.id}`)
         .set('Cookie', cookie)
         .send({
            title: 'titulo',
            price: -10
         })
         .expect(400);

   })

   it('updates the ticket provided valid inputs', async () => {
      const cookie = global.signin();
      //debo crear uno,obviamente
      const response = await request(app)
         .post('/api/tickets')
         .set('Cookie', cookie)
         .send({
            title: 'titulo',
            price: 10
         })
      // trato de actualizarlo
      await request(app)
         .put(`/api/tickets/${response.body.id}`)
         .set('Cookie', cookie)
         .send({
            title: 'titulo updated',
            price: 2000
         })
         .expect(200)

      // lo busco de nuevo
      const ticketResponse = await request(app)
         .get(`/api/tickets/${response.body.id}`)

      expect(ticketResponse.body.title).toEqual('titulo updated')
      expect(ticketResponse.body.price).toEqual(2000)
   });
   it('publishes an event after updating', async () => {
      const cookie = global.signin();
      const response = await request(app)
         .post('/api/tickets')
         .set('Cookie', cookie)
         .send({
            title: 'titulo',
            price: 10
         })
      await request(app)
         .put(`/api/tickets/${response.body.id}`)
         .set('Cookie', cookie)
         .send({
            title: 'titulo updated',
            price: 2000
         })
         .expect(200)
      expect(natsWrapper.client.publish).toHaveBeenCalled();
      // dos porque he creado y actualizado luego se ha llamado dos veces
      expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
   });
})
