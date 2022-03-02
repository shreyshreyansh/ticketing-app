import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
  await request(app).get('/api/tickets/fake-id').send().expect(404);
});

it('returns a ticket if the ticket is found', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'A great title',
      price: 10,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(response.body.title);
  expect(ticketResponse.body.price).toEqual(response.body.price);
});
