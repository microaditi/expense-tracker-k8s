const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//const pool = new Pool({
//  user: 'postgres',
//  host: 'db',
//  database: 'expensetracker',
//  password: 'password',
//  port: 5432,
//});


const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'expensetracker',
  password: process.env.PGPASSWORD || 'password',
  port: process.env.PGPORT || 5432,
});


app.post('/expenses', async (req, res) => {
  const { user_id, amount, category, description, date } = req.body;
  const result = await pool.query(
    'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, amount, category, description, date]
  );
  res.json(result.rows[0]);
});

app.get('/expenses/:userId', async (req, res) => {
  const { userId } = req.params;
  const result = await pool.query(
    'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  res.json(result.rows);
});

app.listen(3001, () => console.log('Backend running on port 3001'));

