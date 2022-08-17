const pool = require('../utils/pool');

module.exports = class Review {
  id;
  review;

  constructor(row) {
    this.id = row.id;
    this.review = row.review;
  }

  static async insert(newReview) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (review, rest_id, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`, [newReview.review, newReview.rest_id, newReview.user_id]
    );
    return new Review(rows[0]);
  }
};

