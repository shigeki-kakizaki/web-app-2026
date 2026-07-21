import { useState, useEffect } from "react";

function App() {
  // まだ DB とつながっていない。データは直接書いている状態
  const [messages, setMessages] = useState([
    { id: 1, username: "サンプル", text: "サンプルメッセージ" },
  ]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  useEffect( () => {
    fetch("api/messages")
    .then( (res) => res.json() )
    .then( setMessages );
  }, []);

  // chat.html の form の submit イベントと同じ。
  // e.preventDefault() でページの再読み込みを止めるのも同じ。
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, text }),
    });
    const newMessage = await res.json();
    setMessages([...messages, newMessage]);
    setText("");
  };

  return (
    <>
      <h1>チャット</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="メッセージ"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">送信</button>
      </form>

      <ul className="messages">
        {messages.map((m) => (
          <li key={m.id}>
            {m.username}: {m.text}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
