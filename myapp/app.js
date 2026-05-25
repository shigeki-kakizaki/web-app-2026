require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool ({
    host:       process.env.DB_HOST,
    port:       process.env.DB_PORT,
    database:   process.env.DB_NAME,
    user:       process.env.DB_USER,
    password:   process.env.DB_PASSWORD
});

app.get('/', (req, res) => {
    res.send('トップページです');
});

app.get('/about', (req, res) => {
    res.send('自己紹介ページです');
});

app.get('/time', (req, res) => {
    const now = new Date().toLocaleString('ja-JP');
    res.send('現在時刻:' + now);
});

app.get('/api/test', (req, res) => {
    res.json({ messsage: 'APIが動いています', status: 'ok' });
});

app.get('/status', (req, res) => {
    res.json( { status: 'ok', message: 'サーバーが動いています'} );
});

// const messages =  [];

app.get('/api/messages', async (req, res) => {
    // res.json(messages);
    // console.log('メッセージが取得されました');
    const result = await pool.query(
        'SELECT * FROM messages ORDER BY created_at ASC'
    );
    res.json(result.rows);
});

app.post('/api/messages', async (req, res) => {
    // const { username, text } = req.body;
    // const newMessage = { id: messages.length + 1, username, text};
    // messages.push(newMessage);
    // console.log('新しいメッセージが追加されました:', newMessage);
    // res.json(newMessage);
    const { username, text } = req.body;
    const result = await pool.query(
        'INSERT INTO messages (username, text) VALUES ($1, $2) RETURNING *',
        [username, text]
    );
    res.json(result.rows[0]);
});

app.use((req, res) => {
    res.status(404).send('ページが見つかりません');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`サーバが起動しました： http://localhost:${process.env.PORT || 3000}`);
});