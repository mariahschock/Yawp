const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/middleware/UserService');

const userTest = {
  email: 'usertest@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? userTest.password;

  const agent = request.agent(app);
  const [user] = await UserService.create({ ...userTest, ...userProps });
  const { email } = user;
  console.log(user);
  const response = await agent
    .post('/api/v1/users/sessions')
    .send({ email, password });
  console.log(response.body);
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST - creates new user and signs user in', async () => {
    const res = await request(app).post('/api/v1/users').send(userTest);
    const { email } = userTest;
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Signed in successfully',
      user: { id: expect.any(String), email },
    });
  });

  it('POST - should log in an existing user', async () => {
    await request(app).post('/api/v1/users').send(userTest);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'usertest@example.com', password: '123456' });
    expect(res.status).toBe(200);
  });

  it('GET - should return a list of users if signed in as admin', async () => {
    const [agent] = await registerAndLogin({
      email: 'admin@example.com',
    });
    const res = await agent.get('/api/v1/users');

    expect(res.body.length).toEqual(4);
    expect(res.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "email": "rudyboy@gmail.com",
          "id": "1",
        },
        Object {
          "email": "russell@gmail.com",
          "id": "2",
        },
        Object {
          "email": "theboys@gmail.com",
          "id": "3",
        },
        Object {
          "email": "admin@example.com",
          "id": "4",
        },
      ]
    `);
  });

  it('GET - returns a list of restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name: expect.any(String),
        },
      ])
    );
  });

  it('GET - should return restaurant with nested reviews', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.body).toEqual(expect.arrayContaining([{
      id: expect.any(String),
      name: expect.any(String),
      reviews: expect.any(Array),
    }]));
  });

  it('POST - allows logged in user to create new review', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/restaurants/1/reviews').send({
      review: 'Cute and trendy, little overpriced',
    });
    expect(res.status).toBe(200);
  });

  afterAll(() => {
    pool.end();
  });
});
