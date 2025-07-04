import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Zap, Trophy, Timer, Brain, Star } from 'lucide-react';
import { verbs, tenseNames, persons } from './verbDatabase';
import { exampleSentences } from './exampleSentences';
import Confetti from './Confetti';

// Custom hook for localStorage persistence
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

const SpanishConjugationGame = () => {
  // Add state for showing previous question conjugation
  const [previousQuestion, setPreviousQuestion] = useState(null);
  const [currentVerb, setCurrentVerb] = useState(null);
  const [currentTense, setCurrentTense] = useState('presente');
  const [currentPerson, setCurrentPerson] = useState('yo');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [mistakes, setMistakes] = useState([]);
  const [gameMode, setGameMode] = useState('practice'); // practice, timed, survival
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  // Persistent best streak using localStorage
  const [bestStreak, setBestStreak] = useLocalStorage('spanishConjugationBestStreak', 0);
  const [showNewBestStreak, setShowNewBestStreak] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Track current session level - never goes down during a session
  const [sessionLevel, setSessionLevel] = useState(1);
  
  // Simple level calculation: Level 2 at 2 correct, Level 3 at 4 correct
  const level = sessionLevel;

  // Update best streak and session level when current streak increases
  useEffect(() => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      setShowNewBestStreak(true);
      setShowConfetti(true);
      // Hide the celebration after 4 seconds
      setTimeout(() => setShowNewBestStreak(false), 4000);
    }
    
    // Simple level progression: Level 2 at 2 correct, Level 3 at 4 correct
    if (streak >= 4 && sessionLevel < 3) {
      setSessionLevel(3);
    } else if (streak >= 2 && sessionLevel < 2) {
      setSessionLevel(2);
    }
  }, [streak, bestStreak, setBestStreak, sessionLevel]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameMode === 'timed') {
      handleTimeout();
    }
  }, [isTimerActive, timeLeft, gameMode]);

  // Generate new question
  const generateQuestion = () => {
    const allVerbs = { ...verbs.regular, ...verbs.irregular };
    const verbList = Object.keys(allVerbs);
    
    // Clear previous question when generating new question
    setPreviousQuestion(null);
    
    // Weighted selection based on mistakes
    let selectedVerb;
    if (mistakes.length > 0 && Math.random() < 0.3) {
      // 30% chance to review a mistake
      const mistake = mistakes[Math.floor(Math.random() * mistakes.length)];
      selectedVerb = mistake.verb;
    } else {
      // Regular selection based on level
      const availableVerbs = level === 1 ? Object.keys(verbs.regular) : verbList;
      selectedVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    }
    
    const tenses = Object.keys(allVerbs[selectedVerb]).filter(t => t !== 'type');
    const selectedTense = tenses[Math.floor(Math.random() * tenses.length)];
    const selectedPerson = persons[Math.floor(Math.random() * persons.length)];
    
    setCurrentVerb(selectedVerb);
    setCurrentTense(selectedTense);
    setCurrentPerson(selectedPerson);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    
    if (gameMode === 'timed') {
      setTimeLeft(30);
      setIsTimerActive(true);
    }
  };

  // Helper function to remove accents
  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Check answer
  const checkAnswer = () => {
    const allVerbs = { ...verbs.regular, ...verbs.irregular };
    const correctAnswer = allVerbs[currentVerb][currentTense][currentPerson];
    const userAnswerTrimmed = userAnswer.trim();
    
    const isExactMatch = userAnswerTrimmed.toLowerCase() === correctAnswer.toLowerCase();
    const isMatchWithoutAccents = removeAccents(userAnswerTrimmed.toLowerCase()) === removeAccents(correctAnswer.toLowerCase());
    
    // Set previous question immediately when checking answer
    setPreviousQuestion({
      verb: currentVerb,
      tense: currentTense,
      conjugations: allVerbs[currentVerb][currentTense]
    });
    
    setTotalQuestions(totalQuestions + 1);
    
    if (isExactMatch) {
      setFeedback({ type: 'correct', message: '¡Excelente!' });
      setScore(score + (gameMode === 'timed' ? timeLeft : 10));
      setStreak(streak + 1);
      setCorrectAnswers(correctAnswers + 1);
    } else if (isMatchWithoutAccents) {
      // Correct but missing accent
      setFeedback({ 
        type: 'correct', 
        message: `¡Muy bien! Just remember the accent: ${correctAnswer}` 
      });
      setScore(score + (gameMode === 'timed' ? timeLeft : 10));
      setStreak(streak + 1);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setFeedback({ 
        type: 'incorrect', 
        message: `Incorrect. The answer is: ${correctAnswer}` 
      });
      setStreak(0);
      
      // Add to mistakes for spaced repetition
      setMistakes([...mistakes, { 
        verb: currentVerb, 
        tense: currentTense, 
        person: currentPerson,
        timestamp: Date.now()
      }]);
      
      if (gameMode === 'survival') {
        setTimeout(() => {
          alert(`Game Over! Final Score: ${score}`);
          resetGame();
        }, 2000);
      }
    }
    
    setIsTimerActive(false);
  };

  // Handle timeout
  const handleTimeout = () => {
    setFeedback({ 
      type: 'timeout', 
      message: 'Time\'s up! Try to answer faster next time.' 
    });
    setStreak(0);
  };

  // Get hint
  const getHint = () => {
    const allVerbs = { ...verbs.regular, ...verbs.irregular };
    const verbType = allVerbs[currentVerb].type;
    let hint = '';
    
    if (verbType === '-ar' || verbType === '-er' || verbType === '-ir') {
      hint = `This is a regular ${verbType} verb. `;
      if (currentTense === 'presente') {
        const endings = {
          '-ar': { yo: 'o', tú: 'as', 'él/ella': 'a', nosotros: 'amos', vosotros: 'áis', 'ellos/ellas': 'an' },
          '-er': { yo: 'o', tú: 'es', 'él/ella': 'e', nosotros: 'emos', vosotros: 'éis', 'ellos/ellas': 'en' },
          '-ir': { yo: 'o', tú: 'es', 'él/ella': 'e', nosotros: 'imos', vosotros: 'ís', 'ellos/ellas': 'en' }
        };
        hint += `The ending for ${currentPerson} is -${endings[verbType][currentPerson]}`;
      } else if (currentTense === 'pretérito') {
        hint += `Check if it follows regular preterite patterns or is irregular.`;
      } else if (currentTense === 'imperfecto') {
        hint += `Remember: only ser, ir, and ver are irregular in imperfect!`;
      } else if (currentTense === 'futuro') {
        hint += `Add future endings to the infinitive.`;
      }
    } else {
      hint = 'This is an irregular verb. Try to remember the pattern!';
    }
    
    return hint;
  };
  
  // Show hint handler
  const handleShowHint = () => {
    setShowHint(true);
    setScore(Math.max(0, score - 5)); // Penalty for using hint
  };

  // Reset game
  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setSessionLevel(1); // Reset session level for new game
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setMistakes([]);
    setPreviousQuestion(null);
    setShowConfetti(false);
    generateQuestion();
  };

  // Handle confetti completion
  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  // Initialize game
  useEffect(() => {
    generateQuestion();
  }, []);

  // Keep input focused
  useEffect(() => {
    const input = document.querySelector('input[type="text"]');
    if (input && feedback === null) {
      input.focus();
    }
  }, [feedback]);

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Compute number of stat blocks for grid centering
  const statBlockCount = gameMode === 'timed' ? 6 : 5;
  const statsGridColsClass = `grid-cols-${statBlockCount}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      {/* Confetti Animation */}
      <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">Spanish Conjugation Master</h1>
          
          {/* Game Mode Selection */}
          <div className="flex justify-center gap-4 mb-2">
            <button
              onClick={() => { setGameMode('practice'); resetGame(); }}
              className={`px-4 py-2 rounded ${gameMode === 'practice' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Practice Mode
            </button>
            <button
              onClick={() => { setGameMode('timed'); resetGame(); }}
              className={`px-4 py-2 rounded ${gameMode === 'timed' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            >
              <Timer className="inline w-4 h-4 mr-1" />
              Timed Mode
            </button>
            <button
              onClick={() => { setGameMode('survival'); resetGame(); }}
              className={`px-4 py-2 rounded ${gameMode === 'survival' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              Survival Mode
            </button>
          </div>
          
          {/* Mode Description */}
          <p className="text-center text-sm text-gray-600 mb-4">
            {gameMode === 'practice' && "Learn at your own pace with no time pressure"}
            {gameMode === 'timed' && "30 seconds per question - earn bonus points for speed!"}
            {gameMode === 'survival' && "One mistake ends the game - how far can you go?"}
          </p>
          
          {/* Stats */}
          <div className="flex justify-center">
            {/* Mobile: flex rows, Desktop: grid */}
            <div className="w-full max-w-lg">
              {/* Mobile layout (below sm) */}
              <div className="block sm:hidden">
                {/* Row 1: Streak, Best Streak */}
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 bg-orange-100 p-2 rounded flex flex-col items-center justify-center">
                    <Zap className="w-5 h-5 mx-auto text-orange-600" />
                    <p className="text-lg font-bold">{streak}</p>
                    <p className="text-xs text-gray-600">Streak</p>
                  </div>
                  <div className="flex-1 p-2 rounded flex flex-col items-center justify-center transition-all duration-300 bg-yellow-200 border border-yellow-300 shadow-md">
                    <Star className="w-5 h-5 mx-auto text-yellow-700" />
                    <p className="text-lg font-bold">{bestStreak}</p>
                    <p className="text-xs text-gray-600">Best Streak</p>
                  </div>
                </div>
                {/* Row 2: Score, Level, Accuracy */}
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 bg-purple-100 p-2 rounded flex flex-col items-center justify-center">
                    <Trophy className="w-5 h-5 mx-auto text-purple-600" />
                    <p className="text-lg font-bold">{score}</p>
                    <p className="text-xs text-gray-600">Score</p>
                  </div>
                  <div className="flex-1 bg-green-100 p-2 rounded flex flex-col items-center justify-center">
                    <Brain className="w-5 h-5 mx-auto text-green-600" />
                    <p className="text-lg font-bold">{level}</p>
                    <p className="text-xs text-gray-600">Level</p>
                  </div>
                  <div className="flex-1 bg-blue-100 p-2 rounded flex flex-col items-center justify-center">
                    <CheckCircle className="w-5 h-5 mx-auto text-blue-600" />
                    <p className="text-lg font-bold">{accuracy}%</p>
                    <p className="text-xs text-gray-600">Accuracy</p>
                  </div>
                </div>
                {/* Row 3: Timer (timed mode only) */}
                {gameMode === 'timed' && (
                  <div className="flex justify-center mb-2">
                    <div className="bg-red-100 p-2 rounded flex flex-col items-center justify-center min-w-[100px]">
                      <Timer className="w-5 h-5 mx-auto text-red-600" />
                      <p className="text-lg font-bold">{timeLeft}</p>
                      <p className="text-xs text-gray-600">Time</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Desktop layout (sm and above) */}
              <div className={`hidden sm:grid ${statsGridColsClass} gap-4 text-center`}>
                <div className="bg-purple-100 p-3 rounded">
                  <Trophy className="w-6 h-6 mx-auto text-purple-600" />
                  <p className="text-2xl font-bold">{score}</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="bg-orange-100 p-3 rounded">
                  <Zap className="w-6 h-6 mx-auto text-orange-600" />
                  <p className="text-2xl font-bold">{streak}</p>
                  <p className="text-sm text-gray-600">Streak</p>
                </div>
                <div className={
                  `p-3 rounded transition-all duration-300 bg-yellow-200 border border-yellow-300 shadow-md`
                }>
                  <Star className="w-6 h-6 mx-auto text-yellow-700" />
                  <p className="text-2xl font-bold">{bestStreak}</p>
                  <p className="text-sm text-gray-600">Best Streak</p>
                </div>
                <div className="bg-green-100 p-3 rounded">
                  <Brain className="w-6 h-6 mx-auto text-green-600" />
                  <p className="text-2xl font-bold">{level}</p>
                  <p className="text-sm text-gray-600">Level</p>
                </div>
                <div className="bg-blue-100 p-3 rounded">
                  <CheckCircle className="w-6 h-6 mx-auto text-blue-600" />
                  <p className="text-2xl font-bold">{accuracy}%</p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
                {gameMode === 'timed' && (
                  <div className="bg-red-100 p-3 rounded">
                    <Timer className="w-6 h-6 mx-auto text-red-600" />
                    <p className="text-2xl font-bold">{timeLeft}</p>
                    <p className="text-sm text-gray-600">Time</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {currentVerb && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl mb-2">
                  Conjugate <span className="font-bold text-purple-600">{currentVerb}</span>
                </h2>
                <p className="text-lg text-gray-600">
                  in <span className="font-semibold">{tenseNames[currentTense]}</span> tense 
                  for <span className="font-semibold">{currentPerson}</span>
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      if (feedback === null) {
                        checkAnswer();
                      } else {
                        generateQuestion();
                      }
                    }
                  }}
                  className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder={feedback === null ? "Type your answer..." : "Press Enter for next question"}
                  autoFocus
                />

                {feedback && (
                  <>
                    <div className={`mt-4 p-3 rounded flex items-center gap-2 ${
                      feedback.type === 'correct' ? 'bg-green-100 text-green-800' : 
                      feedback.type === 'incorrect' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {feedback.type === 'correct' ? 
                        <CheckCircle className="w-5 h-5" /> : 
                        <XCircle className="w-5 h-5" />
                      }
                      <span>{feedback.message}</span>
                    </div>
                    
                    {/* Example Sentence */}
                    {exampleSentences[currentVerb] && exampleSentences[currentVerb][currentTense] && 
                     exampleSentences[currentVerb][currentTense][currentPerson] && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">Example:</p>
                        <p className="text-sm text-gray-600 italic">
                          "{exampleSentences[currentVerb][currentTense][currentPerson]}"
                        </p>
                      </div>
                    )}
                  </>
                )}

                {showHint && (
                  <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
                    <p className="text-sm">{getHint()}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={checkAnswer}
                    disabled={feedback !== null || !userAnswer}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={handleShowHint}
                    disabled={showHint || feedback !== null}
                    className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  >
                    Hint (-5 pts)
                  </button>
                  {feedback && (
                    <button
                      onClick={generateQuestion}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* New Best Streak Celebration */}
        {showNewBestStreak && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse opacity-90"></div>
              
              {/* Main celebration content */}
              <div className="relative p-6 rounded-lg text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Star className="w-8 h-8 text-yellow-200" />
                  <Trophy className="w-8 h-8 text-yellow-200" />
                  <Star className="w-8 h-8 text-yellow-200" />
                </div>
                
                <div className="text-white font-bold text-xl mb-2">
                  ¡NUEVO RÉCORD!
                </div>
                
                <div className="text-yellow-200 text-lg font-semibold">
                  Best Streak: {bestStreak}
                </div>
                
                <div className="text-yellow-100 text-sm mt-2">
                  ¡Increíble! ¡Sigue así!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previous Question Reference */}
        {previousQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-3">Learn from the Question</h3>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-700 mb-2">
                {previousQuestion.verb} - {tenseNames[previousQuestion.tense]}
              </p>
              <div className="space-y-1 text-sm">
                {Object.entries(previousQuestion.conjugations).map(([person, conjugation]) => (
                  <div key={person}>
                    <span className="font-medium text-gray-600">{person}:</span>
                    <span className="text-blue-600 ml-2">{conjugation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpanishConjugationGame;
