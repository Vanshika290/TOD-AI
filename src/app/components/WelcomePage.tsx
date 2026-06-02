import { motion } from 'motion/react';
import { ArrowRight, Brain, Zap, Target, Award, Sparkles, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Personalized education powered by Google Gemini AI',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Target,
      title: 'Adaptive Lessons',
      description: 'Content that adapts to your learning pace and style',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Zap,
      title: 'Instant Doubt Clearing',
      description: 'Get answers to your questions in real-time',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Award,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics',
      color: 'from-green-500 to-teal-600'
    }
  ];

  const stats = [
    { value: '10k+', label: 'Active Students' },
    { value: '500+', label: 'Courses' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'AI Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-purple-600" />
              </div>
              <span className="text-white text-2xl">Tod AI</span>
            </div>
            <Button
              onClick={onGetStarted}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              Sign In
            </Button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 py-12 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="inline-block"
                >
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">AI-Powered Adaptive Learning Platform</span>
                  </div>
                </motion.div>

                <h1 className="text-5xl lg:text-6xl text-white mb-6">
                  Transform Your Learning Journey with{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                    Tod AI
                  </span>
                </h1>

                <p className="text-xl text-white/90 leading-relaxed">
                  Experience personalized education powered by advanced AI technology. 
                  Whether you're a primary student, scholar student, or professional learner, 
                  Tod AI adapts to your unique learning style.
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    onClick={onGetStarted}
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-white/90 shadow-xl text-lg px-8"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Content - Feature Cards */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white mb-2">{feature.title}</h3>
                      <p className="text-white/80 text-sm">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="p-6 text-center text-white/60 text-sm"
        >
          <div className="max-w-7xl mx-auto">
            <p>© 2024 Tod AI. Empowering learners worldwide with AI-driven education.</p>
          </div>
        </motion.footer>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-pink-300/20 rounded-full blur-xl"
      />
    </div>
  );
}