
import React from 'react';
import { TodoItem, Habit, UserStats } from '../types';
import { Sun, CheckCircle, Calendar, AlertCircle, Flame, Droplets } from 'lucide-react';

interface TodayProps {
  todos: TodoItem[];
  habits: Habit[];
  userStats: UserStats;
  toggleTodo: (id: string) => void;
  toggleHabit: (id: string, date: Date) => void;
}

const Today: React.FC<TodayProps> = ({ todos, habits, userStats, toggleTodo, toggleHabit }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Filter Tasks: Overdue or Due Today
  const dueTasks = todos.filter(t => {
    if (t.isCompleted) return false;
    if (!t.dueDate) return true; // Show tasks with no date as backlog
    return t.dueDate <= todayStr;
  }).sort((a, b) => (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1);

  // Filter Habits: Show all active
  const todayHabits = habits;

  return (
    <div className="animate-fade-in pb-24 space-y-8">
      {/* Header with Gamification Status */}
      <header className="flex justify-between items-end bg-gradient-to-r from-dream-yellow/20 to-dream-peach/20 p-6 rounded-3xl">
        <div>
          <h1 className="text-3xl font-bold text-dream-text">Today's Focus</h1>
          <p className="text-dream-subtext mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
          <Sun className="text-orange-400 mr-2" fill="currentColor" />
          <span className="font-bold text-dream-text">{userStats.sunlight} Sunlight</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Priority Tasks */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-dream-text flex items-center gap-2">
            <CheckCircle className="text-dream-lavender" />
            Action Items
          </h2>
          {dueTasks.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center shadow-sm">
              <p className="text-gray-400">All caught up! Enjoy your day.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dueTasks.slice(0, 5).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-dream-yellow transition-all">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleTodo(task.id)}
                      className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-dream-yellow"
                    ></button>
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      {task.dueDate && task.dueDate < todayStr && (
                        <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                          <AlertCircle size={10} /> Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-400 flex items-center bg-orange-50 px-2 py-1 rounded-full">
                    +{task.points} <Sun size={10} className="ml-1" />
                  </span>
                </div>
              ))}
              {dueTasks.length > 5 && (
                <p className="text-center text-sm text-gray-400">And {dueTasks.length - 5} more in Tasks...</p>
              )}
            </div>
          )}
        </div>

        {/* Daily Rituals (Habits) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-dream-text flex items-center gap-2">
            <Flame className="text-dream-coral" />
            Daily Rituals
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {todayHabits.map(habit => {
              const isDone = habit.completedDates.includes(todayStr);
              return (
                <div key={habit.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <span className="font-medium text-gray-700">{habit.title}</span>
                  <button
                    onClick={() => toggleHabit(habit.id, new Date())}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDone ? 'bg-dream-mint text-emerald-600 scale-110 shadow-md' : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                     {isDone ? <CheckCircle size={20} /> : <Droplets size={20} />}
                  </button>
                </div>
              );
            })}
             {todayHabits.length === 0 && (
                <div className="text-center text-gray-400 p-4">No habits tracked yet.</div>
             )}
          </div>
        </div>
      </div>
      
      {/* Motivation/Garden Teaser */}
      <div className="bg-gradient-to-r from-dream-lavender/30 to-dream-mint/30 rounded-3xl p-6 flex items-center justify-between">
         <div>
            <h3 className="font-bold text-lg mb-1">Your Garden is waiting</h3>
            <p className="text-sm opacity-70">Complete tasks to earn Sunlight and grow your world.</p>
         </div>
         <div className="text-4xl">🌳</div>
      </div>
    </div>
  );
};

export default Today;
