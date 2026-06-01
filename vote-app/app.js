require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// GET /api/questions ── 質問と選択肢の一覧を返す
app.get('/api/questions', async (req, res) => {
  const questions = await pool.query('SELECT * FROM questions ORDER BY id');
  const result = [];
  for (const q of questions.rows) {
    const answers = await pool.query(
      'SELECT * FROM answers WHERE question_id = $1 ORDER BY id',
      [q.id]
    );
    result.push({ ...q, answers: answers.rows });
  }
  res.json(result);
});

// POST /api/votes/:id ── 指定した選択肢の vote_count を +1 する
app.post('/api/votes/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'UPDATE answers SET vote_count = vote_count + 1 WHERE id = $1 RETURNING *',
    [id]
  );
  res.json(result.rows[0]);
});

app.listen(3000, () => {
  console.log('サーバーが起動しました: http://localhost:3000');
});