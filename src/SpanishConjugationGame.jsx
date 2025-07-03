import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Zap, Trophy, Timer, Brain } from 'lucide-react';

const SpanishConjugationGame = () => {
  // Add state for showing last mistake conjugation
  const [lastMistake, setLastMistake] = useState(null);
  const [currentVerb, setCurrentVerb] = useState(null);
  const [currentTense, setCurrentTense] = useState('presente');
  const [currentPerson, setCurrentPerson] = useState('yo');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [mistakes, setMistakes] = useState([]);
  const [gameMode, setGameMode] = useState('practice'); // practice, timed, survival
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Verb database with conjugations
  const verbs = {
    regular: {
      hablar: {
        type: '-ar',
        presente: { yo: 'hablo', tú: 'hablas', 'él/ella': 'habla', nosotros: 'hablamos', vosotros: 'habláis', 'ellos/ellas': 'hablan' },
        pretérito: { yo: 'hablé', tú: 'hablaste', 'él/ella': 'habló', nosotros: 'hablamos', vosotros: 'hablasteis', 'ellos/ellas': 'hablaron' },
        imperfecto: { yo: 'hablaba', tú: 'hablabas', 'él/ella': 'hablaba', nosotros: 'hablábamos', vosotros: 'hablabais', 'ellos/ellas': 'hablaban' },
        futuro: { yo: 'hablaré', tú: 'hablarás', 'él/ella': 'hablará', nosotros: 'hablaremos', vosotros: 'hablaréis', 'ellos/ellas': 'hablarán' }
      },
      comer: {
        type: '-er',
        presente: { yo: 'como', tú: 'comes', 'él/ella': 'come', nosotros: 'comemos', vosotros: 'coméis', 'ellos/ellas': 'comen' },
        pretérito: { yo: 'comí', tú: 'comiste', 'él/ella': 'comió', nosotros: 'comimos', vosotros: 'comisteis', 'ellos/ellas': 'comieron' },
        imperfecto: { yo: 'comía', tú: 'comías', 'él/ella': 'comía', nosotros: 'comíamos', vosotros: 'comíais', 'ellos/ellas': 'comían' },
        futuro: { yo: 'comeré', tú: 'comerás', 'él/ella': 'comerá', nosotros: 'comeremos', vosotros: 'comeréis', 'ellos/ellas': 'comerán' }
      },
      vivir: {
        type: '-ir',
        presente: { yo: 'vivo', tú: 'vives', 'él/ella': 'vive', nosotros: 'vivimos', vosotros: 'vivís', 'ellos/ellas': 'viven' },
        pretérito: { yo: 'viví', tú: 'viviste', 'él/ella': 'vivió', nosotros: 'vivimos', vosotros: 'vivisteis', 'ellos/ellas': 'vivieron' },
        imperfecto: { yo: 'vivía', tú: 'vivías', 'él/ella': 'vivía', nosotros: 'vivíamos', vosotros: 'vivíais', 'ellos/ellas': 'vivían' },
        futuro: { yo: 'viviré', tú: 'vivirás', 'él/ella': 'vivirá', nosotros: 'viviremos', vosotros: 'viviréis', 'ellos/ellas': 'vivirán' }
      }
    },
    irregular: {
      ser: {
        type: 'irregular',
        presente: { yo: 'soy', tú: 'eres', 'él/ella': 'es', nosotros: 'somos', vosotros: 'sois', 'ellos/ellas': 'son' },
        pretérito: { yo: 'fui', tú: 'fuiste', 'él/ella': 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', 'ellos/ellas': 'fueron' },
        imperfecto: { yo: 'era', tú: 'eras', 'él/ella': 'era', nosotros: 'éramos', vosotros: 'erais', 'ellos/ellas': 'eran' },
        futuro: { yo: 'seré', tú: 'serás', 'él/ella': 'será', nosotros: 'seremos', vosotros: 'seréis', 'ellos/ellas': 'serán' }
      },
      estar: {
        type: 'irregular',
        presente: { yo: 'estoy', tú: 'estás', 'él/ella': 'está', nosotros: 'estamos', vosotros: 'estáis', 'ellos/ellas': 'están' },
        pretérito: { yo: 'estuve', tú: 'estuviste', 'él/ella': 'estuvo', nosotros: 'estuvimos', vosotros: 'estuvisteis', 'ellos/ellas': 'estuvieron' },
        imperfecto: { yo: 'estaba', tú: 'estabas', 'él/ella': 'estaba', nosotros: 'estábamos', vosotros: 'estabais', 'ellos/ellas': 'estaban' },
        futuro: { yo: 'estaré', tú: 'estarás', 'él/ella': 'estará', nosotros: 'estaremos', vosotros: 'estaréis', 'ellos/ellas': 'estarán' }
      },
      tener: {
        type: 'irregular',
        presente: { yo: 'tengo', tú: 'tienes', 'él/ella': 'tiene', nosotros: 'tenemos', vosotros: 'tenéis', 'ellos/ellas': 'tienen' },
        pretérito: { yo: 'tuve', tú: 'tuviste', 'él/ella': 'tuvo', nosotros: 'tuvimos', vosotros: 'tuvisteis', 'ellos/ellas': 'tuvieron' },
        imperfecto: { yo: 'tenía', tú: 'tenías', 'él/ella': 'tenía', nosotros: 'teníamos', vosotros: 'teníais', 'ellos/ellas': 'tenían' },
        futuro: { yo: 'tendré', tú: 'tendrás', 'él/ella': 'tendrá', nosotros: 'tendremos', vosotros: 'tendréis', 'ellos/ellas': 'tendrán' }
      },
      hacer: {
        type: 'irregular',
        presente: { yo: 'hago', tú: 'haces', 'él/ella': 'hace', nosotros: 'hacemos', vosotros: 'hacéis', 'ellos/ellas': 'hacen' },
        pretérito: { yo: 'hice', tú: 'hiciste', 'él/ella': 'hizo', nosotros: 'hicimos', vosotros: 'hicisteis', 'ellos/ellas': 'hicieron' },
        imperfecto: { yo: 'hacía', tú: 'hacías', 'él/ella': 'hacía', nosotros: 'hacíamos', vosotros: 'hacíais', 'ellos/ellas': 'hacían' },
        futuro: { yo: 'haré', tú: 'harás', 'él/ella': 'hará', nosotros: 'haremos', vosotros: 'haréis', 'ellos/ellas': 'harán' }
      },
      ir: {
        type: 'irregular',
        presente: { yo: 'voy', tú: 'vas', 'él/ella': 'va', nosotros: 'vamos', vosotros: 'vais', 'ellos/ellas': 'van' },
        pretérito: { yo: 'fui', tú: 'fuiste', 'él/ella': 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', 'ellos/ellas': 'fueron' },
        imperfecto: { yo: 'iba', tú: 'ibas', 'él/ella': 'iba', nosotros: 'íbamos', vosotros: 'ibais', 'ellos/ellas': 'iban' },
        futuro: { yo: 'iré', tú: 'irás', 'él/ella': 'irá', nosotros: 'iremos', vosotros: 'iréis', 'ellos/ellas': 'irán' }
      },
      poder: {
        type: 'irregular',
        presente: { yo: 'puedo', tú: 'puedes', 'él/ella': 'puede', nosotros: 'podemos', vosotros: 'podéis', 'ellos/ellas': 'pueden' },
        pretérito: { yo: 'pude', tú: 'pudiste', 'él/ella': 'pudo', nosotros: 'pudimos', vosotros: 'pudisteis', 'ellos/ellas': 'pudieron' },
        imperfecto: { yo: 'podía', tú: 'podías', 'él/ella': 'podía', nosotros: 'podíamos', vosotros: 'podíais', 'ellos/ellas': 'podían' },
        futuro: { yo: 'podré', tú: 'podrás', 'él/ella': 'podrá', nosotros: 'podremos', vosotros: 'podréis', 'ellos/ellas': 'podrán' }
      },
      decir: {
        type: 'irregular',
        presente: { yo: 'digo', tú: 'dices', 'él/ella': 'dice', nosotros: 'decimos', vosotros: 'decís', 'ellos/ellas': 'dicen' },
        pretérito: { yo: 'dije', tú: 'dijiste', 'él/ella': 'dijo', nosotros: 'dijimos', vosotros: 'dijisteis', 'ellos/ellas': 'dijeron' },
        imperfecto: { yo: 'decía', tú: 'decías', 'él/ella': 'decía', nosotros: 'decíamos', vosotros: 'decíais', 'ellos/ellas': 'decían' },
        futuro: { yo: 'diré', tú: 'dirás', 'él/ella': 'dirá', nosotros: 'diremos', vosotros: 'diréis', 'ellos/ellas': 'dirán' }
      }
    }
  };

  const tenseNames = {
    presente: 'Present',
    pretérito: 'Preterite',
    imperfecto: 'Imperfect',
    futuro: 'Future'
  };

  const persons = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];

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
    
    setTotalQuestions(totalQuestions + 1);
    
    if (isExactMatch) {
      setFeedback({ type: 'correct', message: '¡Excelente!' });
      setScore(score + (gameMode === 'timed' ? timeLeft : 10));
      setStreak(streak + 1);
      setCorrectAnswers(correctAnswers + 1);
      
      // Level up every 10 correct in a row
      if (streak > 0 && (streak + 1) % 10 === 0) {
        setLevel(Math.min(level + 1, 3));
      }
      
      setTimeout(() => generateQuestion(), 1500);
    } else if (isMatchWithoutAccents) {
      // Correct but missing accent
      setFeedback({ 
        type: 'correct', 
        message: `¡Muy bien! Just remember the accent: ${correctAnswer}` 
      });
      setScore(score + (gameMode === 'timed' ? timeLeft : 10));
      setStreak(streak + 1);
      setCorrectAnswers(correctAnswers + 1);
      
      // Level up every 10 correct in a row
      if (streak > 0 && (streak + 1) % 10 === 0) {
        setLevel(Math.min(level + 1, 3));
      }
      
      setTimeout(() => generateQuestion(), 2000); // Slightly longer pause to read accent hint
    } else {
      setFeedback({ 
        type: 'incorrect', 
        message: `Incorrect. The answer is: ${correctAnswer}` 
      });
      setStreak(0);
      
      // Store the mistake details for the quick tips section
      setLastMistake({
        verb: currentVerb,
        tense: currentTense,
        conjugations: allVerbs[currentVerb][currentTense]
      });
      
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
    setTimeout(() => generateQuestion(), 2000);
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
    setLevel(1);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setMistakes([]);
    generateQuestion();
  };

  // Initialize game
  useEffect(() => {
    generateQuestion();
  }, []);

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
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
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Type your answer..."
                  disabled={feedback !== null}
                />

                {feedback && (
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

        {/* Quick Reference - Only show when there's a mistake */}
        {lastMistake && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-3">Learn from your mistake</h3>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-700 mb-2">
                Last mistake: {lastMistake.verb} - {tenseNames[lastMistake.tense]}
              </p>
              <div className="space-y-1 text-sm">
                {Object.entries(lastMistake.conjugations).map(([person, conjugation]) => (
                  <div key={person}>
                    <span className="font-medium text-gray-600">{person}:</span>
                    <span className="text-red-600 ml-2">{conjugation}</span>
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
