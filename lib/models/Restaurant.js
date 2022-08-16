const pool = require('../utils/pool');

class Restaurant {
  id;
  name;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
  }

  static async getAllRestaurants() {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants'
    );
    return rows.map((row) => new Restaurant(row));
  }

  static async getRestaurantById(id) {
    const { rows } = await pool.query(
      `SELECT restaurants.*,
      coalesce(
        json_agg(to_json(reviews))
        FILTER (WHERE reviews.id IS NOT NULL), '[]'
      ) as reviews from restaurants
        LEFT JOIN reviews on restaurants.id = reviews.rest_id
        WHERE restaurants.id = $1
        GROUP BY restaurants.id`, [id]
    );
    return rows;
  }
//   async getReviews() {
//     const { rows } = await pool.query(
//       `SELECT reviews.* FROM from reviews
//        INNER JOIN restaurants on restaurants.id = reviews.rest_id
//        WHERE restaurants.id = $1`, [this.id]
//     );
//     this.reviews = rows;
//   }
}

module.exports = Restaurant;
