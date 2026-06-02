import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Clock, Trophy, Settings, RefreshCw } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { motion, AnimatePresence } from 'motion/react';
import { callGeminiAPI } from '../../utils/gemini-api';
import { VoiceAssistant } from '../VoiceAssistant';

interface QuizGeneratorProps {
  onBack: () => void;
}

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

type QuizResult = {
  score: number;
  totalQuestions: number;
  answers: boolean[];
};

export function QuizGenerator({ onBack }: QuizGeneratorProps) {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowSettings(false);
  };

  const sampleContent = "Photosynthesis is the process by which green plants use sunlight to make their own food. Plants take in carbon dioxide from the air and water from the soil. Using the energy from sunlight, they convert these into glucose (sugar) and oxygen. The oxygen is released into the air, which we breathe. Chlorophyll, the green pigment in plants, plays a crucial role in capturing sunlight.";

  const generateQuiz = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);

    try {
      if (!apiKey) {
        // Generate demo quiz without API
        const demoQuestions: Question[] = [
          {
            question: "What is photosynthesis?",
            options: [
              "A process where plants eat insects",
              "A process where plants make their own food using sunlight",
              "A process where plants drink water",
              "A process where plants sleep"
            ],
            correctAnswer: 1
          },
          {
            question: "What do plants take in from the air during photosynthesis?",
            options: [
              "Oxygen",
              "Nitrogen",
              "Carbon dioxide",
              "Hydrogen"
            ],
            correctAnswer: 2
          },
          {
            question: "What is the green pigment in plants called?",
            options: [
              "Melanin",
              "Chlorophyll",
              "Hemoglobin",
              "Carotene"
            ],
            correctAnswer: 1
          }
        ];

        setTimeout(() => {
          setQuestions(demoQuestions);
          setQuizStarted(true);
          setIsGenerating(false);
        }, 2000);
        return;
      }

      console.log('Calling Gemini API with key:', apiKey.substring(0, 10) + '...');

      // Call Gemini API to generate quiz using utility
      const responseText = await callGeminiAPI(apiKey, {
        prompt: `Based on the following content, create exactly 5 multiple-choice questions suitable for students. Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

Make questions simple, fun, and educational. The correctAnswer should be the index (0-3) of the correct option.

Content: ${content}

Respond ONLY with the JSON array, no other text.`,
        temperature: 0.7,
        maxOutputTokens: 1500,
      });

      console.log('Response text:', responseText);
      
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedQuestions = JSON.parse(jsonMatch[0]);
        console.log('Parsed questions:', parsedQuestions);
        
        if (parsedQuestions.length >= 5) {
          setQuestions(parsedQuestions.slice(0, 5));
        } else {
          setQuestions(parsedQuestions);
        }
        setQuizStarted(true);
      } else {
        console.error('Could not extract JSON from response');
        throw new Error('Invalid response format - no JSON found');
      }
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      
      // Provide detailed error message to user
      let errorMsg = 'Error generating quiz: ';
      if (error.message.includes('API key')) {
        errorMsg += 'Please check your API key in the settings.';
      } else if (error.message.includes('connect')) {
        errorMsg += 'Please check your internet connection and try again.';
      } else {
        errorMsg += error.message || 'Unknown error. Please try again.';
      }
      alert(errorMsg);
      
      // Fallback to demo questions
      const demoQuestions: Question[] = [
        {
          question: "Based on the content, what is the main topic?",
          options: [
            "Understanding the subject",
            "Learning new things",
            "Exploring ideas",
            "All of the above"
          ],
          correctAnswer: 3
        },
        {
          question: "What can we learn from this content?",
          options: [
            "New information",
            "Important concepts",
            "Key ideas",
            "All of the above"
          ],
          correctAnswer: 3
        },
        {
          question: "How would you describe this topic?",
          options: [
            "Interesting",
            "Educational",
            "Informative",
            "All of the above"
          ],
          correctAnswer: 3
        },
        {
          question: "What's the best way to learn this?",
          options: [
            "Reading carefully",
            "Taking notes",
            "Practicing",
            "All of the above"
          ],
          correctAnswer: 3
        },
        {
          question: "Why is this topic important?",
          options: [
            "Builds knowledge",
            "Develops skills",
            "Helps understanding",
            "All of the above"
          ],
          correctAnswer: 3
        }
      ];
      setQuestions(demoQuestions);
      setQuizStarted(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    setAnswers([...answers, isCorrect]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setContent('');
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setQuizStarted(false);
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
  };

  const calculateScore = () => {
    return answers.filter(a => a).length;
  };

  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

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
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🌟' : '💪'}
          </motion.div>
          <h2 className="mb-4">Quiz Complete!</h2>
          <p className="text-xl mb-6">
            You scored {score} out of {questions.length}
          </p>
          <div className="text-3xl mb-8">{percentage}%</div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={retryQuiz}
              className="bg-white text-purple-600 px-8 py-3 rounded-full hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={resetQuiz}
              className="bg-purple-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all"
            >
              New Quiz
            </button>
          </div>
        </motion.div>

        <AIAvatar 
          message={
            percentage >= 80 
              ? "Excellent work! You really understood the material! 🌟" 
              : percentage >= 60
              ? "Good job! Keep practicing and you'll get even better!"
              : "That's okay! Learning takes time. Try reviewing the content and take the quiz again!"
          }
          mood={percentage >= 80 ? 'celebrating' : percentage >= 60 ? 'happy' : 'encouraging'}
        />
      </div>
    );
  }

  if (quizStarted && questions.length > 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <span className="text-gray-900">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </div>

        <AIAvatar 
          message={
            selectedAnswer === null
              ? "Take your time and think about the answer carefully!"
              : selectedAnswer === questions[currentQuestion].correctAnswer
              ? "Perfect! That's the right answer! 🎉"
              : "Not quite, but that's okay! Let's keep going!"
          }
          mood={
            selectedAnswer === null
              ? 'thinking'
              : selectedAnswer === questions[currentQuestion].correctAnswer
              ? 'celebrating'
              : 'encouraging'
          }
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-gray-900 mb-2">{questions[currentQuestion].question}</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    selectedAnswer === index
                      ? index === questions[currentQuestion].correctAnswer
                        ? 'bg-green-500 text-white ring-4 ring-green-200'
                        : 'bg-red-500 text-white ring-4 ring-red-200'
                      : selectedAnswer !== null && index === questions[currentQuestion].correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === index
                        ? 'bg-white/20'
                        : 'bg-gray-200'
                    }`}>
                      <span className={selectedAnswer === index ? 'text-white' : 'text-gray-600'}>
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-purple-600">
            <Sparkles className="w-5 h-5" />
            <span>Quiz Generator</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-gray-900 mb-4">API Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={saveApiKey}
                className="px-6 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                Save API Key
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAvatar 
        message="Paste any text or lesson content below, and I'll create a fun quiz to test your understanding! 📝"
        mood="happy"
      />

      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Your Content</h3>
          <button
            onClick={() => setContent(sampleContent)}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            Use Sample Text
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste the text, article, or lesson content you want to create a quiz from..."
          className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {content.split(' ').filter(w => w).length} words
          </span>
          <button
            onClick={generateQuiz}
            disabled={!content.trim() || isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
        <h3 className="text-gray-900 mb-3">🎯 How It Works</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">1.</span>
            <span>Paste your study material, article, or lesson text</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">2.</span>
            <span>Click "Generate Quiz" to create questions automatically</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">3.</span>
            <span>Answer the questions and see how much you've learned!</span>
          </li>
        </ul>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant 
        onCommand={(cmd) => {
          const command = cmd.toLowerCase();
          if (command.includes('generate') || command.includes('create quiz')) {
            generateQuiz();
            (window as any).todaiSpeak?.('Generating your quiz now');
          } else if (command.includes('restart') || command.includes('reset')) {
            handleRestart();
            (window as any).todaiSpeak?.('Quiz reset. Ready to create a new one!');
          } else if (questions.length > 0 && !showResult) {
            // Try to match answer options
            const optionMatch = command.match(/option\s*([a-d]|[1-4])/i);
            if (optionMatch) {
              const optionIndex = optionMatch[1].toLowerCase().charCodeAt(0) - 97;
              if (optionIndex >= 0 && optionIndex < 4) {
                setSelectedAnswer(optionIndex);
                (window as any).todaiSpeak?.(`Option ${String.fromCharCode(65 + optionIndex)} selected`);
              }
            }
          }
        }}
      />
    </div>
  );
}