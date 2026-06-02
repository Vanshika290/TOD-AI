import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Sparkles, Mic, MicOff, Trash2, Settings, Info } from 'lucide-react';
import { callGeminiAPI } from '../utils/gemini-api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GlobalAIAssistantProps {
  currentContext?: string; // e.g., "school-dashboard", "text-summarizer", etc.
  userName?: string;
  studentType?: 'school' | 'college';
}

export function GlobalAIAssistant({ currentContext, userName, studentType }: GlobalAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyPrompt(true);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const getContextualSystemMessage = () => {
    let context = `You are Tod AI, an intelligent learning assistant. `;
    
    if (userName) {
      context += `You're talking to ${userName}. `;
    }

    if (studentType === 'school') {
      context += `This is a school student (K-8 grade), so use simple, fun, and encouraging language with emojis. `;
    } else if (studentType === 'college') {
      context += `This is a college student, so use professional and detailed explanations. `;
    }

    switch (currentContext) {
      case 'school-dashboard':
        context += `The user is on the School Dashboard. Help them navigate features like pattern games, memory games, reading helper, and fun lessons.`;
        break;
      case 'college-dashboard':
        context += `The user is on the College Dashboard. Assist with text summarization, doubt clearing, quiz generation, and adaptive lessons.`;
        break;
      case 'text-summarizer':
        context += `The user is using the Text Summarizer. Help them understand texts, create summaries, and explain concepts.`;
        break;
      case 'doubt-clearing':
        context += `The user is in the Doubt Clearing module. Answer their questions clearly and provide detailed explanations.`;
        break;
      case 'quiz-generator':
        context += `The user is using the Quiz Generator. Help them create quizzes, understand topics, and prepare for tests.`;
        break;
      case 'pattern-game':
        context += `The user is playing the Pattern Detective game. Give hints and explain patterns in a fun way.`;
        break;
      case 'memory-game':
        context += `The user is playing the Memory Master game. Encourage them and give tips to improve memory.`;
        break;
      case 'lesson':
        context += `The user is viewing adaptive lessons. Help explain concepts and answer questions about the material.`;
        break;
      default:
        context += `Answer any questions the user has about learning, studying, or using the Tod AI platform.`;
    }

    return context;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!apiKey) {
      setShowApiKeyPrompt(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const systemContext = getContextualSystemMessage();
      const conversationHistory = messages
        .slice(-5) // Last 5 messages for context
        .map(m => `${m.role === 'user' ? 'User' : 'Tod AI'}: ${m.content}`)
        .join('\n');

      const fullPrompt = `${systemContext}\n\nConversation History:\n${conversationHistory}\n\nUser: ${inputValue}\n\nTod AI:`;

      const response = await callGeminiAPI(apiKey, {
        prompt: fullPrompt,
        temperature: 0.7,
        maxOutputTokens: 1024,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Text-to-speech for responses (if available)
      if ((window as any).todaiSpeak && studentType === 'school') {
        // Only auto-speak for school students to keep it fun
        (window as any).todaiSpeak(response.substring(0, 200)); // First 200 chars
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${error.message}\n\n${
          error.message.includes('quota') || error.message.includes('Quota')
            ? 'Try again in a few minutes, or generate a new API key.'
            : error.message.includes('Invalid API key') || error.message.includes('API key')
            ? 'Please check your API key in settings.'
            : 'Please try again or check your settings.'
        }`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiKeyPrompt(false);
    }
  };

  const clearChat = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group ${
              studentType === 'school'
                ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500'
                : 'bg-gradient-to-br from-blue-600 to-purple-600'
            }`}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            
            {/* Pulse effect */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className={`absolute inset-0 rounded-full ${
                studentType === 'school'
                  ? 'bg-purple-400'
                  : 'bg-blue-400'
              }`}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className={`p-4 ${
              studentType === 'school'
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            } text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <div className="font-semibold">Tod AI Assistant</div>
                    <div className="text-xs text-white/80">
                      {studentType === 'school' ? 'Your Fun Learning Buddy! 🌟' : 'Your Learning Companion'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowApiKeyPrompt(true)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* API Key Prompt */}
            <AnimatePresence>
              {showApiKeyPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-blue-50 border-b border-blue-200"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="mb-2">Enter your Google Gemini API key to enable AI features.</p>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Get your free API key →
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter API key..."
                      className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={saveApiKey}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowApiKeyPrompt(false)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  </motion.div>
                  <p className="text-gray-500 mb-2">
                    {studentType === 'school' 
                      ? 'Hi! Ask me anything! 🌟' 
                      : 'Start a conversation with Tod AI'}
                  </p>
                  <p className="text-sm text-gray-400">
                    I can help you with learning, questions, or anything else!
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? studentType === 'school'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">Tod AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={studentType === 'school' ? 'Ask me anything! 🌟' : 'Ask me anything...'}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    studentType === 'school'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}