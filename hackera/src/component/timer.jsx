import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../componentcss/timer.css";

const Timer = () => {
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hi! How can I help you?" }]);
  const [inputMessage, setInputMessage] = useState("");
  const [shootingStars, setShootingStars] = useState([]);
  const [showTodo, setShowTodo] = useState(false);
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      handlePomodoroComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const generateShootingStars = () => {
      const shootingStarArray = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 3 + 2}s`,
      }));
      setShootingStars(shootingStarArray);
    };
    generateShootingStars();
  }, []);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const handleCustomTimeChange = (e) => {
    const minutes = Math.max(1, parseInt(e.target.value) || 0);
    setCustomMinutes(minutes);
    if (!isRunning) setTimeLeft(minutes * 60);
  };

  const handlePomodoroComplete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:3000/getData/updateStreak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      window.dispatchEvent(new Event("streakUpdated"));
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  const handleEndRoom = () => navigate("/");
  const toggleChat = () => setShowChat(!showChat);
  const toggleTodo = () => setShowTodo(!showTodo);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = { sender: "user", text: inputMessage };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://localhost:3000/chatBot/chat", {
        message: inputMessage,
      });

      const botReply = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Sorry, I can't respond now!" }]);
    }

    setInputMessage("");
  };

  const addTodo = () => {
    if (todoInput.trim() !== "") {
      setTodos([...todos, { text: todoInput, completed: false }]);
      setTodoInput("");
    }
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="timer-container night-sky">
      <div className="moon"></div>
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        ></div>
      ))}

      <h2>Pomodoro Timer</h2>
      <div>
        <label>Set Timer (minutes): </label>
        <input
          type="number"
          value={customMinutes}
          onChange={handleCustomTimeChange}
          disabled={isRunning}
          min="1"
        />
      </div>
      <h1>{`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}</h1>
      <button onClick={handleStartPause}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleEndRoom} className="end-room-button">
        End Room
      </button>

      <div className="chatbot-icon" onClick={toggleChat}>💬</div>
      {showChat && (
        <div className="chat-window">
          <div className="chat-header">AI Chatbot <button onClick={toggleChat}>×</button></div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <p key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>{msg.text}</p>
            ))}
          </div>
          <input className="chat-input" type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Ask me anything..." />
        </div>
      )}

      <div className="todo-icon" onClick={toggleTodo}>📝</div>
      {showTodo && (
        <div className="todo-window">
          <div className="todo-header">To-Do List <button onClick={toggleTodo}>×</button></div>
          <ul>{todos.map((todo, index) => (<li key={index}>{todo.text} <button onClick={() => removeTodo(index)}>❌</button></li>))}</ul>
          <input type="text" value={todoInput} onChange={(e) => setTodoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} placeholder="New task..." />
        </div>
      )}
    </div>
  );
};

export default Timer;
