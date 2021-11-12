import request from "supertest";
import { app } from "../../app";

it('fails when a email which does not exists is supplied', async() => {
      await request(app)   
         .post('/api/users/signin'  )
         .send({  
            email:'test@test.com',  
            password: 'password' 
         }) 
         .expect(400);  //400 because the account does not exists yet
});

it('fails when the password is incorrect yet the user exists',async () => {
      await request(app)
         .post('/api/users/signup')
         .send({ 
            email:'test@test.com',
            password: 'password'
         })
         .expect(201)
      return request(app)
         .post('/api/users/signin')
         .send({
            email: 'test@test.com',
            password: '55j4k5j3k4'
         })
         .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
      await request(app)
         .post('/api/users/signup')
         .send({ 
            email: 'test@test.com',
            password: 'password'
         })
         .expect(201);
         
      const response = await request(app)
         .post('/api/users/signin')
         .send({
            email: 'test@test.com',
            password: 'password'
         })
         .expect(200);

      expect(response.get('Set-Cookie')).toBeDefined();
         
})
