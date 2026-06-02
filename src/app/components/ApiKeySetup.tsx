import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, ExternalLink, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { callGeminiAPI } from '../utils/gemini-api';

interface ApiKeySetupProps {
  onComplete?: () => void;
}

export function ApiKeySetup({ onComplete }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isTestng, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult('error');
      setErrorMessage('Please enter an API key');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setErrorMessage('');

    try {
      const response = await callGeminiAPI(apiKey.trim(), {
        prompt: 'Say "Hello! I am Tod AI, your learning assistant." in a friendly way.',
        temperature: 0.7,
        maxOutputTokens: 100,
      });

      if (response) {
        setTestResult('success');
        localStorage.setItem('gemini_api_key', apiKey.trim());
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }
    } catch (error: any) {
      setTestResult('error');
      setErrorMessage(error.message || 'Failed to connect to Gemini API');
    } finally {
      setIsTesting(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Get Your API Key',
      description: 'Visit Google AI Studio to create a free API key',
      action: (
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Open AI Studio <ExternalLink className="w-4 h-4" />
        </a>
      ),
    },
    {
      number: 2,
      title: 'Enable the API',
      description: 'Make sure the Generative Language API is enabled',
      action: (
        <a
          href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Enable API <ExternalLink className="w-4 h-4" />
        </a>
      ),
    },
    {
      number: 3,
      title: 'Enter Your Key',
      description: 'Paste your API key below and test the connection',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6"
        >
          <Key className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-gray-900 mb-3">Setup Google Gemini AI</h1>
        <p className="text-gray-600 text-lg">
          Enable AI-powered features in Tod AI by connecting to Google Gemini
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                {step.action}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* API Key Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200"
      >
        <label className="block mb-3">
          <span className="text-gray-900 mb-2 flex items-center gap-2">
            <Key className="w-5 h-5" />
            Your Gemini API Key
          </span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setTestResult(null);
              setErrorMessage('');
            }}
            placeholder="AIza..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </label>

        {/* Test Result */}
        <AnimatePresence>
          {testResult === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 rounded-xl text-green-800 mb-4"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">✨ Connected successfully! API key saved.</span>
            </motion.div>
          )}

          {testResult === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800 mb-4"
            >
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm flex-1">
                <p className="mb-1">Failed to connect</p>
                <p className="text-xs text-red-700">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Button */}
        <button
          onClick={handleTest}
          disabled={!apiKey.trim() || isTestng}
          className="w-full py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isTestng ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Test & Save API Key
            </>
          )}
        </button>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <div className="text-gray-900 mb-2">Important Notes</div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Your API key is stored locally in your browser</li>
              <li>• Tod AI is not designed for collecting PII or sensitive data</li>
              <li>• The free tier includes 60 requests per minute</li>
              <li>• Make sure to enable the Generative Language API in Google Cloud Console</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Skip Option */}
      {onComplete && (
        <div className="text-center">
          <button
            onClick={onComplete}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip for now (you can set this up later in settings)
          </button>
        </div>
      )}
    </div>
  );
}
