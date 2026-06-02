import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Copy, RotateCcw, Settings } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { motion, AnimatePresence } from 'motion/react';
import { callGeminiAPI } from '../../utils/gemini-api';
import { VoiceAssistant } from '../VoiceAssistant';

interface TextSummarizerProps {
  onBack: () => void;
}

export function TextSummarizer({ onBack }: TextSummarizerProps) {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Load API key on mount
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

  const sampleText = "The water cycle is the continuous movement of water on, above, and below the surface of the Earth. Water can change states among liquid, vapor, and ice at various places in the water cycle. The sun heats up water in rivers, lakes, and oceans and turns it into vapor or steam. The water vapor leaves the river, lake, or ocean and goes into the air. This process is called evaporation. When the water vapor in the air gets cold, it turns back into liquid, forming clouds. This process is called condensation. When the clouds get heavy with water, the water falls back to the earth as rain, snow, sleet, or hail. This is called precipitation.";

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setIsSummarizing(true);
    
    try {
      if (!apiKey) {
        // Fallback to simple summarization without API
        setTimeout(() => {
          const sentences = inputText.match(/[^\.!\?]+[\.!\?]+/g) || [];
          let mockSummary = '';
          
          if (sentences.length <= 3) {
            mockSummary = inputText.trim();
          } else {
            const firstSentence = sentences[0]?.trim() || '';
            const middleSentence = sentences[Math.floor(sentences.length / 2)]?.trim() || '';
            const lastSentence = sentences[sentences.length - 1]?.trim() || '';
            mockSummary = `${firstSentence} ${middleSentence} ${lastSentence}`;
          }
          
          if (mockSummary.split(' ').length > inputText.split(' ').length * 0.7) {
            const shortSummary = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 2))).join(' ');
            mockSummary = shortSummary;
          }
          
          setSummary(mockSummary.trim());
          setIsSummarizing(false);
        }, 2000);
        return;
      }

      // Call Gemini API for intelligent summarization using utility
      const aiSummary = await callGeminiAPI(apiKey, {
        prompt: `Please provide a clear and concise summary of the following text. Keep the main ideas and important information. Make it about 30-40% of the original length:\n\n${inputText}`,
        temperature: 0.3,
        maxOutputTokens: 500,
      });
      
      setSummary(aiSummary.trim());
    } catch (error: any) {
      console.error('Error summarizing:', error);
      
      // Check if it's an API setup issue
      if (error.message && error.message.includes('No models available')) {
        alert(
          '⚠️ API Setup Required\n\n' +
          'The Gemini API needs to be enabled for your API key.\n\n' +
          'Please open "api-setup-guide.html" in this project to complete the setup.\n\n' +
          'Steps:\n' +
          '1. Enable the Generative Language API\n' +
          '2. Wait 1-2 minutes\n' +
          '3. Try again'
        );
      }
      
      // Fallback to simple summarization
      const sentences = inputText.match(/[^\.!\?]+[\.!\?]+/g) || [];
      const shortSummary = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 2))).join(' ');
      setSummary(shortSummary || inputText.substring(0, 200) + '...');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setSummary('');
  };

  const handleUseSample = () => {
    setInputText(sampleText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
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
        <div className="flex items-center gap-2 text-purple-600">
          <Sparkles className="w-5 h-5" />
          <span>Text Summarizer</span>
        </div>
      </div>

      {/* AI Avatar */}
      <AIAvatar 
        message="Hi! I can help you summarize long texts into shorter, easier-to-understand versions. Just paste your text and click 'Summarize'!"
        mood="happy"
      />

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Your Text</h3>
            <button
              onClick={handleUseSample}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Use Sample Text
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type the text you want to summarize here..."
              className="w-full h-80 p-6 text-gray-900 resize-none focus:outline-none"
            />
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
              <span className="text-sm text-gray-600">
                {inputText.split(' ').filter(w => w).length} words
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </button>
                <button
                  onClick={handleSummarize}
                  disabled={!inputText.trim() || isSummarizing}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Summarize
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <h3 className="text-gray-900">Summary</h3>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[400px] flex flex-col">
            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                {isSummarizing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center gap-4"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-gray-600">Summarizing your text...</p>
                    
                    {/* Animated shrinking paragraph */}
                    <div className="w-full max-w-xs space-y-2 mt-4">
                      <motion.div
                        animate={{ width: ['100%', '100%', '60%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-2 bg-purple-200 rounded"
                      />
                      <motion.div
                        animate={{ width: ['100%', '100%', '50%'] }}
                        transition={{ duration: 2, delay: 0.2, repeat: Infinity }}
                        className="h-2 bg-purple-200 rounded"
                      />
                      <motion.div
                        animate={{ width: ['100%', '100%', '40%'] }}
                        transition={{ duration: 2, delay: 0.4, repeat: Infinity }}
                        className="h-2 bg-purple-200 rounded"
                      />
                    </div>
                  </motion.div>
                ) : summary ? (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full"
                  >
                    <div className="text-gray-900 leading-relaxed">{summary}</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center text-gray-400"
                  >
                    Your summary will appear here
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {summary && !isSummarizing && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
                <span className="text-sm text-gray-600">
                  {summary.split(' ').filter(w => w).length} words
                  <span className="text-green-600 ml-2">
                    ({Math.round((1 - summary.split(' ').length / inputText.split(' ').length) * 100)}% shorter! 🎉)
                  </span>
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-gray-900 mb-3">💡 Tips for Better Summaries</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 mt-1">•</span>
            <span>Use full paragraphs or articles for best results</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 mt-1">•</span>
            <span>The AI keeps the most important information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 mt-1">•</span>
            <span>Great for studying and understanding complex topics!</span>
          </li>
        </ul>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant 
        onCommand={(cmd) => {
          if (cmd.toLowerCase().includes('summarize') || cmd.toLowerCase().includes('summary')) {
            handleSummarize();
            (window as any).todaiSpeak?.('Summarizing your text now');
          } else if (cmd.toLowerCase().includes('sample') || cmd.toLowerCase().includes('example')) {
            setInputText(sampleText);
            (window as any).todaiSpeak?.('Sample text loaded');
          } else if (cmd.toLowerCase().includes('clear') || cmd.toLowerCase().includes('reset')) {
            handleReset();
            (window as any).todaiSpeak?.('Text cleared');
          } else if (cmd.toLowerCase().includes('copy')) {
            handleCopy();
          }
        }}
      />
    </div>
  );
}