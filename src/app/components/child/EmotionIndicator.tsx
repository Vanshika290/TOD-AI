import { motion } from 'motion/react';
import { Smile, Meh, Frown } from 'lucide-react';

interface EmotionIndicatorProps {
  level: 'high' | 'medium' | 'low';
  label?: string;
}

export function EmotionIndicator({ level, label = 'Engagement' }: EmotionIndicatorProps) {
  const getEmotionConfig = () => {
    switch (level) {
      case 'high':
        return {
          color: 'bg-green-500',
          icon: Smile,
          text: 'Great Focus!',
          ringColor: 'ring-green-200'
        };
      case 'medium':
        return {
          color: 'bg-yellow-500',
          icon: Meh,
          text: 'Doing Good',
          ringColor: 'ring-yellow-200'
        };
      case 'low':
        return {
          color: 'bg-orange-500',
          icon: Frown,
          text: 'Need a Break?',
          ringColor: 'ring-orange-200'
        };
    }
  };

  const config = getEmotionConfig();
  const Icon = config.icon;

  return (
    <div className="inline-flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-md">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`w-8 h-8 ${config.color} rounded-full flex items-center justify-center ring-4 ${config.ringColor}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="text-sm">
        <div className="text-gray-500 text-xs">{label}</div>
        <div className="text-gray-900">{config.text}</div>
      </div>
    </div>
  );
}
