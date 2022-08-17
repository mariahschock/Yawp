const pool = require('../utils/pool');

module.exports = class Review {
  id;
  review;

  constructor(row) {
    this.id = row.id;
    this.review = row.review;
  }

  static async insert() {
    const { rows } = await pool.query(
      `INSERT INTO reviews (review)
       VALUES ('Cute and trendy, little overpriced')
       RETURNING *`
    );
    return new Review(rows[0]);
  }
};

