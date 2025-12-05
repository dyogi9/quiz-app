import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Trophy, RotateCcw, Zap, Users, Play, ArrowRight, Crown } from 'lucide-react';

const QuizInterface = () => {
  const [questions] = useState([
    {
      id: 1,
      question: "What is the critical temperature of CO2?",
      options: ["273.15 K", "304.4 K", "373.15 K", "400 K"],
      correct: 1
    },
    {
      id: 2,
      question: "What is the critical pressure of CO2?",
      options: ["5.4 MPa", "7.4 MPa", "10.1 MPa", "12.3 MPa"],
      correct: 1
    },
    {
      id: 3,
      question: "Which phase exists above the critical point?",
      options: ["Solid", "Liquid", "Gas", "Supercritical Fluid"],
      correct: 3
    },
    {
      id: 4,
      question: "What tool is used to create videos from image sequences?",
      options: ["ImageMagick", "FFmpeg", "Photoshop", "GIMP"],
      correct: 1
    },
    {
      id: 5,
      question: "What does CFD stand for?",
      options: ["Computational Fluid Dynamics", "Central Flow Design", "Computed Field Distribution", "Critical Fluid Data"],
      correct: 0
    }
  ]);

  const [gameStarted, setGameStarted] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Player states - simulating 6 players
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", answers: [], totalPoints: 0, currentAnswer: null, answerTime: null, isReady: false },
    { id: 2, name: "Player 2", answers: [], totalPoints: 0, currentAnswer: null, answerTime: null, isReady: false },
    { id: 3, name: "Player 3", answers: [], totalPoints: 0, currentAnswer: null, answerTime: null, isReady: false },
    { id: 4, name: "Player 4", answers: [], totalPoints: 0, currentAnswer: null, answerTime: null, isReady: false },
    { id: 5, name: "Player 5", answers: [], totalPoints: 0, currentAnswer: null, answerTime: null, isReady: false },
    { id: 6, name: "Player 6", answers: [], totalPoints: 0, currentAnswer: null, answerTime: null, isReady: false },
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState(1);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && gameStarted && !showResult) {
      interval = setInterval(() => {
        setQuestionTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, gameStarted, showResult]);

  const calculatePoints = (timeInSeconds) => {
    return Math.max(0, 1000 - timeInSeconds);
  };

  const startGame = () => {
    setGameStarted(true);
    setIsTimerActive(true);
    setQuestionTimer(0);
  };

  const handlePlayerAnswer = (playerId, optionIndex) => {
    const player = players.find(p => p.id === playerId);
    if (player.currentAnswer === null) {
      const isCorrect = optionIndex === questions[currentQuestion].correct;
      const points = isCorrect ? calculatePoints(questionTimer) : 0;

      setPlayers(players.map(p => 
        p.id === playerId 
          ? { 
              ...p, 
              currentAnswer: optionIndex,
              answerTime: questionTimer,
              totalPoints: p.totalPoints + points,
              answers: [...p.answers, { questionId: questions[currentQuestion].id, answer: optionIndex, correct: isCorrect, points, time: questionTimer }]
            }
          : p
      ));
    }
  };

  const hostNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionTimer(0);
      setPlayers(players.map(p => ({ ...p, currentAnswer: null, answerTime: null })));
    } else {
      setShowResult(true);
      setIsTimerActive(false);
    }
  };

  const handleRestart = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setShowResult(false);
    setQuestionTimer(0);
    setIsTimerActive(false);
    setPlayers(players.map(p => ({ 
      ...p, 
      answers: [], 
      totalPoints: 0, 
      currentAnswer: null, 
      answerTime: null,
      isReady: false 
    })));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleView = () => {
    setIsHost(!isHost);
  };

  const answeredCount = players.filter(p => p.currentAnswer !== null).length;
  const sortedPlayers = [...players].sort((a, b) => b.totalPoints - a.totalPoints);

  // Results/Leaderboard View
  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Final Results!</h2>
              <p className="text-gray-600">Quiz Complete - Here's the leaderboard</p>
            </div>

            <div className="space-y-4 mb-8">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id}
                  className={`p-6 rounded-xl border-2 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400' :
                    index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-400' :
                    index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-400' :
                    'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-500'
                      }`}>
                        #{index + 1}
                      </div>
                      {index === 0 && <Crown className="w-8 h-8 text-yellow-500" />}
                      <div>
                        <div className="text-xl font-bold text-gray-800">{player.name}</div>
                        <div className="text-sm text-gray-600">
                          {player.answers.filter(a => a.correct).length}/{questions.length} correct
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <span className="text-3xl font-bold text-indigo-600">{player.totalPoints}</span>
                      </div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 mx-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                Start New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lobby/Start Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Users className="w-20 h-20 mx-auto text-indigo-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Multiplayer Quiz</h1>
            <p className="text-gray-600">6 Players Ready to Compete!</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {players.map(player => (
              <div key={player.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {player.id}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{player.name}</div>
                    <div className="text-sm text-green-600">Ready</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Game Rules:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Each correct answer starts at 1000 points</li>
              <li>• Points decrease by 1 for every second that passes</li>
              <li>• Faster correct answers = More points!</li>
              <li>• Host controls when to move to the next question</li>
              <li>• Winner is the player with the most points at the end</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentPlayer = players.find(p => p.id === selectedPlayer);
  const potentialPoints = calculatePoints(questionTimer);

  // Host View
  if (isHost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
            {/* Host Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <Crown className="w-6 h-6 text-yellow-300" />
                  <span className="text-xl font-bold">HOST VIEW</span>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Clock className="w-5 h-5" />
                    <span className="text-lg font-semibold">{formatTime(questionTimer)}</span>
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  Question {currentQuestion + 1} / {questions.length}
                </div>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question Display */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{question.question}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {question.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      index === question.correct 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === question.correct ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg font-medium">{option}</span>
                      {index === question.correct && (
                        <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg mb-6">
                <div className="flex items-center gap-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <span className="font-semibold text-gray-800">
                    {answeredCount} / {players.length} players answered
                  </span>
                </div>
                <button
                  onClick={hostNextQuestion}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Show Results
                      <Trophy className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Live Player Status */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Live Player Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  {players.map(player => (
                    <div 
                      key={player.id}
                      className={`p-4 rounded-lg border-2 ${
                        player.currentAnswer !== null
                          ? player.answers[player.answers.length - 1].correct
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{player.name}</span>
                        {player.currentAnswer !== null && (
                          player.answers[player.answers.length - 1].correct ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )
                        )}
                      </div>
                      {player.currentAnswer !== null ? (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            Answer: <span className="font-semibold">{String.fromCharCode(65 + player.currentAnswer)}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Time: <span className="font-semibold">{player.answerTime}s</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-bold text-indigo-600">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            +{player.answers[player.answers.length - 1].points} pts
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">Thinking...</div>
                      )}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500">Total: <span className="font-bold text-indigo-600">{player.totalPoints}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={toggleView}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Switch to Player View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Player View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(Number(e.target.value))}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold"
              >
                {players.map(p => (
                  <option key={p.id} value={p.id} className="text-gray-800">{p.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-lg font-bold">{currentPlayer.currentAnswer === null ? potentialPoints : '—'}</span>
              </div>
            </div>
            <div className="text-lg font-semibold">Q{currentQuestion + 1}/{questions.length}</div>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{question.question}</h2>
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-indigo-600">{questionTimer}s</div>
            </div>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              
              if (currentPlayer.currentAnswer === null) {
                buttonClass += "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer";
              } else if (index === question.correct) {
                buttonClass += "border-green-500 bg-green-50";
              } else if (index === currentPlayer.currentAnswer) {
                buttonClass += "border-red-500 bg-red-50";
              } else {
                buttonClass += "border-gray-200 opacity-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handlePlayerAnswer(selectedPlayer, index)}
                  disabled={currentPlayer.currentAnswer !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      currentPlayer.currentAnswer === null 
                        ? "bg-gray-100 text-gray-700"
                        : index === question.correct
                          ? "bg-green-500 text-white"
                          : index === currentPlayer.currentAnswer
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {currentPlayer.currentAnswer !== null && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {currentPlayer.answers[currentPlayer.answers.length - 1].correct ? "✓ Correct!" : "✗ Incorrect"}
                </span>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-indigo-600">
                    +{currentPlayer.answers[currentPlayer.answers.length - 1].points}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={toggleView}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Switch to Host View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
