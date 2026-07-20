import { useState, useEffect } from "react";

function App() {
  // 13-A の状態：データはまだ直書き（DB とはつながっていない）
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect( () => {
    fetch("api/messages")
    .then((res) => res.json())
    .then(setMessages);
  }, []);

const handleSend = () => {
  fetch("api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "先生", text }),
  })
    .then((res) => res.json())
    .then((newMessage) => {
      setMessages([...messages, newMessage]);
      setText("");
    });
};
  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>デプロイ検証チャット</h1>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>{m.text}</li>
        ))}
      </ul>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSend}>送信</button>
    </div>
  );
}

export default App;
