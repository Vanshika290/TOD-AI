import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
  enabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  position?: 'fixed' | 'inline';
}

export function VoiceAssistant({ 
  onCommand, 
  enabled = true, 
  size = 'medium',
  position = 'fixed' 
}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);
        
        if (event.results[0].isFinal) {
          onCommand?.(currentTranscript);
          setTimeout(() => setTranscript(''), 2000);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setError('Voice recognition error. Please try again.');
        setIsListening(false);
        setTimeout(() => setError(''), 3000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (!enabled || !voiceEnabled) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setError('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current || !voiceEnabled) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const toggleVoice = () => {
    if (voiceEnabled && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  // Expose speak function globally
  useEffect(() => {
    (window as any).todaiSpeak = speak;
    return () => {
      delete (window as any).todaiSpeak;
    };
  }, [voiceEnabled]);

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-7 h-7'
  };

  if (!enabled) return null;

  const containerClasses = position === 'fixed' 
    ? 'fixed bottom-6 right-6 z-50' 
    : 'inline-flex';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-end gap-3">
        {/* Transcript Display */}
        <AnimatePresence>
          {(transcript || error) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`${position === 'fixed' ? 'max-w-xs' : 'max-w-md'} p-3 rounded-2xl shadow-lg ${
                error 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-white/95 backdrop-blur-sm border border-purple-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{error || transcript}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleVoice}
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg transition-colors ${
              voiceEnabled
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                : 'bg-gray-400 text-white'
            }`}
            title={voiceEnabled ? 'Mute Voice' : 'Enable Voice'}
          >
            {voiceEnabled ? (
              <Volume2 className={iconSizes[size]} />
            ) : (
              <VolumeX className={iconSizes[size]} />
            )}
          </motion.button>

          {/* Mic Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            disabled={!voiceEnabled}
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white animate-pulse'
                : voiceEnabled
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
          >
            {isListening ? (
              <MicOff className={iconSizes[size]} />
            ) : (
              <Mic className={iconSizes[size]} />
            )}
          </motion.button>
        </div>

        {/* Speaking Indicator */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full shadow-lg"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
                <span className="text-sm text-blue-700">Speaking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
