import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Sun,
  Sunset,
  Moon,
  BookOpen,
  Dumbbell,
  Coffee,
  Home,
  Users,
  Music,
  Sparkles,
  TrendingUp,
  Edit2,
  Bell,
  AlarmClock,
} from 'lucide-react';
import { callGeminiAPI } from '../utils/gemini-api';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ScheduleTask {
  id: string;
  title: string;
  category: 'study' | 'exercise' | 'break' | 'hobby' | 'family' | 'other';
  timeSlot: string; // Format: "HH:MM"
  duration: number; // in minutes
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  reminder: boolean;
  notes: string;
  createdAt: Date;
}

interface DailyScheduleProps {
  studentType: 'primary' | 'scholar';
  userName: string;
}

export function DailySchedule({ studentType, userName }: DailyScheduleProps) {
  const [tasks, setTasks] = useState<ScheduleTask[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'all'>('all');
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Partial<ScheduleTask>>({
    title: '',
    category: 'study',
    timeSlot: '09:00',
    duration: 60,
    priority: 'medium',
    reminder: false,
    notes: '',
  });

  const isPrimary = studentType === 'primary';

  // Load tasks from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedTasks = localStorage.getItem(`todai_schedule_${today}`);
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`todai_schedule_${today}`, JSON.stringify(tasks));
  }, [tasks]);

  const categoryConfig = {
    study: { icon: BookOpen, color: 'from-blue-400 to-indigo-500', emoji: '📚' },
    exercise: { icon: Dumbbell, color: 'from-green-400 to-emerald-500', emoji: '💪' },
    break: { icon: Coffee, color: 'from-orange-400 to-amber-500', emoji: '☕' },
    hobby: { icon: Music, color: 'from-purple-400 to-pink-500', emoji: '🎨' },
    family: { icon: Users, color: 'from-rose-400 to-red-500', emoji: '👨‍👩‍👧‍👦' },
    other: { icon: Home, color: 'from-gray-400 to-slate-500', emoji: '📌' },
  };

  const addTask = () => {
    if (!newTask.title?.trim()) return;

    const task: ScheduleTask = {
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category || 'study',
      timeSlot: newTask.timeSlot || '09:00',
      duration: newTask.duration || 60,
      priority: newTask.priority || 'medium',
      reminder: newTask.reminder || false,
      notes: newTask.notes || '',
      completed: false,
      createdAt: new Date(),
    };

    setTasks([...tasks, task].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)));
    setNewTask({
      title: '',
      category: 'study',
      timeSlot: '09:00',
      duration: 60,
      priority: 'medium',
      reminder: false,
      notes: '',
    });
    setShowAddForm(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const generateAISchedule = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      alert('Please set up your Gemini API key first!');
      return;
    }

    setIsGeneratingSchedule(true);

    try {
      const prompt = isPrimary
        ? `Create a balanced daily schedule for a primary student named ${userName}. Include 6-8 activities covering study time, play time, exercise, meals, and hobbies. Format each as: Time (HH:MM) | Activity | Category (study/exercise/break/hobby/family) | Duration (minutes). Make it fun and age-appropriate!`
        : `Create a productive daily schedule for a scholar student named ${userName}. Include 8-10 activities balancing academics, self-care, exercise, meals, and personal time. Format each as: Time (HH:MM) | Activity | Category (study/exercise/break/hobby/family) | Duration (minutes). Be realistic and productive.`;

      const response = await callGeminiAPI(apiKey, {
        prompt,
        temperature: 0.7,
        maxOutputTokens: 800,
      });

      // Parse AI response
      const lines = response.split('\n').filter(line => line.trim() && line.includes('|'));
      const aiTasks: ScheduleTask[] = lines.slice(0, 10).map((line, index) => {
        const parts = line.split('|').map(p => p.trim());
        const timeMatch = parts[0]?.match(/\d{1,2}:\d{2}/) || ['09:00'];
        const categoryRaw = parts[2]?.toLowerCase() || 'study';
        const category = ['study', 'exercise', 'break', 'hobby', 'family'].includes(categoryRaw)
          ? categoryRaw as any
          : 'other';

        return {
          id: `ai-${Date.now()}-${index}`,
          title: parts[1] || 'Study Time',
          category,
          timeSlot: timeMatch[0],
          duration: parseInt(parts[3]?.match(/\d+/)?.[0] || '60'),
          priority: index < 3 ? 'high' : 'medium',
          reminder: true,
          notes: '',
          completed: false,
          createdAt: new Date(),
        };
      });

      setTasks([...tasks, ...aiTasks].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)));
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Failed to generate schedule. Please try again.');
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  const getTimeOfDay = (timeSlot: string): 'morning' | 'afternoon' | 'evening' => {
    const hour = parseInt(timeSlot.split(':')[0]);
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const filteredTasks = tasks.filter(task => 
    selectedTimeOfDay === 'all' || getTimeOfDay(task.timeSlot) === selectedTimeOfDay
  );

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const totalMinutes = tasks.reduce((sum, t) => sum + t.duration, 0);

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 ${isPrimary ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-white'} rounded-3xl shadow-xl border-2 ${isPrimary ? 'border-orange-200' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
            }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isPrimary
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                : 'bg-gradient-to-br from-indigo-600 to-purple-600'
            } shadow-lg`}
          >
            <Calendar className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h2 className="text-gray-900">
              {isPrimary ? "My Daily Schedule! 🗓️" : 'Daily Time Table'}
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

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={generateAISchedule}
            disabled={isGeneratingSchedule}
            className={`flex items-center gap-2 px-4 py-2 ${
              isPrimary
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
            } text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50`}
          >
            {isGeneratingSchedule ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">Creating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI Schedule</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-2 px-4 py-2 ${
              isPrimary
                ? 'bg-pink-500 hover:bg-pink-600'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white rounded-xl transition-all`}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Task</span>
          </button>
        </div>
      </div>

      {/* Time of Day Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Day', icon: Sun, emoji: '🌅' },
          { id: 'morning', label: 'Morning', icon: Sun, emoji: '🌄' },
          { id: 'afternoon', label: 'Afternoon', icon: Sunset, emoji: '☀️' },
          { id: 'evening', label: 'Evening', icon: Moon, emoji: '🌙' },
        ].map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedTimeOfDay(filter.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedTimeOfDay === filter.id
                  ? isPrimary
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
                    : 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{filter.emoji}</span>
              <span className="text-sm">{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress Stats */}
      {totalCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${isPrimary ? 'bg-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} rounded-2xl p-4 border-2 ${isPrimary ? 'border-yellow-200' : 'border-indigo-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{isPrimary ? '📊 Progress' : 'Completion'}</span>
              <TrendingUp className={`w-4 h-4 ${isPrimary ? 'text-yellow-600' : 'text-indigo-600'}`} />
            </div>
            <div className="text-2xl mb-1">{Math.round(progress)}%</div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${
                  isPrimary
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                }`}
              />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${isPrimary ? 'bg-white' : 'bg-gradient-to-br from-green-50 to-emerald-50'} rounded-2xl p-4 border-2 ${isPrimary ? 'border-green-200' : 'border-emerald-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{isPrimary ? '✅ Done' : 'Completed'}</span>
              <CheckCircle className={`w-4 h-4 ${isPrimary ? 'text-green-600' : 'text-emerald-600'}`} />
            </div>
            <div className="text-2xl">
              {completedCount}/{totalCount}
            </div>
            <div className="text-xs text-gray-500">tasks</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${isPrimary ? 'bg-white' : 'bg-gradient-to-br from-purple-50 to-pink-50'} rounded-2xl p-4 border-2 ${isPrimary ? 'border-purple-200' : 'border-pink-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{isPrimary ? '⏰ Time' : 'Total Time'}</span>
              <Clock className={`w-4 h-4 ${isPrimary ? 'text-purple-600' : 'text-pink-600'}`} />
            </div>
            <div className="text-2xl">
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </div>
            <div className="text-xs text-gray-500">planned</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${isPrimary ? 'bg-white' : 'bg-gradient-to-br from-orange-50 to-amber-50'} rounded-2xl p-4 border-2 ${isPrimary ? 'border-orange-200' : 'border-amber-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{isPrimary ? '🔔 Alerts' : 'Reminders'}</span>
              <Bell className={`w-4 h-4 ${isPrimary ? 'text-orange-600' : 'text-amber-600'}`} />
            </div>
            <div className="text-2xl">{tasks.filter(t => t.reminder).length}</div>
            <div className="text-xs text-gray-500">active</div>
          </motion.div>
        </div>
      )}

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-5 ${
              isPrimary ? 'bg-white' : 'bg-gray-50'
            } rounded-2xl border-2 ${isPrimary ? 'border-orange-200' : 'border-gray-200'}`}
          >
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {isPrimary ? 'Add New Activity 📝' : 'Add New Task'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'What to do? 📌' : 'Task Title'}
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder={isPrimary ? 'Homework, Play, Eat...' : 'Study algorithms, Gym workout...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'Category 🏷️' : 'Category'}
                </label>
                <select
                  value={newTask.category}
                  onChange={e => setNewTask({ ...newTask, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="study">📚 Study</option>
                  <option value="exercise">💪 Exercise</option>
                  <option value="break">☕ Break</option>
                  <option value="hobby">🎨 Hobby</option>
                  <option value="family">👨‍👩‍👧‍👦 Family Time</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'Start Time ⏰' : 'Time Slot'}
                </label>
                <input
                  type="time"
                  value={newTask.timeSlot}
                  onChange={e => setNewTask({ ...newTask, timeSlot: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'How long? ⏱️' : 'Duration (minutes)'}
                </label>
                <input
                  type="number"
                  value={newTask.duration}
                  onChange={e => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
                  min="5"
                  step="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'How Important? ⭐' : 'Priority'}
                </label>
                <select
                  value={newTask.priority}
                  onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="low">{isPrimary ? '🟦 Can wait' : 'Low'}</option>
                  <option value="medium">{isPrimary ? '🟨 Important' : 'Medium'}</option>
                  <option value="high">{isPrimary ? '🟥 Very Important!' : 'High'}</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm text-gray-700 mb-2">
                  {isPrimary ? 'Notes 📝 (optional)' : 'Notes (optional)'}
                </label>
                <input
                  type="text"
                  value={newTask.notes}
                  onChange={e => setNewTask({ ...newTask, notes: e.target.value })}
                  placeholder="Any extra details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={newTask.reminder}
                  onChange={e => setNewTask({ ...newTask, reminder: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="reminder" className="text-sm text-gray-700 cursor-pointer">
                  {isPrimary ? '🔔 Remind me!' : 'Set reminder'}
                </label>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={addTask}
                disabled={!newTask.title?.trim()}
                className={`flex-1 py-2 ${
                  isPrimary
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white rounded-xl transition-all disabled:opacity-50`}
              >
                Add to Schedule
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks Timeline */}
      <div className="space-y-3">
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlarmClock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            </motion.div>
            <p className="text-gray-500 mb-4">
              {isPrimary
                ? "No tasks yet! Let's plan your awesome day! 🌟"
                : 'No tasks scheduled. Start planning your day!'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`px-6 py-3 ${
                isPrimary
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white rounded-xl transition-all`}
            >
              {isPrimary ? 'Plan My Day! 📅' : 'Add First Task'}
            </button>
          </div>
        )}

        <AnimatePresence>
          {filteredTasks.map((task, index) => {
            const config = categoryConfig[task.category];
            const Icon = config.icon;
            const timeOfDay = getTimeOfDay(task.timeSlot);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  task.completed
                    ? isPrimary
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                    : isPrimary
                    ? 'bg-white border-orange-200 hover:border-orange-400'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                {/* Time Badge */}
                <div className="absolute -left-2 -top-2">
                  <div className={`px-3 py-1 bg-gradient-to-r ${config.color} text-white rounded-full text-xs shadow-md flex items-center gap-1`}>
                    <Clock className="w-3 h-3" />
                    {task.timeSlot}
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle className={`w-6 h-6 ${isPrimary ? 'text-green-500' : 'text-indigo-600'}`} />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`text-gray-900 ${
                              task.completed ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.reminder && (
                            <Bell className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <span>{config.emoji}</span>
                            {task.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.duration} min
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-lg ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.notes && (
                          <p className="text-xs text-gray-500 italic">{task.notes}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Motivational Footer */}
      {totalCount > 0 && progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-6 p-6 rounded-2xl ${
            isPrimary
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
          } text-center`}
        >
          <div className="text-5xl mb-3">🎉🎊🏆</div>
          <h3 className="text-gray-900 mb-2">
            {isPrimary ? 'Amazing Job!' : 'Excellent Work!'}
          </h3>
          <p className="text-gray-700">
            {isPrimary
              ? "You completed all your tasks today! You're a superstar! ⭐"
              : 'You\'ve completed your entire schedule. Great time management! 💪'}
          </p>
        </motion.div>
      )}
    </div>
  );
}