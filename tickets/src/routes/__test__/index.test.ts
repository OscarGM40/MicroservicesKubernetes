import request from 'supertest';
import { app } from '../../app';

jest.mock('../../nats-wrapper')

describe('test en index o getall tickets', () => {
   
   const createTicket = () => request(app)
     .post('/api/tickets')
     .set('Cookie',global.signin())
     .send({
        title: 'Test',
        price: 1000
     })
   
   it('can fetch a list of tickets', async () => {
      
      await createTicket();
      await createTicket();
      await createTicket();

      const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)
      
        //   console.log(response)

      expect(response.body.length).toEqual(3);
      
   })



})