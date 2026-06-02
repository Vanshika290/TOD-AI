import { useState } from 'react';
import { BookOpen, Brain, Heart, Star, Sparkles, Check, X, ChevronRight, Home, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { callGeminiAPI } from '../../utils/gemini-api';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LearningHubProps {
  onBack: () => void;
}

// General Knowledge Questions Data
const gkQuestions = [
  {
    id: 1,
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Jupiter", "Saturn", "Mars"],
    correct: 1,
    emoji: "🪐",
    explanation: "Jupiter is the largest planet in our solar system! It's so big that over 1,000 Earths could fit inside it!"
  },
  {
    id: 2,
    question: "How many colors are there in a rainbow?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    emoji: "🌈",
    explanation: "A rainbow has 7 beautiful colors: Red, Orange, Yellow, Green, Blue, Indigo, and Violet!"
  },
  {
    id: 3,
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Elephant", "Lion", "Bear"],
    correct: 2,
    emoji: "🦁",
    explanation: "The lion is called the 'King of the Jungle' because of its strength and courage!"
  },
  {
    id: 4,
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    emoji: "🌍",
    explanation: "There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia!"
  },
  {
    id: 5,
    question: "What do bees make?",
    options: ["Milk", "Honey", "Butter", "Jam"],
    correct: 1,
    emoji: "🐝",
    explanation: "Bees make delicious honey! They collect nectar from flowers and turn it into honey in their hives."
  }
];

// Moral Stories Data
const moralStories = [
  {
    id: 1,
    title: "The Honest Woodcutter",
    emoji: "🪓",
    moral: "Honesty is always rewarded",
    story: `Once upon a time, a poor woodcutter was cutting wood near a river. Suddenly, his axe slipped from his hand and fell into the deep water.

The woodcutter was very sad because the axe was his only way to earn money. He sat by the river and started crying.

A magical fairy appeared and asked, "Why are you crying?" The woodcutter told her about his axe.

The kind fairy dove into the river and brought out a golden axe. "Is this your axe?" she asked. The woodcutter said, "No, that's not mine."

The fairy dove again and brought a silver axe. "Is this yours?" Again, the woodcutter said, "No."

Finally, the fairy brought his old iron axe. The woodcutter's face lit up! "Yes! That's my axe!" he said happily.

The fairy was very pleased with his honesty. She gave him all three axes as a reward for being truthful!`,
    image: "https://images.unsplash.com/photo-1636893580433-5ac59809bb13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NjMzOTY2MjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "The Ant and the Grasshopper",
    emoji: "🐜",
    moral: "Hard work and planning are important",
    story: `It was a beautiful summer day. An ant was working hard, collecting food grain by grain.

A grasshopper saw the ant and laughed. "Why are you working so hard? Come play and enjoy the sunshine with me!" said the grasshopper.

The ant replied, "I'm preparing for winter. You should do the same!" But the grasshopper just laughed and continued playing.

Summer passed, and winter came. The grasshopper had no food and was very hungry and cold.

He went to the ant's home and saw that the ant had plenty of food stored. The ant shared her food with the grasshopper.

The grasshopper learned an important lesson: "It's wise to prepare today for tomorrow's needs!"`,
    image: "https://images.unsplash.com/photo-1586503452950-997923af27f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNoaWxkcmVuJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYzNDQ5MDg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    title: "The Boy Who Cried Wolf",
    emoji: "🐺",
    moral: "Always tell the truth",
    story: `There was a shepherd boy who watched over sheep in a village. He often got bored watching the sheep all day.

One day, he thought of a plan to have some fun. He ran to the village shouting, "Wolf! Wolf! A wolf is attacking the sheep!"

All the villagers rushed to help him. But when they reached, there was no wolf! The boy laughed at them.

The next day, he did the same thing again. "Wolf! Wolf!" The kind villagers came running again, but again there was no wolf.

Then one day, a real wolf came! The boy shouted, "Wolf! Wolf! Please help!" But this time, nobody came. They thought he was lying again.

The wolf attacked the sheep, and the boy learned a hard lesson: "If you lie, people won't believe you even when you tell the truth."`,
    image: "https://images.unsplash.com/photo-1759678444816-57c9a945df73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJvb2slMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzYzNDExMDgxfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    title: "The Lion and the Mouse",
    emoji: "🦁",
    moral: "Kindness is never wasted",
    story: `A mighty lion was sleeping under a tree. A little mouse was playing nearby and accidentally ran over the lion's nose!

The lion woke up angrily and caught the tiny mouse. "How dare you disturb my sleep! I'm going to eat you!" roared the lion.

The frightened mouse begged, "Please let me go! I'm too small to be your meal. If you spare me, I promise I'll help you someday!"

The lion laughed. "How can a tiny mouse like you help the king of the jungle?" But he felt kind and let the mouse go.

A few days later, hunters caught the lion in a big net. The lion roared and struggled but couldn't escape.

The little mouse heard the lion's roar and came running. She quickly gnawed through the ropes with her sharp teeth and freed the lion!

The lion realized that even the smallest friend can be the greatest help!`,
    image: "https://images.unsplash.com/photo-1636893580433-5ac59809bb13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NjMzOTY2MjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

// Educational Fun Facts
const funFacts = [
  {
    id: 1,
    category: "Space",
    emoji: "🚀",
    title: "Amazing Space Facts",
    facts: [
      "The Sun is so big that 1.3 million Earths could fit inside it!",
      "A day on Venus is longer than a year on Venus!",
      "Saturn has more than 80 moons!",
      "The footprints on the Moon will stay there forever because there's no wind!",
      "Jupiter has a big red spot that is actually a giant storm!"
    ]
  },
  {
    id: 2,
    category: "Animals",
    emoji: "🦒",
    title: "Wonderful Animal Facts",
    facts: [
      "A snail can sleep for 3 years!",
      "Dolphins have names for each other!",
      "Butterflies taste with their feet!",
      "Elephants can't jump, but they can swim!",
      "A group of flamingos is called a 'flamboyance'!"
    ]
  },
  {
    id: 3,
    category: "Nature",
    emoji: "🌳",
    title: "Cool Nature Facts",
    facts: [
      "Bamboo is the fastest growing plant in the world!",
      "Trees can talk to each other through their roots!",
      "A sunflower can help clean dirty water!",
      "The smallest flower in the world is smaller than a grain of rice!",
      "Some mushrooms glow in the dark!"
    ]
  },
  {
    id: 4,
    category: "Science",
    emoji: "🔬",
    title: "Fun Science Facts",
    facts: [
      "Lightning is five times hotter than the sun!",
      "Your heart beats about 100,000 times a day!",
      "Honey never goes bad - it can last forever!",
      "Water can boil and freeze at the same time!",
      "A rainbow is actually a full circle!"
    ]
  }
];

export function LearningHub({ onBack }: LearningHubProps) {
  const [activeTab, setActiveTab] = useState<'quiz' | 'stories' | 'facts'>('quiz');
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [selectedFact, setSelectedFact] = useState<number | null>(null);
  const [aiHelp, setAiHelp] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const currentQuestion = gkQuestions[selectedQuestion];

  const handleAnswerClick = (index: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === currentQuestion.correct) {
      setScore(score + 10);
      (window as any).todaiSpeak?.('Awesome! You got it right! 🌟');
    } else {
      (window as any).todaiSpeak?.('Oops! Try the next one!');
    }
  };

  const handleNextQuestion = () => {
    if (selectedQuestion < gkQuestions.length - 1) {
      setSelectedQuestion(selectedQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setSelectedQuestion(0);
      setShowExplanation(false);
      setSelectedAnswer(null);
      (window as any).todaiSpeak?.(`Great job! Your total score is ${score} points!`);
    }
  };

  const getAiHelp = async (context: string) => {
    setLoadingAi(true);
    try {
      const apiKey = localStorage.getItem('gemini_api_key') || '';
      
      if (!apiKey) {
        setAiHelp('Please set up your API key in settings to use AI help! 🔑');
        setLoadingAi(false);
        return;
      }
      
      const response = await callGeminiAPI(apiKey, {
        prompt: `You are a friendly teacher for young children (Primary students). ${context}. Keep your response fun, simple, and encouraging. Use emojis and make it exciting for kids!`,
        temperature: 0.7,
        maxOutputTokens: 300,
      });
      
      setAiHelp(response);
      (window as any).todaiSpeak?.(response.substring(0, 200));
    } catch (error: any) {
      console.error('AI Help Error:', error);
      setAiHelp('Oops! I need a moment to think. Try asking me again! 🤔');
    }
    setLoadingAi(false);
  };

  const readStoryAloud = (story: string) => {
    (window as any).todaiSpeak?.(story);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-gray-900 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-purple-600" />
              Learning Hub 📚✨
            </h1>
            <p className="text-gray-600 mt-2">Learn amazing things and have fun!</p>
          </motion.div>
          <Button
            onClick={onBack}
            className="bg-white text-purple-600 hover:bg-purple-50 rounded-full"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span>Quiz Time! 🧠</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              activeTab === 'stories'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>Moral Stories 💖</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('facts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              activeTab === 'facts'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>Fun Facts! 🌟</span>
          </motion.button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Score Display */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-90">Your Score</div>
                    <div className="text-white">{score} Points! 🌟</div>
                  </div>
                  <div className="text-6xl">🏆</div>
                </div>
              </div>

              {/* Question Card */}
              <Card className="bg-white rounded-3xl p-8 shadow-xl border-0">
                <div className="text-center mb-6">
                  <div className="text-7xl mb-4">{currentQuestion.emoji}</div>
                  <div className="text-gray-900 mb-2">
                    Question {selectedQuestion + 1} of {gkQuestions.length}
                  </div>
                  <div className="text-gray-700 text-xl mb-6">
                    {currentQuestion.question}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuestion.correct;
                    const showResult = showExplanation;

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: showResult ? 1 : 1.05 }}
                        whileTap={{ scale: showResult ? 1 : 0.95 }}
                        onClick={() => handleAnswerClick(index)}
                        className={`p-6 rounded-2xl transition-all ${
                          !showResult
                            ? 'bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200'
                            : isCorrect
                            ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                            : isSelected
                            ? 'bg-gradient-to-br from-red-400 to-red-500 text-white'
                            : 'bg-gray-100 opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{option}</span>
                          {showResult && isCorrect && <Check className="w-6 h-6" />}
                          {showResult && isSelected && !isCorrect && <X className="w-6 h-6" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6"
                    >
                      <div className="flex items-start gap-3">
                        <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                        <div>
                          <div className="text-gray-900 mb-2">Did You Know?</div>
                          <p className="text-gray-700">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                {showExplanation && (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl py-6"
                  >
                    Next Question
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}

                {/* AI Help Button */}
                <Button
                  onClick={() => getAiHelp(`Explain this question to a child: ${currentQuestion.question}`)}
                  disabled={loadingAi}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl"
                >
                  {loadingAi ? '🤔 Thinking...' : '🤖 Ask AI for Help'}
                </Button>

                {aiHelp && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6"
                  >
                    <p className="text-gray-700">{aiHelp}</p>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}

          {activeTab === 'stories' && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {selectedStory === null ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {moralStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedStory(story.id)}
                      className="cursor-pointer"
                    >
                      <Card className="bg-white rounded-3xl overflow-hidden shadow-xl border-0 h-full">
                        <div className="relative h-48">
                          <ImageWithFallback
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 text-6xl">{story.emoji}</div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-gray-900 mb-3">{story.title}</h3>
                          <div className="flex items-center gap-2 text-purple-600">
                            <Heart className="w-5 h-5" />
                            <span className="text-sm">Moral: {story.moral}</span>
                          </div>
                          <Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-2xl">
                            Read Story
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {(() => {
                    const story = moralStories.find(s => s.id === selectedStory)!;
                    return (
                      <Card className="bg-white rounded-3xl p-8 shadow-xl border-0 max-w-4xl mx-auto">
                        <div className="text-center mb-6">
                          <div className="text-8xl mb-4">{story.emoji}</div>
                          <h2 className="text-gray-900 mb-2">{story.title}</h2>
                          <div className="flex items-center justify-center gap-2 text-purple-600">
                            <Heart className="w-5 h-5" />
                            <span>Moral: {story.moral}</span>
                          </div>
                        </div>

                        <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                          <ImageWithFallback
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="prose prose-lg max-w-none mb-6">
                          {story.story.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-gray-700 mb-4 text-lg leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        <div className="flex gap-4">
                          <Button
                            onClick={() => setSelectedStory(null)}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl"
                          >
                            Back to Stories
                          </Button>
                          <Button
                            onClick={() => readStoryAloud(story.story)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl"
                          >
                            <Volume2 className="w-5 h-5 mr-2" />
                            Read Aloud
                          </Button>
                        </div>
                      </Card>
                    );
                  })()}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'facts' && (
            <motion.div
              key="facts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {selectedFact === null ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {funFacts.map((factCard, index) => (
                    <motion.div
                      key={factCard.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedFact(factCard.id)}
                      className="cursor-pointer"
                    >
                      <Card className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-xl border-0 h-full hover:shadow-2xl transition-shadow">
                        <div className="text-center">
                          <div className="text-8xl mb-4">{factCard.emoji}</div>
                          <h3 className="text-gray-900 mb-2">{factCard.title}</h3>
                          <p className="text-gray-600 mb-4">{factCard.facts.length} Amazing Facts!</p>
                          <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-2xl">
                            Discover Facts
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {(() => {
                    const factCard = funFacts.find(f => f.id === selectedFact)!;
                    return (
                      <Card className="bg-white rounded-3xl p-8 shadow-xl border-0 max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                          <div className="text-9xl mb-4">{factCard.emoji}</div>
                          <h2 className="text-gray-900 mb-2">{factCard.title}</h2>
                          <p className="text-gray-600">{factCard.category}</p>
                        </div>

                        <div className="space-y-4 mb-6">
                          {factCard.facts.map((fact, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 flex items-start gap-4"
                            >
                              <div className="bg-gradient-to-br from-green-400 to-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                                {index + 1}
                              </div>
                              <p className="text-gray-700 text-lg">{fact}</p>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex gap-4">
                          <Button
                            onClick={() => setSelectedFact(null)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-2xl"
                          >
                            Back to Categories
                          </Button>
                          <Button
                            onClick={() => getAiHelp(`Tell me more fun facts about ${factCard.category} for kids`)}
                            disabled={loadingAi}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl"
                          >
                            {loadingAi ? '🤔 Loading...' : '🤖 More Facts!'}
                          </Button>
                        </div>

                        {aiHelp && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6"
                          >
                            <p className="text-gray-700">{aiHelp}</p>
                          </motion.div>
                        )}
                      </Card>
                    );
                  })()}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}