import React, { useState, useEffect } from "react";
import "../componentcss/timer.css"; 

const Timer = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    return (
        <div className="timer-container">
            <h2>⏳ Timer: {time}s</h2>
            <button onClick={handleStartStop}>
                {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={handleReset}>Reset</button>
        </div>
    );
};

export default Timer;
