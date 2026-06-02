import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, ExternalLink, CheckCircle, XCircle, Loader2, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { testGeminiConnection } from '../utils/gemini-api';

interface ApiKeySetupProps {
  onComplete?: () => void;
}

export function ApiKeySetup({ onComplete }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailedError, setDetailedError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [workingModel, setWorkingModel] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult('error');
      setErrorMessage('Please enter an API key');
      setDetailedError('');
      return;
    }

    // Validate API key format
    if (apiKey.trim().length < 20) {
      setTestResult('error');
      setErrorMessage('Invalid API key format');
      setDetailedError('API keys are typically 39 characters long. Please check your key.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setErrorMessage('');
    setDetailedError('');
    setWorkingModel('');
    setAvailableModels([]);

    try {
      const result = await testGeminiConnection(apiKey.trim());

      if (result.success) {
        setTestResult('success');
        setWorkingModel(result.model || 'Unknown');
        setAvailableModels(result.availableModels || []);
        localStorage.setItem('gemini_api_key', apiKey.trim());
        
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      } else {
        setTestResult('error');
        
        // Parse error and provide helpful messages
        const error = result.error || 'Unknown error';
        
        if (error.includes('API_KEY_INVALID') || error.includes('API key not valid') || error.includes('Invalid API key')) {
          setErrorMessage('Invalid API Key');
          setDetailedError(
            'Your API key is not recognized by Google. Please:\n' +
            '1. Double-check you copied the entire key (starts with "AIza")\n' +
            '2. Make sure there are no extra spaces before or after\n' +
            '3. Go to https://aistudio.google.com/app/apikey\n' +
            '4. Create a NEW API key in a NEW project\n' +
            '5. Wait 1-2 minutes before testing'
          );
        } else if (error.includes('overloaded') || error.includes('OVERLOADED') || error.includes('All Models Currently Overloaded')) {
          setErrorMessage('🚦 Models Temporarily Overloaded');
          setDetailedError(
            'Google\'s AI servers are experiencing high traffic right now.\n\n' +
            '💡 QUICK SOLUTIONS:\n\n' +
            '1. WAIT & RETRY (Recommended):\n' +
            '   • Wait 30-60 seconds\n' +
            '   • Click "Test Connection" again\n' +
            '   • Usually clears quickly!\n\n' +
            '2. Try different time:\n' +
            '   • Peak hours have more traffic\n' +
            '   • Early morning or late evening is better\n\n' +
            '⏰ This is temporary - not your fault!\n' +
            'The app will automatically try different models for you.\n\n' +
            'If this persists, check: https://status.cloud.google.com/'
          );
        } else if (error.includes('QUOTA_EXCEEDED') || error.includes('quota') || error.includes('Quota') || error.includes('All Models Quota Exceeded')) {
          setErrorMessage('🚨 Quota Limit Reached');
          setDetailedError(
            '💡 QUICK FIX (Takes 2 minutes):\n\n' +
            '1. Go to: https://aistudio.google.com/app/apikey\n' +
            '2. Click "Create API Key"\n' +
            '3. Select "Create API key in NEW PROJECT" ← Important!\n' +
            '4. Copy the new key\n' +
            '5. Paste it here and test again\n\n' +
            '✨ Each new project gets fresh quota limits!\n\n' +
            'Alternative: Wait 1-2 hours for quota to reset.\n\n' +
            '📊 Check usage at: https://aistudio.google.com/app/apikey'
          );
        } else if (error.includes('API_NOT_ENABLED') || error.includes('API has not been used') || error.includes('not enabled') || error.includes('not available') || error.includes('Not Enabled or Not Ready')) {
          setErrorMessage('API Not Enabled or Not Ready');
          setDetailedError(
            '🔴 The Generative Language API is NOT enabled or NOT ready yet.\n\n' +
            '⚠️ IMPORTANT STEPS:\n\n' +
            '1. Click this link: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n' +
            '2. Click the blue "ENABLE" button\n' +
            '3. Wait 2-5 minutes (VERY IMPORTANT!)\n' +
            '4. Come back and click "Test Connection" again\n\n' +
            '💡 TIP: If you just enabled it, you MUST wait. Google needs time to activate it.'
          );
        } else if (error.includes('billing')) {
          setErrorMessage('Billing Issue');
          setDetailedError(
            'There might be a billing issue with your Google Cloud account.\n' +
            'The free tier should work without billing, but sometimes you need to:\n' +
            '1. Verify your Google account\n' +
            '2. Check Google Cloud Console for any alerts'
          );
        } else {
          setErrorMessage('Connection Failed');
          setDetailedError(error);
        }
      }
    } catch (error: any) {
      setTestResult('error');
      setErrorMessage('Connection Error');
      setDetailedError(error.message || 'Failed to connect to Gemini API');
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const steps = [
    {
      number: 1,
      title: 'Get Your API Key',
      description: 'Click the button to open Google AI Studio. Sign in with your Google account and create a new API key.',
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
      description: 'Make sure the Generative Language API is enabled. Click "ENABLE" if you see the button, then wait 1-2 minutes.',
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
      description: 'Copy your API key (it starts with "AIza...") and paste it below. Then click "Test Connection".',
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
        <h1 className="text-gray-900 mb-3">Set Up Your AI Assistant</h1>
        <p className="text-gray-600 text-lg">
          Connect to Google Gemini to enable AI-powered features
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
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                {step.action && <div>{step.action}</div>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* API Key Input */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <label className="block text-gray-900 mb-3">
          Your API Key
        </label>
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
              onKeyPress={(e) => e.key === 'Enter' && handleTest()}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={handleTest}
            disabled={isTesting || !apiKey.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </button>
        </div>

        {/* Test Result */}
        <AnimatePresence>
          {testResult === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 bg-green-100 border border-green-300 rounded-xl"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-900 font-medium">Connection Successful! 🎉</p>
                <p className="text-green-700 text-sm mt-1">
                  Your API key is working perfectly. Using model: {workingModel}
                </p>
                {availableModels.length > 0 && (
                  <p className="text-green-600 text-xs mt-1">
                    Found {availableModels.length} available model{availableModels.length !== 1 ? 's' : ''}
                  </p>
                )}
                <p className="text-green-600 text-xs mt-1">
                  Redirecting to dashboard...
                </p>
              </div>
            </motion.div>
          )}

          {testResult === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 bg-red-100 border border-red-300 rounded-xl"
            >
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-900 font-medium">{errorMessage}</p>
                {detailedError && (
                  <p className="text-red-700 text-sm mt-2 whitespace-pre-line">
                    {detailedError}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Important Warnings */}
      <div className="space-y-4">
        {/* API Enabling Warning */}
        <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gray-900 mb-2">⚠️ Wait After Enabling API</h3>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-200">
            <p className="text-gray-700 text-sm mb-3">
              If you just enabled the Generative Language API, you MUST wait <strong className="text-orange-600">2-5 minutes</strong> before testing!
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
              <span className="text-2xl">⏰</span>
              <span>Close this page, wait 5 minutes, then come back and test!</span>
            </div>
          </div>
        </div>

        {/* Quota Info */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gray-900 mb-2">💡 Quota Exceeded?</h3>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <p className="text-gray-700 text-sm mb-3">
              If you get "Quota Exceeded" error, the app will automatically try other models. If all fail:
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-800 mb-2"><strong>Quick Fix (2 minutes):</strong></p>
              <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
                <li>Create new API key in a <strong>new project</strong></li>
                <li>Each project gets fresh quota limits!</li>
                <li>Paste new key here and test</li>
              </ol>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                <ExternalLink className="w-3 h-3" />
                Create New API Key
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-gray-900 mb-2">Troubleshooting Tips</h3>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Check the format:</strong> API keys start with "AIza" and are about 39 characters long</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Remove spaces:</strong> Make sure there are no spaces before or after the key</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Wait after enabling:</strong> After enabling the API, wait 1-2 minutes before testing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Try a new key:</strong> If nothing works, create a brand new API key from scratch</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Check restrictions:</strong> Make sure your API key has no IP or referrer restrictions</span>
          </li>
        </ul>
      </div>

      {/* Help Section */}
      <div className="text-center text-sm text-gray-600">
        <p>Need help? Check your API usage at{' '}
          <a 
            href="https://ai.dev/usage" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://ai.dev/usage
          </a>
        </p>
      </div>
    </div>
  );
}
