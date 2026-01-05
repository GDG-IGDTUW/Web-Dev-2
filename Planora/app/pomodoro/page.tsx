'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes?: string;
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
}

export default function StudyPlanner() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'sessions'>('tasks');

  useEffect(() => {
    const savedTasks = localStorage.getItem('studyTasks');
    const savedSessions = localStorage.getItem('studySessions');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  useEffect(() => {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
    };
    setSessions([...sessions, newSession]);
    setShowAddSession(false);
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const getTotalStudyTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-900/40 to-red-800/40 text-red-300 border-red-700/50';
      case 'medium': return 'bg-gradient-to-r from-yellow-900/40 to-amber-800/40 text-yellow-300 border-yellow-700/50';
      case 'low': return 'bg-gradient-to-r from-green-900/40 to-emerald-800/40 text-emerald-300 border-emerald-700/50';
      default: return 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 border-gray-600';
    }
  };

  const handlePomodoroClick = () => {
    router.push('/pomodoro');
  };
  const handleCalenderClick = () => {
    router.push('/calender');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 mb-2">
                Study Planner
              </h1>
              <p className="text-gray-400 text-lg">Organize, track, and excel in your studies</p>
            </div>
            
            {/* Pomodoro Timer Button */}
            <button
              onClick={handlePomodoroClick}
              className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/20 flex items-center gap-2"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              Pomodoro Timer
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={handleCalenderClick}
              className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/20 flex items-center gap-2"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              Calender
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:border-green-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <span className="text-green-400">📚</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-400">Total Tasks</h3>
              </div>
              <p className="text-4xl font-bold text-green-400">{tasks.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                  <span className="text-emerald-400">✅</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-400">Completed</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-400">
                {tasks.filter(t => t.completed).length}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <span className="text-cyan-400">⏱️</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-400">Study Hours</h3>
              </div>
              <p className="text-4xl font-bold text-cyan-400">
                {(getTotalStudyTime() / 60).toFixed(1)}h
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:border-blue-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-blue-400">📊</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-400">Sessions</h3>
              </div>
              <p className="text-4xl font-bold text-blue-400">{sessions.length}</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-700/50 shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-gray-700/50 mb-8">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`relative px-8 py-4 font-semibold text-lg transition-all ${
                activeTab === 'tasks'
                  ? 'text-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`text-xl ${activeTab === 'tasks' ? 'text-green-400' : 'text-gray-500'}`}>
                  📝
                </span>
                Tasks & Assignments
                {activeTab === 'tasks' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`relative px-8 py-4 font-semibold text-lg transition-all ${
                activeTab === 'sessions'
                  ? 'text-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`text-xl ${activeTab === 'sessions' ? 'text-emerald-400' : 'text-gray-500'}`}>
                  📊
                </span>
                Study Sessions
                {activeTab === 'sessions' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
                )}
              </span>
            </button>
          </div>

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Your Study Tasks</h2>
                  <p className="text-gray-400">Manage assignments, readings, and study materials</p>
                </div>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/20 flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  Add New Task
                </button>
              </div>

              {showAddTask && (
                <TaskForm onSubmit={addTask} onCancel={() => setShowAddTask(false)} />
              )}

              <div className="space-y-4 mt-8">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-700/50 rounded-2xl bg-gradient-to-br from-gray-800/20 to-gray-900/20">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No tasks yet</h3>
                    <p className="text-gray-500">Add your first task to get started!</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      getPriorityColor={getPriorityColor}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Study Sessions</h2>
                  <p className="text-gray-400">Track your study time and progress</p>
                </div>
                <button
                  onClick={() => setShowAddSession(true)}
                  className="group bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20 flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  Log Session
                </button>
              </div>

              {showAddSession && (
                <SessionForm onSubmit={addSession} onCancel={() => setShowAddSession(false)} />
              )}

              <div className="space-y-4 mt-8">
                {sessions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-700/50 rounded-2xl bg-gradient-to-br from-gray-800/20 to-gray-900/20">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-2xl">⏱️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No sessions logged</h3>
                    <p className="text-gray-500">Log your first study session to track progress!</p>
                  </div>
                ) : (
                  sessions.map(session => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onDelete={deleteSession}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskForm({ onSubmit, onCancel }: { 
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.subject && formData.dueDate) {
      onSubmit(formData);
      setFormData({ title: '', subject: '', dueDate: '', priority: 'medium', notes: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/30 mb-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <span>📝</span>
            Task Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Complete Math assignment chapter 5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <span>🎯</span>
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Mathematics, Physics, etc."
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <span>📅</span>
            Due Date *
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <span>⚡</span>
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="low" className="bg-gray-800">Low Priority</option>
            <option value="medium" className="bg-gray-800">Medium Priority</option>
            <option value="high" className="bg-gray-800">High Priority</option>
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
          <span>📋</span>
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          placeholder="Add additional details, instructions, or links..."
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/20"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-800/60 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-700/60 hover:text-white transition-colors border border-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function TaskCard({ task, onToggle, onDelete, getPriorityColor }: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
}) {
  return (
    <div className={`border-2 rounded-2xl p-5 transition-all duration-300 backdrop-blur-sm hover:scale-[1.01] ${
      task.completed 
        ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/50' 
        : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-green-800/30 hover:border-green-500/50'
    }`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent' 
              : 'border-gray-600 hover:border-green-500'
          }`}
        >
          {task.completed && '✓'}
        </button>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${
                task.completed ? 'line-through text-gray-500' : 'text-white'
              }`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-lg">
                  {task.subject}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          
          {task.notes && (
            <div className="bg-gray-900/40 rounded-lg p-3 mb-3">
              <p className="text-gray-300 text-sm">{task.notes}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Due:</span>
              <span className={`text-sm font-medium ${task.completed ? 'text-gray-500' : 'text-green-400'}`}>
                {new Date(task.dueDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {task.completed ? 'Completed' : 'In Progress'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionForm({ onSubmit, onCancel }: {
  onSubmit: (session: Omit<StudySession, 'id'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    subject: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subject && formData.duration) {
      onSubmit({
        subject: formData.subject,
        duration: parseInt(formData.duration),
        date: formData.date,
      });
      setFormData({ subject: '', duration: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-emerald-800/30 mb-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div>
          <label className="block text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <span>📚</span>
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="e.g., Physics, Calculus, etc."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <span>⏱️</span>
            Duration (minutes) *
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="e.g., 45, 60, 90"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <span>📅</span>
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
        >
          Log Session
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-800/60 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-700/60 hover:text-white transition-colors border border-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function SessionCard({ session, onDelete }: {
  session: StudySession;
  onDelete: (id: string) => void;
}) {
  const hours = Math.floor(session.duration / 60);
  const minutes = session.duration % 60;
  
  return (
    <div className="border-2 border-emerald-800/30 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-5 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.01]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{session.subject}</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">⏱️</span>
              <span className="text-emerald-300">
                {hours > 0 ? `${hours}h ` : ''}{minutes}m
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">📅</span>
              <span className="text-cyan-300">
                {new Date(session.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(session.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}