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
}

module.exports = Restaurant;
