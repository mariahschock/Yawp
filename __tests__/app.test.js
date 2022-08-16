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
  const response = await agent.post('/api/v1/users/sessions').send({ email, password });
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
      user: { id: expect.any(String),
        email,
      }
    });
  });

  it('POST - should log in an existing user', async () => {
    await request(app).post('/api/v1/users').send(userTest);
    const res = await request(app).post('/api/v1/users/sessions').send({ email: 'usertest@example.com', password: '123456' });
    expect(res.status).toBe(200);
  });

  it('GET - should return a list of users if signed in as admin', async () => {
    const [agent, user] = await registerAndLogin({ email: 'admin@example.com' });
    console.log(user);
    const res = await agent.get('/api/v1/users');

    expect(res.body).toEqual([{ ...user }]);
  });

  afterAll(() => {
    pool.end();
  });
});
