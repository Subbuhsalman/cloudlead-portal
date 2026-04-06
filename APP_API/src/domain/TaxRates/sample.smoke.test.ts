// const request = require('supertest');
// const app = require('../../src/app'); // Adjust path as necessary

// describe('Entity Routes Smoke Tests', () => {
//   let taxRatesId;

//   describe('POST /', () => {
//     it('should create a new entity and return 201', async () => {
//       const res = await request(app)
//         .post('/api/taxRates') // Adjust path as necessary
//         .send({ name: 'Test Entity', description: 'Test Description' }); // TaxRates payload

//       expect(res.statusCode).toBe(201);
//       expect(res.body).toHaveProperty('id');
//       taxRatesId = res.body.id; // Store for later tests
//     });
//   });

//   describe('PUT /:id', () => {
//     it('should update the entity and return 200', async () => {
//       const res = await request(app)
//         .put(`/api/taxRates/${taxRatesId}`)
//         .send({ name: 'Updated Test Entity' });

//       expect(res.statusCode).toBe(200);
//     });
//   });

//   describe('DELETE /:id', () => {
//     it('should delete the entity and return 204', async () => {
//       const res = await request(app).delete(`/api/taxRates/${taxRatesId}`);
//       expect(res.statusCode).toBe(204);
//     });
//   });

//   describe('GET /:id', () => {
//     it('should return 404 for a deleted entity', async () => {
//       const res = await request(app).get(`/api/taxRates/${taxRatesId}`);
//       expect(res.statusCode).toBe(404);
//     });

//     it('should return 200 for a valid entity', async () => {
//       // Creating a new entity for testing GET
//       const newEntity = await request(app)
//         .post('/api/taxRates')
//         .send({ name: 'Another Test Entity', description: 'For GET test' });

//       const res = await request(app).get(`/api/taxRates/${newEntity.body.id}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('name', 'Another Test Entity');
//     });
//   });

//   describe('GET /list/paginated', () => {
//     it('should return a paginated list and status 200', async () => {
//       const res = await request(app).get('/api/taxRates/list/paginated?page=1&size=10');
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('items');
//       expect(res.body.items).toBeInstanceOf(Array);
//     });
//   });

//   describe('GET /', () => {
//     it('should return a list of taxRates and status 200', async () => {
//       const res = await request(app).get('/api/taxRates');
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toBeInstanceOf(Array);
//     });
//   });
// });
