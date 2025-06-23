import { useState } from "react";
import "./App.css";

interface Friend {
  id: number;
  name: string;
}

interface Message {
  from: number; // friend id or 0 for self
  text: string;
}

const initialFriends: Friend[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const initialChats: Record<number, Message[]> = {
  1: [
    { from: 1, text: "Hey! How are you?" },
    { from: 0, text: "Hi Alice! I am good. You?" },
  ],
  2: [
    { from: 2, text: "Yo!" },
    { from: 0, text: "Hey Bob!" },
  ],
  3: [
    { from: 3, text: "Hello!" },
    { from: 0, text: "Hi Charlie!" },
  ],
};

function App() {
  const [friends] = useState<Friend[]>(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState<number>(1);
  const [chats, setChats] = useState<Record<number, Message[]>>(initialChats);
  const [input, setInput] = useState("");
  const CHARACTER_LIMIT = 200;

  const handleSend = () => {
    if (!input.trim()) return;
    setChats((prev) => ({
      ...prev,
      [selectedFriend]: [
        ...(prev[selectedFriend] || []),
        { from: 0, text: input },
      ],
    }));
    setInput("");
    setTimeout(() => {
      setChats((prev) => ({
        ...prev,
        [selectedFriend]: [
          ...(prev[selectedFriend] || []),
          { from: selectedFriend, text: "This is an auto-reply! 😊" },
        ],
      }));
    }, 800);
  };

  return (
    <div className="messenger-container">
      <aside className="sidebar">
        <h2>BoxSend</h2>
        <ul className="friend-list">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className={selectedFriend === friend.id ? "selected" : ""}
              onClick={() => setSelectedFriend(friend.id)}
            >
              <span className="avatar" aria-label={friend.name}>
                {friend.name.charAt(0).toUpperCase()}
              </span>
              {friend.name}
            </li>
          ))}
        </ul>
      </aside>
      <main className="chat-area">
        <header className="chat-header">
          <h2>{friends.find((f) => f.id === selectedFriend)?.name}</h2>
        </header>
        <section className="chat-messages">
          {(chats[selectedFriend] || []).map((msg, idx) => (
            <div
              key={idx}
              className={msg.from === 0 ? "message self" : "message friend"}
            >
              {msg.text}
            </div>
          ))}
        </section>
        <footer className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              if (e.target.value.length <= CHARACTER_LIMIT)
                setInput(e.target.value);
            }}
            placeholder="Type a message..."
            maxLength={CHARACTER_LIMIT}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button onClick={handleSend} disabled={!input.trim()}>
            Send
          </button>
          <span className="char-count">
            {input.length}/{CHARACTER_LIMIT}
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
