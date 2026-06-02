import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Volume2, TrendingUp, Heart, Zap, HelpCircle, ChevronRight } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { motion, AnimatePresence } from 'motion/react';

interface LessonViewProps {
  onBack: () => void;
}

export function LessonView({ onBack }: LessonViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isListening, setIsListening] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const fields = [
    {
      id: 'engineering',
      name: 'Engineering & Computer Science',
      icon: '💻',
      description: 'DSA, Programming, Networks, Databases',
      color: 'from-blue-500 to-cyan-600',
      categories: ['Data Structures & Algorithms', 'Software Engineering', 'Computer Networks', 'Database Management', 'Algorithms', 'Database Systems', 'Web Development', 'Networking']
    },
    {
      id: 'business',
      name: 'Business & Management',
      icon: '💼',
      description: 'Economics, Finance, Marketing, Strategy',
      color: 'from-amber-500 to-orange-600',
      categories: ['Economics', 'Finance & Accounting', 'Marketing']
    },
    {
      id: 'biotechnology',
      name: 'Biotechnology & Life Sciences',
      icon: '🧬',
      description: 'Biology, Genetics, Medical Sciences',
      color: 'from-green-500 to-emerald-600',
      categories: ['Biotechnology', 'Biology']
    },
    {
      id: 'mathematics',
      name: 'Mathematics & Calculus',
      icon: '📐',
      description: 'Calculus, Statistics, Applied Math',
      color: 'from-purple-500 to-pink-600',
      categories: ['Calculus']
    },
    {
      id: 'ai-ml',
      name: 'AI & Machine Learning',
      icon: '🤖',
      description: 'Machine Learning, Deep Learning, AI',
      color: 'from-indigo-500 to-purple-600',
      categories: ['Machine Learning']
    },
    {
      id: 'all',
      name: 'Mixed Topics (All Fields)',
      icon: '🎯',
      description: 'Random questions from all subjects',
      color: 'from-pink-500 to-rose-600',
      categories: []
    }
  ];

  const questions = [
    {
      question: "What is the time complexity of Binary Search on a sorted array?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Data Structures & Algorithms'
    },
    {
      question: "In Object-Oriented Programming, which principle states that objects should hide their internal state?",
      options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
      correct: 2,
      difficulty: 'medium',
      topic: 'Software Engineering'
    },
    {
      question: "What does the OSI model Layer 3 primarily handle?",
      options: ["Data Link", "Network & Routing", "Transport", "Session"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Computer Networks'
    },
    {
      question: "Which database normalization form removes transitive dependencies?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correct: 2,
      difficulty: 'hard',
      topic: 'Database Management'
    },
    {
      question: "In microeconomics, what happens to demand when the price of a complementary good increases?",
      options: ["Demand increases", "Demand decreases", "Supply increases", "No change"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Economics'
    },
    {
      question: "What is the derivative of f(x) = x³ + 2x² - 5x + 7?",
      options: ["3x² + 4x - 5", "x² + 2x - 5", "3x² + 2x - 5", "3x³ + 4x - 5"],
      correct: 0,
      difficulty: 'hard',
      topic: 'Calculus'
    },
    {
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort - O(n²)", "Quick Sort - O(n log n)", "Selection Sort - O(n²)", "Insertion Sort - O(n²)"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Algorithms'
    },
    {
      question: "In DBMS, what is a deadlock?",
      options: ["Database crash", "Two transactions waiting for each other's resources", "Slow query execution", "Index failure"],
      correct: 1,
      difficulty: 'hard',
      topic: 'Database Systems'
    },
    {
      question: "What does CRISPR-Cas9 technology primarily allow scientists to do?",
      options: ["Clone organisms", "Edit genes precisely", "Synthesize proteins", "Sequence DNA faster"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Biotechnology'
    },
    {
      question: "In React, what is the purpose of useEffect hook?",
      options: ["State management", "Handle side effects", "Event handling", "Styling components"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Web Development'
    },
    {
      question: "What is the main advantage of TCP over UDP?",
      options: ["Faster transmission", "Reliable, ordered delivery", "Less overhead", "Better for streaming"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Networking'
    },
    {
      question: "In financial accounting, what is the fundamental accounting equation?",
      options: ["Revenue - Expenses = Profit", "Assets = Liabilities + Equity", "Income = Revenue - Cost", "Cash Flow = Income - Expenses"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Finance & Accounting'
    },
    {
      question: "What is the primary function of mitochondria in a cell?",
      options: ["Protein synthesis", "ATP production (energy)", "DNA storage", "Cell division"],
      correct: 1,
      difficulty: 'medium',
      topic: 'Biology'
    },
    {
      question: "In machine learning, what is overfitting?",
      options: ["Model performs poorly on all data", "Model memorizes training data, poor on new data", "Model is too simple", "Training takes too long"],
      correct: 1,
      difficulty: 'hard',
      topic: 'Machine Learning'
    },
    {
      question: "Which marketing strategy focuses on creating long-term customer relationships?",
      options: ["Transactional Marketing", "Mass Marketing", "Relationship Marketing", "Viral Marketing"],
      correct: 2,
      difficulty: 'medium',
      topic: 'Marketing'
    }
  ];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct;
    setIsCorrect(correct);
    
    // Simulate difficulty adjustment
    setTimeout(() => {
      if (!correct && difficulty === 'medium') {
        setDifficulty('easy');
      } else if (correct && difficulty === 'medium') {
        setDifficulty('hard');
      }
    }, 1000);

    // Move to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 2000);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  const fetchExplanation = async () => {
    if (!apiKey) {
      alert('API key not set. Please set your API key in the settings.');
      return;
    }
    const response = await fetch('https://api.gemini.com/v1/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        question: filteredQuestions[currentQuestion].question,
        correctAnswer: filteredQuestions[currentQuestion].options[filteredQuestions[currentQuestion].correct],
        userAnswer: filteredQuestions[currentQuestion].options[selectedAnswer!]
      })
    });
    const data = await response.json();
    setAiExplanation(data.explanation);
    setShowExplanation(true);
  };

  const handleFieldSelect = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    setSelectedField(fieldId);
    
    // Filter questions based on selected field
    if (fieldId === 'all') {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(q => field.categories.includes(q.topic));
      setFilteredQuestions(filtered);
    }
    
    // Reset quiz state
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setDifficulty('medium');
  };

  const handleBackToSelection = () => {
    setSelectedField(null);
    setFilteredQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // Show field selection screen if no field is selected
  if (!selectedField) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl mb-4"
          >
            <span className="text-4xl">🎓</span>
          </motion.div>
          <h1 className="text-gray-900">Choose Your Field</h1>
          <p className="text-gray-600 text-xl">Select a subject to start your adaptive learning session</p>
        </div>

        {/* Field Selection Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {fields.map((field, index) => (
            <motion.button
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFieldSelect(field.id)}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all text-left group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${field.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{field.icon}</span>
              </div>
              <h3 className="text-gray-900 mb-2">{field.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{field.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {field.id === 'all' ? `${questions.length} questions` : `${questions.filter(q => field.categories.includes(q.topic)).length} questions`}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">Adaptive Learning</h3>
              <p className="text-gray-600 text-sm">
                Our AI will adjust the difficulty based on your performance. Answer correctly to get harder questions, 
                or get easier ones if you need more practice. Each session is personalized just for you!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackToSelection}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Field Selection</span>
        </button>

        {/* Difficulty Indicator */}
        <motion.div
          key={difficulty}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2"
        >
          <TrendingUp className={`w-4 h-4 ${
            difficulty === 'easy' ? 'text-green-500' :
            difficulty === 'medium' ? 'text-yellow-500' :
            'text-orange-500'
          }`} />
          <span className="text-sm text-gray-700">
            {difficulty === 'easy' && 'Getting Easier'}
            {difficulty === 'medium' && 'Just Right'}
            {difficulty === 'hard' && 'Challenge Boosted! 🚀'}
          </span>
        </motion.div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm text-gray-900">{currentQuestion + 1} of {filteredQuestions.length}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>

      {/* AI Avatar */}
      <AIAvatar 
        message={
          isCorrect === null 
            ? "Take your time and think carefully. You've got this!" 
            : isCorrect 
            ? "Awesome! You're doing great! 🌟" 
            : "That's okay! Let's try again. Remember, mistakes help us learn!"
        }
        mood={isCorrect === null ? 'thinking' : isCorrect ? 'celebrating' : 'encouraging'}
      />

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          {/* Question */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="mb-3">
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-3">
                {filteredQuestions[currentQuestion].topic}
              </span>
            </div>
            <h2 className="text-gray-900 mb-2">{filteredQuestions[currentQuestion].question}</h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {filteredQuestions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectedAnswer === null && handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`p-6 rounded-2xl transition-all ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-500 text-white ring-4 ring-green-200'
                      : 'bg-red-500 text-white ring-4 ring-red-200'
                    : selectedAnswer !== null && index === filteredQuestions[currentQuestion].correct
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
              >
                {option}
                {selectedAnswer === index && isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2"
                  >
                    ✓
                  </motion.span>
                )}
                {selectedAnswer === index && !isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2"
                  >
                    ✗
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Voice Input Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-gray-600">Or speak your answer:</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleVoiceInput}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isListening
                    ? 'bg-red-500 text-white ring-4 ring-red-200'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-xl'
                }`}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Mic className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </motion.button>
              {isListening && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600"
                >
                  Listening... 🎤
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Lives</div>
          <div className="text-gray-900">3 / 3</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Streak</div>
          <div className="text-gray-900">5 correct</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Volume2 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Points</div>
          <div className="text-gray-900">+150</div>
        </div>
      </div>

      {/* Explanation Section */}
      {showExplanation && (
        <div className="bg-white rounded-2xl p-4 shadow-md mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Explanation</span>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Hide</span>
            </button>
          </div>
          <p className="text-gray-900">{aiExplanation}</p>
        </div>
      )}
    </div>
  );
}