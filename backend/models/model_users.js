const pool = require('../config/config_database');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email';
    const values = [email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
  
    static async findAll() {
    const query = 'SELECT id, email FROM users';
    const result = await pool.query(query);
    return result.rows;
  }

  static async updatePassword(id, hashedPassword) {
    const query = 'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2';
    await pool.query(query, [hashedPassword, id]);
  }

  static async findById(id) {
    const query = 'SELECT id, email FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

}



module.exports = User;
