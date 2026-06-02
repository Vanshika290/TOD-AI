import { useState } from 'react';
import { User, Clock, TrendingUp, Brain, BookOpen, Mic, Activity, Calendar, ChevronRight, Download, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ParentDashboardProps {
  onBack?: () => void;
}

export function ParentDashboard({ onBack }: ParentDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [selectedChild] = useState('Alex');

  // Mock data for charts
  const engagementData = [
    { date: 'Mon', engagement: 85, focus: 78 },
    { date: 'Tue', engagement: 75, focus: 72 },
    { date: 'Wed', engagement: 90, focus: 88 },
    { date: 'Thu', engagement: 82, focus: 80 },
    { date: 'Fri', engagement: 88, focus: 85 },
    { date: 'Sat', engagement: 95, focus: 92 },
    { date: 'Sun', engagement: 80, focus: 75 },
  ];

  const subjectProgressData = [
    { subject: 'Math', progress: 75, improvement: 12 },
    { subject: 'Reading', progress: 60, improvement: 8 },
    { subject: 'Science', progress: 85, improvement: 15 },
    { subject: 'Writing', progress: 45, improvement: 5 },
  ];

  const cognitiveData = [
    { module: 'Pattern Recognition', score: 850, sessions: 12 },
    { module: 'Text Summarization', score: 720, sessions: 8 },
    { module: 'Memory Exercises', score: 900, sessions: 15 },
  ];

  const recentActivities = [
    { time: '2 hours ago', activity: 'Completed Multiplication lesson', subject: 'Math', score: 95 },
    { time: '5 hours ago', activity: 'Practiced Pattern Recognition', subject: 'Cognitive', score: 88 },
    { time: 'Yesterday', activity: 'Story Comprehension Quiz', subject: 'Reading', score: 78 },
    { time: '2 days ago', activity: 'Memory Master Level 3', subject: 'Cognitive', score: 92 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h1 className="text-gray-900 mb-1">Parent Dashboard</h1>
            <p className="text-gray-600">Monitor {selectedChild}'s learning progress</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Learning Time</div>
              <div className="text-gray-900">8.5 hrs</div>
            </div>
          </div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+2.5 hrs from last week</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Avg Engagement</div>
              <div className="text-gray-900">85%</div>
            </div>
          </div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>High focus level</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Lessons Done</div>
              <div className="text-gray-900">24</div>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            Grade 4 level
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Cognitive Score</div>
              <div className="text-gray-900">823</div>
            </div>
          </div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+156 this week</span>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Engagement Chart - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Engagement Over Time */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-gray-900 mb-1">Engagement & Focus Tracking</h2>
                <p className="text-sm text-gray-600">Real-time emotional monitoring data</p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  name="Engagement %"
                />
                <Line 
                  type="monotone" 
                  dataKey="focus" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', r: 4 }}
                  name="Focus Level %"
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-900">
                <strong>Insight:</strong> {selectedChild} shows consistently high engagement during morning sessions (Mon, Wed, Sat). 
                Consider scheduling challenging subjects during these peak focus times.
              </p>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-gray-900 mb-6">Subject Progress & Weak Areas</h2>
            
            <div className="space-y-4">
              {subjectProgressData.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{subject.subject}</span>
                      {subject.progress < 60 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          Needs Practice
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{subject.progress}%</span>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{subject.improvement}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${
                        subject.progress >= 80 ? 'bg-green-500' :
                        subject.progress >= 60 ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-900">
                <strong>Recommendation:</strong> Focus on Reading and Writing. The AI has adjusted difficulty 
                to provide more foundational exercises in these areas.
              </p>
            </div>
          </div>

          {/* Cognitive Modules Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-gray-900 mb-6">Cognitive Modules Performance</h2>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cognitiveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="module" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                  }}
                />
                <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {cognitiveData.map((module) => (
                <div key={module.module} className="p-3 bg-purple-50 rounded-xl text-center">
                  <div className="text-xs text-purple-700 mb-1">{module.module.split(' ')[0]}</div>
                  <div className="text-sm text-gray-900">{module.sessions} sessions</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Child Profile */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <div className="text-xl">{selectedChild}</div>
                <div className="text-sm text-purple-100">Age 9 • Grade 4</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-100">Current Streak</span>
                <span>7 days 🔥</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Total Points</span>
                <span>12,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Level</span>
                <span>Scholar Learner</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Recent Activity</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.score >= 90 ? 'bg-green-500' :
                    activity.score >= 75 ? 'bg-blue-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">{activity.activity}</div>
                    <div className="text-xs text-gray-600 mt-1">{activity.time}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    activity.score >= 90 ? 'bg-green-100 text-green-700' :
                    activity.score >= 75 ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {activity.score}%
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1">
              View All Activity
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speech Training */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">Speech Training</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pronunciation</span>
                <span className="text-gray-900">92%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">Fluency</span>
                <span className="text-gray-900">85%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">Exercises Completed</span>
                <span className="text-gray-900">48</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-green-900">
                Great improvement in pronunciation over the last 2 weeks! 🎉
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-sm">
                Set Learning Goals
              </button>
              <button className="w-full py-2 px-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-sm">
                Schedule Sessions
              </button>
              <button className="w-full py-2 px-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-sm">
                View Detailed Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}