import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Edit2,
  X,
} from 'lucide-react';
import { callGeminiAPI } from '../utils/gemini-api';

interface Goal {
  id: string;
  subject: string;
  topic: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: string;
  createdAt: Date;
}

interface DailyGoalsProps {
  studentType: 'primary' | 'scholar';
  userName: string;
}

export function DailyGoals({ studentType, userName }: DailyGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    subject: '',
    topic: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedTime: '30',
  });
  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  // Load goals from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedGoals = localStorage.getItem(`todai_goals_${today}`);
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals);
      setGoals(parsed.map((g: any) => ({ ...g, createdAt: new Date(g.createdAt) })));
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`todai_goals_${today}`, JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.subject.trim() || !newGoal.topic.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      subject: newGoal.subject,
      topic: newGoal.topic,
      priority: newGoal.priority,
      estimatedTime: newGoal.estimatedTime,
      completed: false,
      createdAt: new Date(),
    };

    setGoals([...goals, goal]);
    setNewGoal({ subject: '', topic: '', priority: 'medium', estimatedTime: '30' });
    setShowAddForm(false);
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(g => (g.id === id ? { ...g, ...updates } : g)));
    setEditingGoal(null);
  };

  const generateAIGoals = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      alert('Please set up your Gemini API key first!');
      return;
    }

    setIsGeneratingGoals(true);

    try {
      const prompt = studentType === 'primary'
        ? `Suggest 3-4 fun and engaging study topics for a ${userName || 'student'} who is a Primary student. Include different subjects like math, science, reading, and creative activities. Format as: Subject | Topic | Time (in minutes). Keep it simple and fun!`
        : `Suggest 3-4 productive study goals for a scholar student named ${userName || 'Student'}. Include diverse subjects and topics that promote deep learning. Format as: Subject | Topic | Time (in minutes). Be specific and academic.`;

      const response = await callGeminiAPI(apiKey, {
        prompt,
        temperature: 0.8,
        maxOutputTokens: 500,
      });

      // Parse AI response and create goals
      const lines = response.split('\n').filter(line => line.trim() && line.includes('|'));
      const aiGoals: Goal[] = lines.slice(0, 4).map((line, index) => {
        const parts = line.split('|').map(p => p.trim());
        return {
          id: `ai-${Date.now()}-${index}`,
          subject: parts[0]?.replace(/^\d+\.\s*/, '') || 'Study',
          topic: parts[1] || 'General review',
          priority: index === 0 ? 'high' : 'medium',
          estimatedTime: parts[2]?.match(/\d+/)?.[0] || '30',
          completed: false,
          createdAt: new Date(),
        };
      });

      setGoals([...goals, ...aiGoals]);
    } catch (error) {
      console.error('Error generating goals:', error);
      alert('Failed to generate goals. Please try again.');
    } finally {
      setIsGeneratingGoals(false);
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const totalCount = goals.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700 border-blue-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: 'bg-red-100 text-red-700 border-red-300',
  };

  const isPrimary = studentType === 'primary';

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 ${isPrimary ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white'} rounded-3xl shadow-lg border-2 ${isPrimary ? 'border-purple-200' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 5,
            }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isPrimary
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : 'bg-gradient-to-br from-blue-600 to-purple-600'
            } shadow-lg`}
          >
            <Target className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-gray-900">
              {isPrimary ? "Today's Learning Goals! 🎯" : 'Daily Study Goals'}
            </h2>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={generateAIGoals}
            disabled={isGeneratingGoals}
            className={`flex items-center gap-2 px-4 py-2 ${
              isPrimary
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            } text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50`}
          >
            {isGeneratingGoals ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI Suggest</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-2 px-4 py-2 ${
              isPrimary
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-xl transition-all`}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Goal</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">
              {isPrimary ? '🌟 Progress' : 'Daily Progress'}
            </span>
            <span className="text-sm text-gray-600">
              {completedCount} of {totalCount} completed ({Math.round(progress)}%)
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full ${
                isPrimary
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}
            />
          </div>
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 ${
                isPrimary ? 'bg-yellow-100 border-yellow-300' : 'bg-green-100 border-green-300'
              } border rounded-xl flex items-center gap-2`}
            >
              <Award className={`w-5 h-5 ${isPrimary ? 'text-yellow-600' : 'text-green-600'}`} />
              <span className={`text-sm ${isPrimary ? 'text-yellow-800' : 'text-green-800'}`}>
                {isPrimary
                  ? '🎉 Awesome! You completed all your goals today!'
                  : '🎉 Excellent work! All goals completed!'}
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 ${
              isPrimary ? 'bg-white' : 'bg-gray-50'
            } rounded-2xl border-2 ${isPrimary ? 'border-purple-200' : 'border-gray-200'}`}
          >
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {isPrimary ? 'Add New Learning Goal 📚' : 'Add New Study Goal'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'Subject 📖' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={newGoal.subject}
                  onChange={e => setNewGoal({ ...newGoal, subject: e.target.value })}
                  placeholder={isPrimary ? 'Math, Science, Reading...' : 'Computer Science, Mathematics...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'What to Learn? 🎯' : 'Topic'}
                </label>
                <input
                  type="text"
                  value={newGoal.topic}
                  onChange={e => setNewGoal({ ...newGoal, topic: e.target.value })}
                  placeholder={isPrimary ? 'Addition, Planets, Story...' : 'Binary Trees, Calculus...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'How Important? ⭐' : 'Priority'}
                </label>
                <select
                  value={newGoal.priority}
                  onChange={e => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">{isPrimary ? '🟦 Can wait' : 'Low'}</option>
                  <option value="medium">{isPrimary ? '🟨 Important' : 'Medium'}</option>
                  <option value="high">{isPrimary ? '🟥 Very Important!' : 'High'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'Time Needed ⏰' : 'Estimated Time (minutes)'}
                </label>
                <input
                  type="number"
                  value={newGoal.estimatedTime}
                  onChange={e => setNewGoal({ ...newGoal, estimatedTime: e.target.value })}
                  placeholder="30"
                  min="5"
                  step="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addGoal}
                disabled={!newGoal.subject.trim() || !newGoal.topic.trim()}
                className={`flex-1 py-2 ${
                  isPrimary
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-xl transition-all disabled:opacity-50`}
              >
                Add Goal
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.length === 0 && (
          <div className="text-center py-12">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            </motion.div>
            <p className="text-gray-500 mb-4">
              {isPrimary
                ? "No goals yet! Let's add what you want to learn today! 🌟"
                : 'No goals set for today. Start planning your study session!'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`px-6 py-3 ${
                isPrimary
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-xl transition-all`}
            >
              {isPrimary ? 'Add My First Goal! 🎯' : 'Add Your First Goal'}
            </button>
          </div>
        )}

        <AnimatePresence>
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                goal.completed
                  ? isPrimary
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-300'
                  : isPrimary
                  ? 'bg-white border-purple-200 hover:border-purple-400'
                  : 'bg-white border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {goal.completed ? (
                    <CheckCircle className={`w-6 h-6 ${isPrimary ? 'text-green-500' : 'text-blue-600'}`} />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  {editingGoal === goal.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={goal.subject}
                        onChange={e => updateGoal(goal.id, { subject: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={goal.topic}
                        onChange={e => updateGoal(goal.id, { topic: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => setEditingGoal(null)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`text-gray-900 ${
                            goal.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {goal.subject}
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-lg border ${
                            priorityColors[goal.priority]
                          }`}
                        >
                          {goal.priority}
                        </span>
                      </div>
                      <p
                        className={`text-sm text-gray-600 mb-2 ${
                          goal.completed ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        {goal.topic}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {goal.estimatedTime} min
                        </span>
                        {goal.completed && (
                          <span className={`flex items-center gap-1 ${isPrimary ? 'text-green-600' : 'text-blue-600'}`}>
                            <CheckCircle className="w-3 h-3" />
                            Completed!
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      {totalCount > 0 && (
        <div className={`mt-6 p-4 ${isPrimary ? 'bg-gradient-to-r from-purple-100 to-pink-100' : 'bg-gray-100'} rounded-2xl`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">{totalCount}</div>
              <div className="text-xs text-gray-600">
                {isPrimary ? 'Total Goals 🎯' : 'Total Goals'}
              </div>
            </div>
            <div>
              <div className="text-2xl mb-1">{completedCount}</div>
              <div className="text-xs text-gray-600">
                {isPrimary ? 'Completed ✅' : 'Completed'}
              </div>
            </div>
            <div>
              <div className="text-2xl mb-1">
                {goals.reduce((sum, g) => sum + parseInt(g.estimatedTime || '0'), 0)}
              </div>
              <div className="text-xs text-gray-600">
                {isPrimary ? 'Total Minutes ⏰' : 'Total Minutes'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}