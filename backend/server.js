const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const pool = require('./config/config_database');
const userRoutes = require('./routes/routes_users');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Jira_Replica backend running' });
});

// Fonction pour initialiser la base de données
const initDB = async () => {
  try {
    const tables = ['users', 'projects', 'issues'];
    for (const table of tables) {
      const filePath = path.join(__dirname, '../database', `${table}.sql`);
      const sql = fs.readFileSync(filePath, 'utf8');
      await pool.query(sql);
      console.log(`Table ${table} créée ou déjà existante.`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la DB:', error);
  }
};

const PORT = process.env.PORT || 4000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
});
