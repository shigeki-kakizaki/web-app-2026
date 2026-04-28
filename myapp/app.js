const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

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

app.get('/status', (req, res) => {
    res.json({ status: 'ok', message: 'サーバーが動いています' });
});

app.get('/api/test', (req, res) => {
    res.json({ messsage: 'APIが動いています', status: 'ok' });
});

const messages =  [];

app.get('/api/messages', (req, res) => {
    res.json(messages);
    console.log('メッセージが取得されました');
});

app.post('/api/messages', (req, res) => {
    const { username, text } = req.body;
    const newMessage = { id: messages.length + 1, username, text};
    messages.push(newMessage);
    console.log('新しいメッセージが追加されました:', newMessage);
    res.json(newMessage);
});

app.use((req, res) => {
    res.status(404).send('ページが見つかりません');
});

app.listen(3000, () => {
    console.log('サーバが起動しました： http://localhost:3000');
});