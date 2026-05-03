const pool = require('../config/config_database');
const bcrypt = require('bcryptjs');

class Project {
    static async create(name, description, owner_id) {
        const query = "INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id, name, description, owner_id, created_at, updated_at";
        const values = [name, description, owner_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = "DELETE FROM projects WHERE id = $1 RETURNING id";
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0] || null;  
     }  
    
    static async update(id, updates) {
        if (!updates || Object.keys(updates).length === 0) {
            return null;  
        }
        const fields = Object.keys(updates);
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `UPDATE projects SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING id, name, description, owner_id, created_at, updated_at`;
        const values = [...Object.values(updates), id];
        const result = await pool.query(query, values);
        return result.rows[0] || null;  
    }

    static async findAll() {
        const query = "SELECT * FROM projects";
        const result = await pool.query(query);
        return result.rows || null;;
    }

    static async findById(id) {
        const query = "SELECT * FROM projects WHERE id = $1";
        const values = [id];
        const result = await pool.query(query,values);
        return result.rows[0] || null;
    }


    static async findByName(name) {
        const query = "SELECT * FROM projects WHERE name = $1";
        const values = [name];
        const result = await pool.query(query,values);
        return result.rows[0] || null;
    }
}  
module.exports = Project;
