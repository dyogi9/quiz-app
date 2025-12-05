import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Users,
  Play,
  ArrowRight,
  Crown,
} from "lucide-react";

/**
 * COMPLETE QUIZ GAME
 * Host view + Player view + Lobby + Timer + Scoreboard + Results screen
 */

const questionsData = [
  {
    id: 1,
    question: "What is the critical temperature of CO₂?",
    options: ["273.15 K", "304.4 K", "350.2 K", "126.2 K"],
    answer: 1,
  },
  {
    id: 2,
    question: "Which equation is used for turbulence modeling?",
    options: ["Euler", "k-ω SST", "Navier-Stokes", "Schrodinger"],
    answer: 1,
  },
  {
    id: 3,
    question: "What does CFD stand for?",
    options: [
      "Control Flow Dynamics",
      "Computational Fluid Dynamics",
      "Critical Flow Derivative",
      "Complex Fluid Data",
    ],
    answer: 1,
  },
];

export default function QuizInterface() {
  const [screen, setScreen] = useState("lobby"); // lobby | question | results
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(15);
  const [scores, setScores] = useState({});
  const [host, setHost] = useState(false);

  // Timer logic
  useEffect(() => {
    if (screen !== "question") return;
    if (timer <= 0) return;

    const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, screen]);

  const joinGame = () => {
    if (!name.trim()) return;
    setPlayers((p) => [...p, name]);
    setScores((s) => ({ ...s, [name]: 0 }));
    setName("");
  };

  const selectAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);

    const correct = questionsData[currentQ].answer;

    if (idx === correct) {
      setScores((s) => ({
        ...s,
        [name]: s[name] + 10,
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questionsData.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setTimer(15);
    } else {
      setScreen("results");
    }
  };

  const resetGame = () => {
    setScreen("lobby");
    setPlayers([]);
    setScores({});
    setCurrentQ(0);
    setSelected(null);
    setTimer(15);
    setHost(false);
  };

  const q = questionsData[currentQ];

  // ======================
  //        SCREENS
  // ======================

  // ---------------------- LOBBY ----------------------
  if (screen === "lobby") {
    return (
      <div className="p-10 max-w-xl mx-auto text-center">
        <Users size={50} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Quiz Lobby</h1>
        <p className="text-gray-600 mb-6">Join the game or start as host</p>

        {!host && (
          <div>
            <input
              className="border p-2 rounded w-full mb-2"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={joinGame}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Join Game
            </button>

            <button
              onClick={() => setHost(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded w-full mt-4"
            >
              Become Host
            </button>
          </div>
        )}

        {host && (
          <>
            <h2 className="text-xl font-semibold mt-6 mb-3">Players Joined</h2>
            <div className="border rounded p-3 bg-white shadow">
              {players.length === 0 && (
                <p className="text-gray-500">Waiting for players…</p>
              )}
              {players.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <button
              onClick={() => setScreen("question")}
              className="bg-green-600 text-white px-4 py-2 rounded w-full mt-5"
            >
              Start Game
            </button>
          </>
        )}
      </div>
    );
  }

  // ---------------------- QUESTION SCREEN ----------------------
  if (screen === "question") {
    const correct = q.answer;

    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Question {currentQ + 1} / {questionsData.length}
          </h2>
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <Clock />
            {timer}s
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">{q.question}</h1>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answer;
            const isSelected = selected === i;

            let bg = "bg-white";
            if (selected !== null) {
              if (isCorrect) bg = "bg-green-200";
              else if (isSelected) bg = "bg-red-200";
            }

            return (
              <button
                key={i}
                disabled={selected !== null}
                onClick={() => selectAnswer(i)}
                className={`block w-full text-left px-4 py-3 rounded border ${bg}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={nextQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            Next <ArrowRight />
          </button>
        </div>
      </div>
    );
  }

  // ---------------------- RESULTS SCREEN ----------------------
  if (screen === "results") {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const winner = sorted[0][0];

    return (
      <div className="p-10 max-w-xl mx-auto text-center">
        <Trophy size={60} className="mx-auto mb-4 text-yellow-500" />

        <h1 className="text-3xl font-bold mb-2">Final Results</h1>
        <p className="text-gray-600 mb-6">Great job everyone!</p>

        <h2 className="text-2xl font-bold mb-4 flex justify-center items-center gap-2">
          <Crown className="text-yellow-500" />
          Winner: {winner}
        </h2>

        <div className="border rounded p-4 bg-white shadow">
          {sorted.map(([player, score]) => (
            <p key={player} className="text-lg">
              <strong>{player}</strong> — {score} pts
            </p>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="mt-8 bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto"
        >
          <RotateCcw /> Play Again
        </button>
      </div>
    );
  }

  return null;
}
