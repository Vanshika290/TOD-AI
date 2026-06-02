import { Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AIAvatarProps {
  message: string;
  mood?: 'happy' | 'encouraging' | 'celebrating' | 'thinking';
}

export function AIAvatar({ message, mood = 'happy' }: AIAvatarProps) {
  const getMoodColor = () => {
    switch (mood) {
      case 'happy': return 'from-yellow-400 to-orange-400';
      case 'encouraging': return 'from-blue-400 to-cyan-400';
      case 'celebrating': return 'from-purple-400 to-pink-400';
      case 'thinking': return 'from-green-400 to-teal-400';
      default: return 'from-yellow-400 to-orange-400';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 relative">
      {/* Avatar */}
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex-shrink-0"
        >
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getMoodColor()} flex items-center justify-center shadow-md`}>
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <div className="relative">
                {/* Simple friendly face */}
                <div className="flex gap-2 mb-1">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
                <div className="w-6 h-3 border-b-2 border-gray-800 rounded-b-full"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Message Bubble */}
        <div className="flex-1">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl rounded-tl-sm p-4">
            <p className="text-gray-800">{message}</p>
          </div>
          
          {/* Speech Button */}
          <button className="mt-2 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors">
            <Volume2 className="w-4 h-4" />
            <span>Hear Tod speak</span>
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full opacity-60"
      />
    </div>
  );
}
