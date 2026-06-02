import { BookOpen, Brain, Zap, FileText, MessageCircleQuestion, Trophy, Target, TrendingUp, Calendar, Clock, Code, Briefcase, Library, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { VoiceAssistant } from '../VoiceAssistant';
import { DailyGoals } from '../DailyGoals';
import { DailySchedule } from '../DailySchedule';
import { useState, useEffect } from 'react';

interface CollegeDashboardProps {
  onNavigate: (view: string) => void;
}

export function CollegeDashboard({ onNavigate }: CollegeDashboardProps) {
  const [greeting, setGreeting] = useState('');
  const [userName] = useState('Student');
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Welcome message
    if ((window as any).todaiSpeak) {
      setTimeout(() => {
        (window as any).todaiSpeak?.('Welcome to Tod AI. Your adaptive learning companion is ready to assist you.');
      }, 1000);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('doubt') || cmd.includes('question') || cmd.includes('ask')) {
      onNavigate('doubt-clearing');
      (window as any).todaiSpeak?.('Opening doubt clearing module');
    } else if (cmd.includes('quiz') || cmd.includes('test')) {
      onNavigate('quiz-generator');
      (window as any).todaiSpeak?.('Opening quiz generator');
    } else if (cmd.includes('summar') || cmd.includes('text')) {
      onNavigate('text-summarizer');
      (window as any).todaiSpeak?.('Opening text summarizer');
    } else if (cmd.includes('lesson') || cmd.includes('learn')) {
      onNavigate('lesson');
      (window as any).todaiSpeak?.('Opening adaptive lessons');
    } else {
      (window as any).todaiSpeak?.('Command not recognized. Try saying: open doubts, generate quiz, or summarize text');
    }
  };

  const modules = [
    {
      id: 'course-library',
      name: 'Course Library',
      description: 'Comprehensive courses for engineering students',
      icon: Library,
      color: 'from-purple-500 to-pink-600',
      route: 'course-library'
    },
    {
      id: 'code-playground',
      name: 'Code Playground',
      description: 'Write, run, and debug code with AI',
      icon: Code,
      color: 'from-green-500 to-teal-600',
      route: 'code-playground'
    },
    {
      id: 'study-resources',
      name: 'Study Resources',
      description: 'Premium learning materials and guides',
      icon: BookOpen,
      color: 'from-orange-500 to-red-600',
      route: 'study-resources'
    },
    {
      id: 'career-planner',
      name: 'Career Planner',
      description: 'Plan your path to professional success',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-600',
      route: 'career-planner'
    },
    {
      id: 'text-summarizer',
      name: 'Text Summarizer',
      description: 'AI-powered text analysis and summarization',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      route: 'text-summarizer'
    },
    {
      id: 'doubt-clearing',
      name: 'Doubt Clearing',
      description: 'Get instant answers to your questions',
      icon: MessageCircleQuestion,
      color: 'from-indigo-500 to-purple-600',
      route: 'doubt-clearing'
    },
    {
      id: 'quiz-generator',
      name: 'Quiz Generator',
      description: 'Create custom quizzes on any topic',
      icon: Zap,
      color: 'from-pink-500 to-red-600',
      route: 'quiz-generator'
    },
    {
      id: 'adaptive-lessons',
      name: 'Adaptive Lessons',
      description: 'Personalized learning paths',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600',
      route: 'lesson'
    }
  ];

  const stats = [
    { label: 'Study Streak', value: '12 days', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Completed', value: '24 modules', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Study Goal', value: '85%', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Today', value: '2.5 hrs', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' }
  ];

  const recentActivity = [
    { subject: 'Data Structures', topic: 'Binary Trees', time: '2 hours ago', progress: 85 },
    { subject: 'Algorithms', topic: 'Graph Traversal', time: 'Yesterday', progress: 92 },
    { subject: 'Database Systems', topic: 'SQL Optimization', time: '2 days ago', progress: 78 }
  ];

  const upcomingDeadlines = [
    { task: 'Algorithm Assignment', due: 'Tomorrow', priority: 'high' },
    { task: 'Database Project', due: 'In 3 days', priority: 'medium' },
    { task: 'Data Structures Quiz', due: 'Next week', priority: 'low' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-gray-900 mb-2">{greeting}! 👋</h1>
            <p className="text-gray-600">Ready to achieve your learning goals today?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Level</div>
              <div className="text-gray-900">Scholar Learner</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Modules */}
            <div>
              <h2 className="text-gray-900 mb-4">AI-Powered Tools</h2>
              <div className="grid grid-cols-2 gap-4">
                {modules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <motion.button
                      key={`${module.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onNavigate(module.route);
                        (window as any).todaiSpeak?.(`Opening ${module.name}`);
                      }}
                      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all text-left group"
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-gray-900 mb-2">{module.name}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-gray-900 mb-4">Recent Activity</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900">{activity.topic}</div>
                      <div className="text-sm text-gray-600">{activity.subject} · {activity.time}</div>
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activity.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="text-gray-900">{activity.progress}%</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div>
              <h2 className="text-gray-900 mb-4">Upcoming Deadlines</h2>
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      deadline.priority === 'high'
                        ? 'border-red-500 bg-red-50'
                        : deadline.priority === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className={`w-5 h-5 flex-shrink-0 ${
                        deadline.priority === 'high'
                          ? 'text-red-600'
                          : deadline.priority === 'medium'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm mb-1">{deadline.task}</div>
                        <div className="text-xs text-gray-600">Due {deadline.due}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Schedule Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <div className="mb-1">{showSchedule ? 'Hide' : 'Show'} Daily Schedule</div>
              <div className="text-sm text-white/90">Manage your time effectively</div>
            </motion.button>
            
            {/* Daily Goals - Study Plan */}
            {!showSchedule && <DailyGoals studentType="scholar" userName={userName} />}

            {/* Voice Assistant Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900">Voice Commands</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• "Open doubts"</p>
                <p>• "Generate quiz"</p>
                <p>• "Summarize text"</p>
                <p>• "Open lessons"</p>
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
            <DailySchedule studentType="scholar" userName={userName} />
          </motion.div>
        )}
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant onCommand={handleVoiceCommand} size="large" />
    </div>
  );
}