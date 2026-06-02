import { Star, Sparkles, BookOpen, Brain, Zap, Trophy, ArrowRight, Lock } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { EmotionIndicator } from './EmotionIndicator';
import { motion } from 'motion/react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function ChildDashboard({ onNavigate }: DashboardProps) {
  const subjects = [
    { name: 'Math', progress: 75, needsPractice: false, color: 'bg-blue-500', icon: '🔢' },
    { name: 'Reading', progress: 60, needsPractice: true, color: 'bg-purple-500', icon: '📚' },
    { name: 'Science', progress: 85, needsPractice: false, color: 'bg-green-500', icon: '🔬' },
    { name: 'Writing', progress: 45, needsPractice: true, color: 'bg-orange-500', icon: '✏️' },
  ];

  const learningPath = [
    { id: 1, title: 'Addition Basics', subject: 'Math', status: 'completed', locked: false },
    { id: 2, title: 'Word Families', subject: 'Reading', status: 'completed', locked: false },
    { id: 3, title: 'Multiplication', subject: 'Math', status: 'current', locked: false },
    { id: 4, title: 'Story Comprehension', subject: 'Reading', status: 'next', locked: false },
    { id: 5, title: 'Division', subject: 'Math', status: 'locked', locked: true },
  ];

  const cognitiveModules = [
    { id: 'text-summarizer', name: 'Text Summarizer', icon: BookOpen, color: 'from-cyan-400 to-blue-500', route: 'text-summarizer' },
    { id: 'pattern-game', name: 'Pattern Detective', icon: Brain, color: 'from-purple-400 to-pink-500', route: 'pattern-game' },
    { id: 'memory-game', name: 'Memory Master', icon: Sparkles, color: 'from-green-400 to-teal-500', route: 'memory-game' },
    { id: 'doubt-clearing', name: 'AI Doubt Clearing', icon: Star, color: 'from-orange-400 to-red-500', route: 'doubt-clearing' },
    { id: 'quiz-generator', name: 'Quiz Generator', icon: Zap, color: 'from-pink-400 to-purple-500', route: 'quiz-generator' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-gray-900 mb-1">Welcome back, Alex! 👋</h1>
          <p className="text-gray-600">Let's continue your learning adventure</p>
        </div>
        <EmotionIndicator level="high" />
      </div>

      {/* AI Avatar Section */}
      <AIAvatar 
        message="Great job on yesterday's lessons! Today, let's practice multiplication. I know you can do it!" 
        mood="encouraging"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-600">Points Today</span>
          </div>
          <div className="text-gray-900">450</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-gray-600">Streak</span>
          </div>
          <div className="text-gray-900">7 days 🔥</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-600">Level</span>
          </div>
          <div className="text-gray-900">Grade 4</div>
        </motion.div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning Path - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900">Your Learning Path 🗺️</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="space-y-3">
              {learningPath.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => !lesson.locked && onNavigate('lesson')}
                    disabled={lesson.locked}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      lesson.status === 'current'
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 ring-2 ring-purple-400 shadow-md'
                        : lesson.locked
                        ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                      {lesson.status === 'completed' && (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white">✓</span>
                        </div>
                      )}
                      {lesson.status === 'current' && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center"
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      {lesson.status === 'next' && (
                        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">{lesson.id}</span>
                        </div>
                      )}
                      {lesson.locked && (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <Lock className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 text-left">
                      <div className="text-gray-900">{lesson.title}</div>
                      <div className="text-sm text-gray-600">{lesson.subject}</div>
                    </div>

                    {/* Action */}
                    {lesson.status === 'current' && (
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 text-purple-600" />
                      </motion.div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cognitive Modules */}
          <div>
            <h2 className="text-gray-900 mb-4">Brain Boosters 🧠</h2>
            <div className="grid grid-cols-5 gap-3">
              {cognitiveModules.map((module) => {
                const Icon = module.icon;
                return (
                  <motion.button
                    key={module.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate(module.route)}
                    className={`bg-gradient-to-br ${module.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    <Icon className="w-8 h-8 mb-3 mx-auto" />
                    <div className="text-sm text-center">{module.name}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subjects Panel */}
        <div className="space-y-4">
          <h2 className="text-gray-900">Your Subjects</h2>
          
          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-4 shadow-md ${
                  subject.needsPractice ? 'ring-2 ring-orange-300' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{subject.icon}</div>
                  <div className="flex-1">
                    <div className="text-gray-900">{subject.name}</div>
                    {subject.needsPractice && (
                      <div className="text-xs text-orange-600">⚡ Needs Practice</div>
                    )}
                  </div>
                  <div className="text-gray-900">{subject.progress}%</div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full ${subject.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Daily Goal */}
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-orange-600" />
              <span className="text-gray-900">Daily Goal</span>
            </div>
            <div className="text-sm text-gray-700 mb-2">15 of 20 minutes</div>
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-orange-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}