import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Volume2, Settings, Sparkles } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { motion, AnimatePresence } from 'motion/react';
import { callGeminiAPI } from '../../utils/gemini-api';
import { VoiceAssistant } from '../VoiceAssistant';

interface DoubtClearingProps {
  onBack: () => void;
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function DoubtClearing({ onBack }: DoubtClearingProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm here to help you with any questions or doubts you have. Ask me anything about your homework, lessons, or any topic you're curious about! 🤗",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    // Load API key immediately on component mount
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowSettings(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (!apiKey) {
        // Show demo response if no API key
        setTimeout(() => {
          const demoResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "To use the AI chatbot, please add your Google Gemini API key in the settings (⚙️ icon). For now, here's a helpful tip: Breaking down complex problems into smaller steps makes them easier to solve! 🌟",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, demoResponse]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Call Gemini API using utility
      const assistantContent = await callGeminiAPI(apiKey, {
        prompt: `You are Tod, a friendly AI tutor for scholar students. Answer this question in a clear, encouraging way. Use emojis to make it engaging! Question: ${inputMessage}`,
        temperature: 0.7,
        maxOutputTokens: 500,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error:', error);
      
      let errorContent = `Sorry, I encountered an error: ${error.message || 'Please check your internet connection or API key.'} 😅`;
      
      // Provide helpful guidance for API setup issues
      if (error.message && error.message.includes('No models available')) {
        errorContent = `🔑 API Setup Required!\n\n` +
          `The Gemini API needs to be enabled for your API key.\n\n` +
          `📝 Quick Fix:\n` +
          `1. Open "api-setup-guide.html" in this project\n` +
          `2. Follow the setup steps\n` +
          `3. Enable the Generative Language API\n` +
          `4. Wait 1-2 minutes\n` +
          `5. Come back and try again!\n\n` +
          `The guide will help you test your API key and get everything working. 🚀`;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Try to use a child-friendly voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Google')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const quickQuestions = [
    "How do I solve 7 × 8?",
    "What is photosynthesis?",
    "Help me with fractions",
    "Explain the water cycle"
  ];

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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-purple-600">
            <Sparkles className="w-5 h-5" />
            <span>AI Doubt Clearing</span>
            {apiKey ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                ✓ AI Active
              </span>
            ) : (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                Demo Mode
              </span>
            )}
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
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
                <p className="text-xs text-gray-500 mt-1">
                  Get your free API key from{' '}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
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

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white">🤖</span>
                    </div>
                    <div>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl rounded-tl-sm p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <button
                        onClick={() => speakText(message.content)}
                        className="mt-2 flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  </div>
                )}
                {message.role === 'user' && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl rounded-tr-sm p-4">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white">🤖</span>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-2">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-full hover:bg-purple-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your question here..."
                className="w-full px-4 py-3 resize-none focus:outline-none"
                rows={2}
              />
            </div>
            <button
              onClick={handleVoiceInput}
              disabled={isListening}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Mic className="w-5 h-5" />
                </motion.div>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-gray-900 mb-3">💡 Tips for Asking Questions</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Be specific about what you don't understand</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>You can ask follow-up questions for more clarity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span>Use the microphone button to ask questions by speaking!</span>
          </li>
        </ul>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant 
        onCommand={(cmd) => {
          setInputMessage(cmd);
          (window as any).todaiSpeak?.('I heard: ' + cmd + '. Sending your question now.');
          setTimeout(() => {
            handleSendMessage();
          }, 500);
        }}
      />
    </div>
  );
}