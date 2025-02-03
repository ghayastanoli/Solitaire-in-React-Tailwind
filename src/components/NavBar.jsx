import React, { useState, useEffect } from "react";

const NavBar = ({ moves, correctMoves, resetGame }) => {
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (moves > 0 && !isTimerRunning) {
      setIsTimerRunning(true);
    }
  }, [moves]);

  useEffect(() => {
    setScore(correctMoves * 5);
  }, [correctMoves]);

  const handleReset = () => {
    setTimer(0);
    setScore(0);
    setIsTimerRunning(false);
    resetGame();
  };

  return (
    <div className="flex justify-between p-4 ml-12 bg-white text-gray-800">
      <div className="text-xl font-bold">SPIDER SOLITAIRE</div>
      <div className="flex space-x-6 items-center">
        <div className="text-xl"> Time: {timer}s</div>
        <div className="text-xl"> Score: {score}</div>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default NavBar;