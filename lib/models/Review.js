const pool = require('../utils/pool');

module.exports = class Review {
  id;
  review;
  user_id;
  rest_id;

  constructor(row) {
    this.id = row.id;
    this.review = row.review;
    this.user_id = row.user_id;
    this.rest_id = row.rest_id;
  }

  static async insert(newReview) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (review, rest_id, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`, [newReview.review, newReview.rest_id, newReview.user_id]
    );
    return new Review(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE from reviews
        WHERE id = $1
        RETURNING *`, [id]
    );
    return new Review(rows[0]);
  }

  static async getReviewById(id) {
    const { rows } = await pool.query(
      `SELECT reviews.* FROM reviews
      INNER JOIN users on reviews.user_id = users.id
      WHERE reviews.id = $1`, [id]
    );
    console.log('rows', rows);
    return new Review(rows[0]);
  }
};

