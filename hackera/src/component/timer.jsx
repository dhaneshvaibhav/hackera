import React, { useState, useEffect } from "react";

const Timer= () => {
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

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

  const handleStartPause = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const handleCustomTimeChange = (e) => {
    const minutes = Math.max(1, parseInt(e.target.value) || 0);
    setCustomMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  const handlePomodoroComplete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3000/getData/updateStreak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Broadcast event to refresh Profile.js
        window.dispatchEvent(new Event("streakUpdated"));
      }
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  return (
    <div className="pomodoro">
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
    </div>
  );
};

export default Timer;
