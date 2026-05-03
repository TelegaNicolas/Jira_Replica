-- Création de la table issues
CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'To Do',
  priority VARCHAR(50) DEFAULT 'Medium',
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);