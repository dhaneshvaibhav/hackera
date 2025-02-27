import React, { useState, useEffect } from "react";

const PomodoroTimer = ({ updateUserStats }) => {
  const [customMinutes, setCustomMinutes] = useState(25); // User-set duration
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      handlePomodoroComplete(); // Update streak & points
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const handleCustomTimeChange = (e) => {
    const minutes = Math.max(1, parseInt(e.target.value) || 0); // Prevent 0 min
    setCustomMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  const handlePomodoroComplete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3000/updateStreak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionCompleted: true }),
      });

      const data = await response.json();
      if (data.success) {
        updateUserStats(data.streak, data.points); // Update UI
      }
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  return (
    <div className="pomodoro">
      <h2>Pomodoro Timer</h2>

      {/* Custom Timer Input */}
      <div>
        <label>Set Timer (minutes): </label>
        <input
          type="number"
          value={customMinutes}
          onChange={handleCustomTimeChange}
          disabled={isRunning} // Prevent changes while running
          min="1"
        />
      </div>

      {/* Timer Display */}
      <h1>
        {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
      </h1>

      {/* Controls */}
      <button onClick={handleStartPause}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default PomodoroTimer;
