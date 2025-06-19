import React, { useState, useEffect, useRef } from "react";

export default function ChatBotApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [listening, setListening] = useState(false); // NEW
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null); // NEW

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // NEW: Setup SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onerror = () => {
        setListening(false);
      };
    }
  }, []);

  // NEW: Start/stop voice recognition
  const handleMicClick = () => {
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current && recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBotTyping(true);

    const botResponse = {
      sender: "Bot",
      text: await getBotReply(input),
    };
    setMessages((prev) => [...prev, botResponse]);
    setBotTyping(false);
  };

  const getBotReply = async (userInput) => {
    const lower = userInput.toLowerCase();
    if (lower.includes("good morning")) return "Hey dear, good morning to you too!";
    if (lower.includes("good night")) return "Good night, and sleep well!";
    if (lower.includes("good afternoon")) return "Good afternoon mr/mrs, how may I help you?!";
    if (lower.includes("what is your name")) return "Am Mr Robin assistant and my name is Rubs!";
    if (lower.includes("what can you do")) return "I can help you with your queries and provide information on various topics!";
    if (lower.includes("i need your help")) return "Alright, I'm here to help you!";
    if (lower.includes("hello")) return "Hi there! 😊";
    if (lower.includes("how are you")) return "I'm good, and feeling awesome!";
    if (lower.includes("bye")) return "Goodbye! 👋";

    // Fetch response from Google Gemini API
    try {
      const apiKey = "AIzaSyA00fnHtcL3Cr_HpDKClDAV6lWARWkTv4Q"; // Replace with your actual Gemini API key
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: userInput },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "Sorry, I couldn't get a response from the Gemini API.";
      }
    } catch (err) {
      console.error("Gemini API error:", err);
      return "Error contacting Gemini API.";
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Robin's chat </h2>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "User" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "User" ? "#daf1ff" : "#eee",
            }}
          >
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
        <button
          onClick={handleMicClick}
          style={{
            ...styles.button,
            backgroundColor: listening ? "#28a745" : "#6c757d",
            marginLeft: 4,
          }}
          title={listening ? "Listening..." : "Start voice input"}
        >
          {listening ? "🎤..." : "🎤"}
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
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
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
    backgroundColor: "#fafafa",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "8px",
    maxWidth: "75%",
  },
  typing: {
    fontStyle: "italic",
    fontSize: "13px",
    color: "#888",
  },
  inputBox: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
};