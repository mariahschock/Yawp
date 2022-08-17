const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const restaurants = await Restaurant.getAllRestaurants();
      res.json(restaurants);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const restaurant = await Restaurant.getRestaurantById(req.params.id);
      //   restaurant.reviews = await Restaurant.getReviews();
      res.json(restaurant);
    } catch (e) {
      next(e);
    }
  })

  .post('/:id/reviews', authenticate, async (req, res, next) => {
    try {
      const newReview = await Review.insert({ ...req.body, rest_id: req.params.id, user_id: req.user.id });
      res.json(newReview);
    } catch (e) {
      next(e);
    }
  });

