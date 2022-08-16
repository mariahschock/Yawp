const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const UserService = require('../middleware/UserService');
const User = require('../models/User');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const [user, token] = await UserService.create(req.body);
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
        .json({ user, message: 'Signed in successfully' });
    } catch (e) {
      next(e);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      console.log(req.body);
      const token = await UserService.signIn(req.body);
      console.log(token); 
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
        .json({ message: 'Signed in successfully' });
    } catch (e) {
      next(e);
    }
  })

  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const users = await User.getAll();
      res.send(users);
    } catch (e) {
      next(e);
    }
  });
