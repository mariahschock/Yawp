const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

const userTest = {
  email: 'usertest@example.com',
  password: '123456',
};

// const registerAndLogin = async (userProps = {}) => {
//   const agent = request.agent(app);
//   const user = await UserService.create({ ...userTest, ...userProps });

//   return [agent, user];
// };

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

  afterAll(() => {
    pool.end();
  });
});
