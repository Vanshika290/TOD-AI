import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Sparkles, Brain, Zap, Target } from 'lucide-react';

interface StudentTypeSelectionProps {
  onSelect: (type: 'primary' | 'scholar') => void;
  userName: string;
}

export function StudentTypeSelection({ onSelect, userName }: StudentTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-300/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-gray-900 mb-4">
            Welcome, {userName}! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Let's personalize your learning experience
          </p>
          <p className="text-gray-500">
            Choose your learning level to get started
          </p>
        </motion.div>

        {/* Student Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Primary Student Card */}
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('primary')}
            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 text-left border-4 border-transparent hover:border-purple-300"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full blur-3xl" />
            
            <div className="relative">
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
                <span className="text-2xl">🎒</span>
                <span className="text-sm text-purple-700">Primary</span>
              </div>

              {/* Title */}
              <h2 className="text-gray-900 mb-3">
                Primary Student
              </h2>
              
              <p className="text-gray-600 mb-6">
                Fun, colorful, and engaging learning activities designed for young learners
              </p>

              {/* Features */}
              <div className="space-y-3">
                {[
                  { icon: Sparkles, text: 'Fun Games & Activities' },
                  { icon: Brain, text: 'Interactive Learning' },
                  { icon: Target, text: 'Progress Tracking' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex items-center justify-between"
              >
                <span className="text-purple-600">Get Started →</span>
                <div className="flex gap-1">
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl">🎮</span>
                  <span className="text-2xl">🌈</span>
                </div>
              </motion.div>
            </div>
          </motion.button>

          {/* Scholar Student Card */}
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('scholar')}
            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 text-left border-4 border-transparent hover:border-blue-300"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-full blur-3xl" />
            
            <div className="relative">
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              >
                <GraduationCap className="w-10 h-10 text-white" />
              </motion.div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                <span className="text-2xl">🎓</span>
                <span className="text-sm text-blue-700">Scholar Level</span>
              </div>

              {/* Title */}
              <h2 className="text-gray-900 mb-3">
                Scholar Student
              </h2>
              
              <p className="text-gray-600 mb-6">
                Professional tools and advanced features for higher education and focused study
              </p>

              {/* Features */}
              <div className="space-y-3">
                {[
                  { icon: Zap, text: 'AI-Powered Tools' },
                  { icon: Brain, text: 'Doubt Clearing System' },
                  { icon: Target, text: 'Advanced Analytics' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex items-center justify-between"
              >
                <span className="text-blue-600">Get Started →</span>
                <div className="flex gap-1">
                  <span className="text-2xl">📚</span>
                  <span className="text-2xl">💡</span>
                  <span className="text-2xl">🚀</span>
                </div>
              </motion.div>
            </div>
          </motion.button>
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            Don't worry! You can always change this later in your settings
          </p>
        </motion.div>
      </div>
    </div>
  );
}