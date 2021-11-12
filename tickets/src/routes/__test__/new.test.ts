import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
// hacer mock a un file traerá el fake
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper')



it('has a route handler listening to /api/tickets for POST requests', async () => {
   const response = await request(app)
     .post('/api/tickets')
     .send({ });

     expect(response.status).not.toEqual(404);
    // es igual usar status que statusCode
    // console.log(response.status)
    // console.log(response.statusCode)
})

it('can only be accessed whether the user is signed in', async () => {
  // ahora que existe la ruta deberia devolver un 401 de NotAuthorized 
   const response = await request(app)
     .post('/api/tickets')
     .send({ });
     expect(response.status).toEqual(401)
    //  console.log(response.statusCode)
})

it('returns a status other than 401 if the user is signed in', async () => {
  //recuerda que hicimos un método en el objeto global (global.signin)
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({})
     expect(response.status).not.toEqual(401);
    // console.log(response.status)
  })
  
  it('returns an error if an invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie',global.signin())
      .send({
        title:'',
        price: 10
      }).expect(400)

    await request(app)
      .post('/api/tickets')
      .set('Cookie',global.signin())
      .send({
        price: 10
      }).expect(400)
})

it('returns an error if an invalid price is provided', async () => {

    await request(app)
      .post('/api/tickets')
      .set('Cookie',global.signin())
      .send({
        title:'titulo',
        price: -10
      }).expect(400)

    await request(app)
      .post('/api/tickets')
      .set('Cookie',global.signin())
      .send({
        title:'',
      }).expect(400)
})

it('creates a ticket with valid parametres ', async () => {
  // add in a check to make sure a ticket was saved 
  // dado que cada test se resetean las colecciones deberia haber 0
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0);
  
  await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({ 
      title:'titulo',
      price: 20
    })
    .expect(201)

  tickets = await Ticket.find({})

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
     
})

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')  
    .set('Cookie',global.signin())
    .send({
      title:'titulo',
      price:20
    })
    .expect(201);

    // console.log(natsWrapper,'nats')
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
})