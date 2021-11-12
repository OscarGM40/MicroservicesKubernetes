import request from 'supertest';
import { app } from '../../app';

// jest.setTimeout(30000);

it('returns a 201 on succesfull signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({ 
          email: 'test@test.com',
          password: 'password'
      })
      .expect(201);
},7000);

it('returns a 400 with an invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
          email: 'fdsfsdfs.com',
          password: 'password'
      })
      .expect(400);
},6000);

it('returns a 400 with an invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
          email: 'test@test.com',
          password: 'p'
      })
      .expect(400);
},6000);

it('returns a 400 with missing email and password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ })
      .expect(400);
    await request(app)
      .post('/api/users/signup')
      .send({ })
      .expect(400);
},6000);
 
it('disallows duplicate emails',async () =>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password: 'password'
    })
    .expect(201);

    return request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password: 'password'
    })
    .expect(400);

},5000);

it('sets a cookie after succesfull singup',async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
          email:'test@test.com',
          password: 'password'
      })
      .expect(201);

      expect(response.get('Set-Cookie')).toBeDefined();
})


