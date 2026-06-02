import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Briefcase,
  Target,
  TrendingUp,
  Award,
  Rocket,
  CheckCircle,
  Circle,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  Users,
  Star,
  BookOpen,
  Code,
  Brain,
  Zap,
  FileText,
  ExternalLink,
  Sparkles,
  GraduationCap,
  Trophy,
  LineChart
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { callGeminiAPI } from '../../utils/gemini-api';

interface CareerPlannerProps {
  onBack: () => void;
}

interface CareerPath {
  id: string;
  title: string;
  icon: any;
  description: string;
  avgSalary: string;
  demand: 'High' | 'Medium' | 'Growing';
  skills: string[];
  companies: string[];
  color: string;
}

interface LearningPath {
  id: string;
  title: string;
  completed: boolean;
  duration: string;
}

export function CareerPlanner({ onBack }: CareerPlannerProps) {
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [careerProgress, setCareerProgress] = useState(45);

  const careerPaths: CareerPath[] = [
    {
      id: 'swe',
      title: 'Software Engineer',
      icon: Code,
      description: 'Design, develop, and maintain software applications and systems.',
      avgSalary: '$95k - $180k',
      demand: 'High',
      skills: ['DSA', 'System Design', 'Programming Languages', 'Problem Solving', 'Git'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'ml-engineer',
      title: 'ML Engineer',
      icon: Brain,
      description: 'Build and deploy machine learning models and AI systems.',
      avgSalary: '$110k - $200k',
      demand: 'High',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Statistics', 'Deep Learning'],
      companies: ['OpenAI', 'DeepMind', 'NVIDIA', 'Meta', 'Google'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'full-stack',
      title: 'Full Stack Developer',
      icon: Zap,
      description: 'Create complete web applications from frontend to backend.',
      avgSalary: '$85k - $150k',
      demand: 'High',
      skills: ['React', 'Node.js', 'Databases', 'REST APIs', 'Cloud Platforms'],
      companies: ['Shopify', 'Stripe', 'Vercel', 'Netlify', 'AWS'],
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      icon: LineChart,
      description: 'Analyze complex data and build predictive models for business insights.',
      avgSalary: '$100k - $190k',
      demand: 'High',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization'],
      companies: ['Netflix', 'Airbnb', 'Spotify', 'Uber', 'LinkedIn'],
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      icon: Rocket,
      description: 'Automate deployment, scaling, and management of applications.',
      avgSalary: '$90k - $170k',
      demand: 'Growing',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS/Azure', 'Linux'],
      companies: ['HashiCorp', 'GitLab', 'Docker', 'Red Hat', 'Atlassian'],
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Analyst',
      icon: Award,
      description: 'Protect systems and networks from security threats and attacks.',
      avgSalary: '$85k - $160k',
      demand: 'Growing',
      skills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Risk Assessment'],
      companies: ['Palo Alto Networks', 'CrowdStrike', 'Cisco', 'FireEye', 'IBM'],
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'cloud-architect',
      title: 'Cloud Architect',
      icon: Building,
      description: 'Design and oversee cloud computing strategies and infrastructure.',
      avgSalary: '$120k - $210k',
      demand: 'High',
      skills: ['AWS', 'Azure', 'GCP', 'Architecture Design', 'Security'],
      companies: ['Amazon', 'Microsoft', 'Google', 'Oracle', 'Salesforce'],
      color: 'from-sky-500 to-blue-600'
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Developer',
      icon: Zap,
      description: 'Build native and cross-platform mobile applications.',
      avgSalary: '$80k - $150k',
      demand: 'Medium',
      skills: ['React Native', 'Flutter', 'iOS/Android', 'Mobile UI/UX'],
      companies: ['Spotify', 'Instagram', 'WhatsApp', 'Twitter', 'Snapchat'],
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  const milestones = [
    {
      title: 'Master DSA Fundamentals',
      status: 'completed',
      description: 'Complete core data structures and algorithms',
      points: 250
    },
    {
      title: 'Build 3 Full-Stack Projects',
      status: 'in-progress',
      description: 'Create portfolio-worthy applications',
      points: 500
    },
    {
      title: 'Complete System Design Course',
      status: 'upcoming',
      description: 'Learn scalable system architecture',
      points: 300
    },
    {
      title: 'Contribute to Open Source',
      status: 'upcoming',
      description: 'Make meaningful contributions to projects',
      points: 400
    },
    {
      title: 'Crack Technical Interviews',
      status: 'upcoming',
      description: 'Practice and excel in coding interviews',
      points: 600
    }
  ];

  const upcomingEvents = [
    {
      title: 'Google Summer of Code',
      date: 'Mar 2025',
      type: 'Program',
      icon: Calendar
    },
    {
      title: 'Tech Career Fair',
      date: 'Dec 2024',
      type: 'Event',
      icon: Users
    },
    {
      title: 'Hackathon Season',
      date: 'Jan 2025',
      type: 'Competition',
      icon: Trophy
    }
  ];

  const learningPaths: Record<string, LearningPath[]> = {
    swe: [
      { id: '1', title: 'Master Data Structures & Algorithms', completed: true, duration: '12 weeks' },
      { id: '2', title: 'System Design Fundamentals', completed: false, duration: '8 weeks' },
      { id: '3', title: 'Advanced Problem Solving', completed: false, duration: '10 weeks' },
      { id: '4', title: 'Build 5 Portfolio Projects', completed: false, duration: '16 weeks' },
      { id: '5', title: 'Interview Preparation', completed: false, duration: '6 weeks' }
    ],
    'ml-engineer': [
      { id: '1', title: 'Python for Data Science', completed: true, duration: '8 weeks' },
      { id: '2', title: 'Machine Learning Fundamentals', completed: false, duration: '12 weeks' },
      { id: '3', title: 'Deep Learning & Neural Networks', completed: false, duration: '10 weeks' },
      { id: '4', title: 'MLOps & Deployment', completed: false, duration: '8 weeks' },
      { id: '5', title: 'Build ML Projects Portfolio', completed: false, duration: '14 weeks' }
    ],
    'full-stack': [
      { id: '1', title: 'Frontend Development (React)', completed: true, duration: '10 weeks' },
      { id: '2', title: 'Backend Development (Node.js)', completed: false, duration: '10 weeks' },
      { id: '3', title: 'Database Design & Management', completed: false, duration: '8 weeks' },
      { id: '4', title: 'DevOps & Deployment', completed: false, duration: '6 weeks' },
      { id: '5', title: 'Build Full-Stack Applications', completed: false, duration: '12 weeks' }
    ]
  };

  const getAICareerInsight = async (career: CareerPath) => {
    setIsLoadingAI(true);
    try {
      const prompt = `As a career advisor for engineering students interested in becoming a ${career.title}, provide:
1. Key preparation steps (2-3 points)
2. Most important skills to focus on
3. One actionable tip for getting started

Keep it concise and motivating.`;
      
      const response = await callGeminiAPI(prompt);
      setAiInsight(response);
      (window as any).todaiSpeak?.('AI career insights are ready.');
    } catch (error) {
      toast.error('Failed to get career insights');
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    (window as any).todaiSpeak?.('Welcome to Career Planner. Plan your path to success with AI-powered guidance.');
  }, []);

  const handleCareerSelect = (career: CareerPath) => {
    setSelectedCareer(career);
    getAICareerInsight(career);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Career Planner</h1>
              <p className="text-gray-600">Design your path to professional success</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-700">
              <Target className="w-4 h-4 mr-1" />
              {careerProgress}% Ready
            </Badge>
            <Badge className="bg-purple-100 text-purple-700">
              <Trophy className="w-4 h-4 mr-1" />
              850 XP
            </Badge>
          </div>
        </div>

        {/* Career Readiness */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white mb-2">Your Career Readiness</h2>
              <p className="text-white/90">Keep building skills to reach your goals</p>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-1">{careerProgress}%</div>
              <div className="text-sm text-white/90">Interview Ready</div>
            </div>
          </div>
          <Progress value={careerProgress} className="h-3 bg-white/20" />
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl mb-1">12</div>
              <div className="text-sm text-white/80">Skills Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">5</div>
              <div className="text-sm text-white/80">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">150+</div>
              <div className="text-sm text-white/80">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">3</div>
              <div className="text-sm text-white/80">Certifications</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Career Paths */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-gray-900 mb-4">Explore Career Paths</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {careerPaths.map((career, index) => {
                  const Icon = career.icon;
                  return (
                    <motion.button
                      key={career.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => handleCareerSelect(career)}
                      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all text-left border border-gray-100"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${career.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-gray-900 mb-2">{career.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{career.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {career.demand} Demand
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {career.avgSalary}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{career.skills.length} key skills</span>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h2 className="text-gray-900 mb-4">Career Milestones</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`mt-1 ${
                      milestone.status === 'completed'
                        ? 'text-green-600'
                        : milestone.status === 'in-progress'
                        ? 'text-blue-600'
                        : 'text-gray-300'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 fill-current" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-gray-900">{milestone.title}</h3>
                        <Badge className={`
                          ${milestone.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                          ${milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : ''}
                          ${milestone.status === 'upcoming' ? 'bg-gray-100 text-gray-700' : ''}
                        `}>
                          +{milestone.points} XP
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-gray-900">Upcoming Events</h3>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <div key={index} className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-gray-900 text-sm mb-1">{event.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{event.type}</Badge>
                            <span className="text-xs text-gray-600">{event.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-5 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-green-600" />
                <h3 className="text-gray-900">Your Progress</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Skills Mastery</span>
                    <span className="text-gray-900">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Project Portfolio</span>
                    <span className="text-gray-900">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Interview Readiness</span>
                    <span className="text-gray-900">55%</span>
                  </div>
                  <Progress value={55} className="h-2" />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">Career Resources</h3>
              </div>
              <div className="space-y-2">
                {['Resume Templates', 'Interview Tips', 'Salary Guide', 'Networking Tips'].map(resource => (
                  <button key={resource} className="w-full text-left p-2 rounded-lg hover:bg-white transition-colors text-sm text-gray-700">
                    <FileText className="w-4 h-4 inline mr-2" />
                    {resource}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Detail Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCareer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${selectedCareer.color} p-8 text-white`}>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="float-right text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  ✕
                </button>
                <div className="flex items-start gap-4">
                  {(() => {
                    const Icon = selectedCareer.icon;
                    return (
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                    );
                  })()}
                  <div className="flex-1">
                    <h2 className="text-white mb-2">{selectedCareer.title}</h2>
                    <p className="text-white/90 mb-4">{selectedCareer.description}</p>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-white/20 text-white border-white/30">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {selectedCareer.avgSalary}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {selectedCareer.demand} Demand
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* AI Insights */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="text-gray-900">AI Career Guidance</h3>
                  </div>
                  {isLoadingAI ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent" />
                      <span>Getting personalized insights...</span>
                    </div>
                  ) : aiInsight ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiInsight}</p>
                  ) : null}
                </div>

                {/* Key Skills */}
                <div>
                  <h3 className="text-gray-900 mb-3">Essential Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills.map(skill => (
                      <Badge key={skill} className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-900">
                        <Star className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Top Companies */}
                <div>
                  <h3 className="text-gray-900 mb-3">Top Hiring Companies</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCareer.companies.map(company => (
                      <div key={company} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <Building className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{company}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Path */}
                {learningPaths[selectedCareer.id] && (
                  <div>
                    <h3 className="text-gray-900 mb-3">Recommended Learning Path</h3>
                    <div className="space-y-2">
                      {learningPaths[selectedCareer.id].map((step, index) => (
                        <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600 fill-current flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-gray-500">{index + 1}</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">{step.title}</div>
                            <div className="text-xs text-gray-600">{step.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Button className={`w-full bg-gradient-to-r ${selectedCareer.color} text-white`}>
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Your Journey
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
