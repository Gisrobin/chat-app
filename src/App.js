import React, { useState, useEffect, useRef } from "react";

export default function ChatBotApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBotTyping(true);

    setTimeout(() => {
      const botResponse = {
        sender: "Bot",
        text: getBotReply(input)
      };
      setMessages((prev) => [...prev, botResponse]);
      setBotTyping(false);
    }, 1000);
  };

  const getBotReply = (userInput) => {
    const lower = userInput.toLowerCase();
    if(lower.includes("good morning"))return "hey dear  good morning to you too!";
    if (lower.includes("good night"))return "good night, and sleep well!";
    if (lower.includes("good afternoon"))return "good afternoon mr/mrs , how may i help you ?!";
    if (lower.includes("what is your name"))return "am mr robin assistant and my name is rubs!";

    if(lower.includes("i need your help"))return "alright  I'm here to help you!";
    if (lower.includes("hello")) return "Hi there! 😊";
    if (lower.includes("how are you")) return "I'm good,and  feeling awesome!";
    if (lower.includes("bye")) return "Goodbye! 👋";
    return "I didn't understand that. Try something else!";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Robin chat (Frontend Only)</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{ ...styles.message, alignSelf: msg.sender === "User" ? "flex-end" : "flex-start", backgroundColor: msg.sender === "User" ? "#daf1ff" : "#eee" }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {botTyping && <div style={styles.typing}>Bot is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 50px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    textAlign: "center"
  },
  chatBox: {
    height: "300px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backgroundColor: "#fafafa"
  },
  message: {
    padding: "8px 12px",
    borderRadius: "8px",
    maxWidth: "75%"
  },
  typing: {
    fontStyle: "italic",
    fontSize: "13px",
    color: "#888"
  },
  inputBox: {
    display: "flex",
    gap: "8px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px"
  }
};