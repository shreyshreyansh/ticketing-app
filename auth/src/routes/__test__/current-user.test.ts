import request from 'supertest';
import { app } from '../../app';

it('responds with the detail about the current user', async () => {
  // calls the global function declared in test env
  const cookie = await global.signup();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

  expect(response.body.currentUser).toEqual(undefined);
});
