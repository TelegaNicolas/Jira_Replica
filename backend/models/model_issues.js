 const pool = require('../config/config_database');
 
 class Issue {
 
    static async create(title, description, priority, project_id, assignee_id, status = 'To Do') {
        const query = `
            INSERT INTO issues (title, description, priority, project_id, assignee_id, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [title, description, priority, project_id, assignee_id, status];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
 
    static async findAllByProject(project_id) {
        const query = "SELECT * FROM issues WHERE project_id = $1 ORDER BY created_at DESC";
        const values = [project_id];
        const result = await pool.query(query, values);
        return result.rows;
    }
 
    static async findById(project_id) {
        const query = "SELECT * FROM issues WHERE id = $1";
        const values = [project_id];
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }
 
    static async update(id, updates) {
        if (!updates || Object.keys(updates).length === 0) return null;
 
        const ALLOWED_FIELDS = ['title', 'description', 'status', 'priority', 'assignee_id'];
        const fields = Object.keys(updates).filter(f => ALLOWED_FIELDS.includes(f));
        if (fields.length === 0) return null;
 
        const safeUpdates = Object.fromEntries(fields.map(f => [f, updates[f]]));
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `
            UPDATE issues SET ${setClause}, updated_at = NOW()
            WHERE id = $${fields.length + 1}
            RETURNING *
        `;
        const values = [...Object.values(safeUpdates), id];
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }
 
    static async delete(project_id) {
        const query = "DELETE FROM issues WHERE id = $1 RETURNING id";
        const values = [project_id];
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }
}
 
module.exports = Issue;