import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ApiKeySetup } from './ApiKeySetup';

export function FirstTimeSetup() {
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const hasApiKey = localStorage.getItem('gemini_api_key');
    const hasSeenSetup = localStorage.getItem('todai_seen_setup');
    
    if (!hasApiKey && !hasSeenSetup) {
      // Show setup after a short delay
      setTimeout(() => {
        setShowSetup(true);
      }, 2000);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('todai_seen_setup', 'true');
    setShowSetup(false);
  };

  const handleSkip = () => {
    localStorage.setItem('todai_seen_setup', 'true');
    setShowSetup(false);
  };

  return (
    <AnimatePresence>
      {showSetup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleSkip}
          />

          {/* Setup Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl max-h-[90vh] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Content */}
            <div className="h-full overflow-y-auto p-8">
              <ApiKeySetup onComplete={handleComplete} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
