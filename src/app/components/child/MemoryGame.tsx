import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Timer, RefreshCw, Zap, MessageCircle } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryGameProps {
  onBack: () => void;
}

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export function MemoryGame({ onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const emojis = ['🎨', '🎭', '🎪', '🎯', '🎲', '🎸', ' труба', '🎻'];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const initializeGame = () => {
    const cardEmojis = [...emojis, ...emojis];
    const shuffled = cardEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setScore(0);
    setGameComplete(false);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const handleCardClick = (cardId: number) => {
    // Start timer on first move
    if (moves === 0) {
      setIsTimerRunning(true);
    }

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) {
      return;
    }

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      const secondCard = card;

      if (firstCard && firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          const matchedCards = cards.map(c =>
            c.id === firstCard.id || c.id === secondCard.id
              ? { ...c, isMatched: true }
              : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(matches + 1);
          setScore(score + 100);

          // Check if game is complete
          if (matches + 1 === emojis.length) {
            setGameComplete(true);
            setIsTimerRunning(false);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = cards.map(c =>
            c.id === firstCard?.id || c.id === secondCard.id
              ? { ...c, isFlipped: false }
              : c
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
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
            <Timer className="w-4 h-4 text-blue-500" />
            <span className="text-gray-900">{formatTime(timer)}</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-900">{score} pts</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <Zap className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Moves</div>
          <div className="text-gray-900">{moves}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <Star className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Matches</div>
          <div className="text-gray-900">{matches} / {emojis.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <div className="text-2xl mx-auto mb-2">🎯</div>
          <div className="text-sm text-gray-600">Accuracy</div>
          <div className="text-gray-900">{moves > 0 ? Math.round((matches / moves) * 100) : 0}%</div>
        </div>
      </div>

      {/* AI Avatar */}
      <AIAvatar 
        message={
          gameComplete
            ? `Fantastic! You completed the game in ${moves} moves! Your memory is amazing! 🌟`
            : matches === 0
            ? "Click on cards to flip them and find matching pairs. Try to remember where each emoji is!"
            : matches < 4
            ? "Great start! Keep going, you're doing awesome!"
            : "You're so close! Focus and find those last matches!"
        }
        mood={gameComplete ? 'celebrating' : matches > 0 ? 'encouraging' : 'happy'}
      />

      {/* Game Area */}
      <AnimatePresence mode="wait">
        {!gameComplete ? (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <div className="grid grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched}
                  className="aspect-square rounded-2xl relative"
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Back of card */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="text-4xl">❓</div>
                    </div>
                    
                    {/* Front of card */}
                    <div
                      className={`absolute inset-0 rounded-2xl flex items-center justify-center shadow-lg ${
                        card.isMatched 
                          ? 'bg-gradient-to-br from-green-400 to-teal-400' 
                          : 'bg-white border-2 border-purple-200'
                      }`}
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="text-5xl">{card.emoji}</div>
                      {card.isMatched && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                        >
                          <span className="text-green-600 text-sm">✓</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={initializeGame}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Game
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl p-12 shadow-xl text-white text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="mb-4">Memory Master!</h2>
            <p className="text-xl mb-6">You found all the matches!</p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-sm opacity-90">Time</div>
                <div className="text-2xl">{formatTime(timer)}</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-sm opacity-90">Moves</div>
                <div className="text-2xl">{moves}</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-sm opacity-90">Score</div>
                <div className="text-2xl">{score}</div>
              </div>
            </div>
            <button
              onClick={initializeGame}
              className="bg-white text-green-600 px-8 py-3 rounded-full hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-gray-900 mb-3">💡 Memory Tips</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Try to remember the position of each card as you flip them</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Focus on one area of the grid at a time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>The fewer moves you make, the higher your accuracy!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}