const { Router } = require('express');
const Restaurant = require('../models/Restaurant');

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
  });

