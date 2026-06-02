import { Star, Sparkles, BookOpen, Brain, Trophy, Gamepad2, Blocks, ArrowRight, Calendar, Palette, Rocket, Music } from 'lucide-react';
import { AIAvatar } from '../child/AIAvatar';
import { EmotionIndicator } from '../child/EmotionIndicator';
import { motion } from 'motion/react';
import { VoiceAssistant } from '../VoiceAssistant';
import { DailyGoals } from '../DailyGoals';
import { DailySchedule } from '../DailySchedule';
import { useState, useEffect } from 'react';

interface SchoolDashboardProps {
  onNavigate: (view: string) => void;
}

export function SchoolDashboard({ onNavigate }: SchoolDashboardProps) {
  const [userName] = useState('Alex');
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    // Welcome message for kids
    if ((window as any).todaiSpeak) {
      setTimeout(() => {
        (window as any).todaiSpeak?.(`Hi ${userName}! Ready for some fun learning today? Let's play some games!`);
      }, 1000);
    }
  }, [userName]);

  const handleVoiceCommand = (command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('learning hub') || cmd.includes('stories') || cmd.includes('quiz') || cmd.includes('facts')) {
      onNavigate('learning-hub');
      (window as any).todaiSpeak?.('Opening the Learning Hub! Let\'s explore stories and quizzes!');
    } else if (cmd.includes('pattern') || cmd.includes('detective')) {
      onNavigate('pattern-game');
      (window as any).todaiSpeak?.('Let\'s play the pattern detective game!');
    } else if (cmd.includes('memory')) {
      onNavigate('memory-game');
      (window as any).todaiSpeak?.('Time to test your memory skills!');
    } else if (cmd.includes('lesson') || cmd.includes('learn')) {
      onNavigate('lesson');
      (window as any).todaiSpeak?.('Opening your lesson. Let\'s learn something new!');
    } else if (cmd.includes('reading') || cmd.includes('read')) {
      onNavigate('text-summarizer');
      (window as any).todaiSpeak?.('Let\'s practice reading!');
    } else {
      (window as any).todaiSpeak?.('Try saying: learning hub, play pattern game, or start lesson');
    }
  };

  const subjects = [
    { name: 'Math', progress: 75, icon: '🔢', color: 'bg-blue-500' },
    { name: 'Reading', progress: 60, icon: '📚', color: 'bg-purple-500' },
    { name: 'Science', progress: 85, icon: '🔬', color: 'bg-green-500' },
    { name: 'Writing', progress: 45, icon: '✏️', color: 'bg-orange-500' },
  ];

  const funActivities = [
    { 
      id: 'learning-hub', 
      name: 'Learning Hub', 
      icon: BookOpen, 
      color: 'from-pink-400 to-rose-500',
      description: 'Stories, quizzes & fun facts!',
      route: 'learning-hub'
    },
    { 
      id: 'pattern-game', 
      name: 'Pattern Detective', 
      icon: Blocks, 
      color: 'from-purple-400 to-pink-500',
      description: 'Find the hidden patterns!',
      route: 'pattern-game'
    },
    { 
      id: 'memory-game', 
      name: 'Memory Master', 
      icon: Sparkles, 
      color: 'from-green-400 to-teal-500',
      description: 'Test your super memory!',
      route: 'memory-game'
    },
    { 
      id: 'reading', 
      name: 'Reading Helper', 
      icon: BookOpen, 
      color: 'from-cyan-400 to-blue-500',
      description: 'Read and understand stories!',
      route: 'text-summarizer'
    },
    { 
      id: 'lessons', 
      name: 'Fun Lessons', 
      icon: Star, 
      color: 'from-yellow-400 to-orange-500',
      description: 'Learn new things!',
      route: 'lesson'
    },
    { 
      id: 'art-corner', 
      name: 'Art Corner', 
      icon: Palette, 
      color: 'from-red-400 to-pink-500',
      description: 'Draw and create art!',
      route: 'art-corner'
    },
    { 
      id: 'space-explorer', 
      name: 'Space Explorer', 
      icon: Rocket, 
      color: 'from-indigo-400 to-purple-500',
      description: 'Learn about planets & stars!',
      route: 'space-explorer'
    },
    { 
      id: 'music-time', 
      name: 'Music Time', 
      icon: Music, 
      color: 'from-violet-400 to-fuchsia-500',
      description: 'Play with sounds & rhythms!',
      route: 'music-time'
    },
  ];

  const achievements = [
    { emoji: '🌟', name: 'Reading Star', unlocked: true },
    { emoji: '🎯', name: 'Math Whiz', unlocked: true },
    { emoji: '🎨', name: 'Creative Mind', unlocked: false },
    { emoji: '🚀', name: 'Super Learner', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header - Kid Friendly */}
        <div className="flex justify-between items-start">
          <div>
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-gray-900 mb-2"
            >
              Hi {userName}! 👋🌈
            </motion.h1>
            <p className="text-gray-600 text-xl">Ready for some fun learning?</p>
          </div>
          <EmotionIndicator level="high" />
        </div>

        {/* AI Buddy */}
        <AIAvatar 
          message="Awesome job yesterday! Check out the new Learning Hub with fun stories and quizzes!" 
          mood="encouraging"
        />

        {/* Fun Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <div className="text-5xl mb-2">⭐</div>
            <div className="text-gray-900 mb-1">450</div>
            <div className="text-sm text-gray-600">Stars Today</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <div className="text-5xl mb-2">🔥</div>
            <div className="text-gray-900 mb-1">7 Days</div>
            <div className="text-sm text-gray-600">Learning Streak</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <div className="text-5xl mb-2">🎮</div>
            <div className="text-gray-900 mb-1">Level 4</div>
            <div className="text-sm text-gray-600">Your Level</div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Fun Activities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
              <h2 className="text-gray-900">Fun Activities! 🎮</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {funActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.button
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onNavigate(activity.route);
                      (window as any).todaiSpeak?.(`Let's explore ${activity.name}!`);
                    }}
                    className={`bg-gradient-to-br ${activity.color} rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all`}
                  >
                    <Icon className="w-12 h-12 mb-3 mx-auto" />
                    <div className="mb-2">{activity.name}</div>
                    <div className="text-sm text-white/90">{activity.description}</div>
                  </motion.button>
                );
              })}
            </div>

            {/* Learning Progress */}
            <div>
              <h2 className="text-gray-900 mb-4">Your Learning Journey 🗺️</h2>
              <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{subject.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-900">{subject.name}</div>
                          <div className="text-gray-900">{subject.progress}%</div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full ${subject.color} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <h2 className="text-gray-900">My Badges! 🏆</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: achievement.unlocked ? 1.1 : 1, rotate: achievement.unlocked ? 10 : 0 }}
                    className={`rounded-2xl p-4 text-center ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.emoji}</div>
                    <div className="text-xs text-gray-700">{achievement.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Schedule Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl p-6 shadow-lg"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <div className="mb-1">{showSchedule ? 'Hide' : 'Show'} My Schedule</div>
              <div className="text-sm text-white/90">Plan your whole day! 📅</div>
            </motion.button>
            
            {/* Daily Goal */}
            {!showSchedule && <DailyGoals studentType="primary" userName={userName} />}

            {/* Next Challenge */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onNavigate('learning-hub');
                (window as any).todaiSpeak?.('Let\'s explore the Learning Hub!');
              }}
              className="w-full bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-3xl p-6 shadow-lg group"
            >
              <div className="text-3xl mb-2">📚</div>
              <div className="mb-2">Try Learning Hub!</div>
              <div className="text-sm text-white/90 mb-3">Stories & Fun Facts!</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm">Let's Go</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.button>

            {/* Voice Help */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-5">
              <div className="text-2xl mb-2">🎤</div>
              <div className="text-gray-900 mb-2">Talk to Me!</div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Say: "Learning Hub"</p>
                <p>Say: "Play pattern game"</p>
                <p>Say: "Play memory game"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Schedule Section */}
        {showSchedule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <DailySchedule studentType="primary" userName={userName} />
          </motion.div>
        )}
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant onCommand={handleVoiceCommand} size="large" />
    </div>
  );
}