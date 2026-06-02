import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trophy, RefreshCw, Lightbulb } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceAssistant } from '../VoiceAssistant';

interface PatternGameProps {
  onBack: () => void;
}

type Pattern = {
  sequence: string[];
  options: string[];
  correctIndex: number;
  hint?: string;
};

export function PatternGame({ onBack }: PatternGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [aiHint, setAiHint] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const patterns: Pattern[] = [
    {
      sequence: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
      options: ['🔴', '🔵', '🟡', '🟢'],
      correctIndex: 1
    },
    {
      sequence: ['⭐', '⭐', '🌙', '⭐', '⭐', '?'],
      options: ['⭐', '🌙', '☀️', '💫'],
      correctIndex: 1
    },
    {
      sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '?'],
      options: ['5️⃣', '6️⃣', '7️⃣', '1️⃣'],
      correctIndex: 1
    },
    {
      sequence: ['🍎', '🍌', '🍎', '🍌', '🍎', '?'],
      options: ['🍎', '🍌', '🍊', '🍇'],
      correctIndex: 1
    },
    {
      sequence: ['▲', '▲', '●', '▲', '▲', '?'],
      options: ['▲', '●', '■', '★'],
      correctIndex: 1
    }
  ];

  const currentPattern = patterns[currentLevel - 1];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === currentPattern.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 100);
      setStreak(streak + 1);
      setTimeout(() => {
        if (currentLevel < patterns.length) {
          setCurrentLevel(currentLevel + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        }
      }, 1500);
    } else {
      setStreak(0);
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 2000);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setStreak(0);
    setShowHint(false);
    setAiHint('');
  };

  const requestHint = async () => {
    if (!apiKey) {
      alert('API key not set. Please set your API key in the settings.');
      return;
    }

    const response = await fetch('https://api.gemini.com/v1/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: `What is the next item in the pattern: ${currentPattern.sequence.slice(0, -1).join(', ')}?`
      })
    });

    const data = await response.json();
    setAiHint(data.response);
    setShowHint(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-900">{score} pts</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span className="text-gray-900">{streak} streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Level Progress</span>
          <span className="text-sm text-gray-900">Level {currentLevel} of {patterns.length}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(currentLevel / patterns.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>

      {/* AI Avatar */}
      <AIAvatar 
        message={
          isCorrect === null 
            ? "Look at the pattern carefully. What comes next in the sequence?" 
            : isCorrect 
            ? "Perfect! You're a pattern detective! 🔍" 
            : "Not quite, but that's okay! Try looking at how the items repeat."
        }
        mood={isCorrect === null ? 'thinking' : isCorrect ? 'celebrating' : 'encouraging'}
      />

      {/* Game Area */}
      <AnimatePresence mode="wait">
        {currentLevel <= patterns.length ? (
          <motion.div
            key={currentLevel}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            {/* Pattern Sequence */}
            <div className="mb-8">
              <h3 className="text-gray-900 text-center mb-6">What comes next?</h3>
              <div className="flex items-center justify-center gap-4 mb-8">
                {currentPattern.sequence.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${
                      item === '?' 
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-dashed border-purple-400' 
                        : 'bg-gray-50'
                    }`}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Answer Options */}
            <div>
              <h4 className="text-gray-700 text-center mb-4">Choose the correct answer:</h4>
              <div className="grid grid-cols-4 gap-4">
                {currentPattern.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`aspect-square rounded-2xl text-4xl transition-all ${
                      selectedAnswer === index
                        ? isCorrect
                          ? 'bg-green-500 ring-4 ring-green-200 shadow-lg'
                          : 'bg-red-500 ring-4 ring-red-200 shadow-lg'
                        : selectedAnswer !== null && index === currentPattern.correctIndex
                        ? 'bg-green-500 ring-4 ring-green-200'
                        : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    {option}
                    {selectedAnswer === index && isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-2xl mt-2"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 p-4 rounded-2xl text-center ${
                    isCorrect 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {isCorrect ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">🎉</span>
                      <span>Correct! +100 points</span>
                    </div>
                  ) : (
                    <span>Try again! Look for the repeating pattern.</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint Button */}
            <button
              onClick={requestHint}
              className="bg-gray-50 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition-all inline-flex items-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Hint
            </button>

            {/* AI Hint */}
            {showHint && (
              <div className="mt-4 p-4 rounded-2xl bg-gray-100 text-gray-700">
                <p className="text-sm">AI Hint: {aiHint}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-12 shadow-xl text-white text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2 }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="mb-4">Amazing Work!</h2>
            <p className="text-xl mb-6">You completed all {patterns.length} levels!</p>
            <div className="text-3xl mb-8">Final Score: {score} points</div>
            <button
              onClick={resetGame}
              className="bg-white text-purple-600 px-8 py-3 rounded-full hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-gray-900 mb-3">🧠 Pattern Detective Tips</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Look for items that repeat in the same order</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Count how many items before the pattern repeats</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>What would come next if the pattern continues?</span>
          </li>
        </ul>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant 
        onCommand={(cmd) => {
          const command = cmd.toLowerCase();
          if (command.includes('hint') || command.includes('help')) {
            getAIHint();
            (window as any).todaiSpeak?.('Let me give you a hint');
          } else if (command.includes('restart') || command.includes('reset')) {
            resetGame();
            (window as any).todaiSpeak?.('Game restarted. Let\'s play again!');
          } else if (command.includes('next') && selectedAnswer !== null) {
            handleNextLevel();
          }
        }}
      />
    </div>
  );
}