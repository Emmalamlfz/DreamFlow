
import React, { useState, useEffect } from 'react';
import { ViewState, BucketItem, TodoItem, Habit, UserStats, Category, Plant } from './types';
import Today from './components/Today';
import BucketList from './components/BucketList';
import TodoList from './components/TodoList';
import HabitTracker from './components/HabitTracker';
import Achievements from './components/Achievements';
import Profile from './components/Profile';
import { LayoutDashboard, Star, CheckSquare, Activity, Trophy, User } from 'lucide-react';

// Mock Data for Initial Load if empty
const MOCK_BUCKET: BucketItem[] = [
  { 
      id: '1', 
      title: 'Visit Santorini', 
      description: 'See the white houses and sunset.', 
      category: Category.TRAVEL, 
      isCompleted: false, 
      generatedTasks: false, 
      imageUrl: 'https://picsum.photos/seed/santorini/400/200',
      relatedTodoIds: [],
      relatedHabitIds: []
  },
  { 
      id: '2', 
      title: 'Learn Guitar', 
      description: 'Play Wonderwall by end of year.', 
      category: Category.CREATIVE, 
      isCompleted: false, 
      generatedTasks: false, 
      imageUrl: 'https://picsum.photos/seed/guitar/400/200',
      relatedTodoIds: [],
      relatedHabitIds: []
  },
  {
      id: '3',
      title: 'Run a Marathon',
      description: 'Get fit enough to run 42km.',
      category: Category.HEALTH,
      isCompleted: false,
      generatedTasks: false,
      imageUrl: 'https://picsum.photos/seed/run/400/200',
      relatedTodoIds: [],
      relatedHabitIds: []
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('today');
  
  // Persisted State
  const [bucketList, setBucketList] = useState<BucketItem[]>(() => {
    const saved = localStorage.getItem('bucketList');
    return saved ? JSON.parse(saved) : MOCK_BUCKET;
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
      const saved = localStorage.getItem('userStats');
      return saved ? JSON.parse(saved) : { sunlight: 0, level: 1, inventory: [] };
  });

  // Save to LocalStorage effects
  useEffect(() => localStorage.setItem('bucketList', JSON.stringify(bucketList)), [bucketList]);
  useEffect(() => localStorage.setItem('todos', JSON.stringify(todos)), [todos]);
  useEffect(() => localStorage.setItem('habits', JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem('userStats', JSON.stringify(userStats)), [userStats]);

  const addTodos = (newTodos: TodoItem[]) => {
    setTodos(prev => [...newTodos, ...prev]);
  };

  const addHabit = (newHabit: Habit) => {
      setHabits(prev => [...prev, newHabit]);
  }

  const toggleTodo = (id: string) => {
      // Logic handled inside TodoList but we need a wrapper for Dashboard
      const item = todos.find(i => i.id === id);
      if (item && !item.isCompleted) {
          updatePoints(item.points);
      }
      setTodos(todos.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const toggleHabit = (id: string, date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      setHabits(habits.map(h => {
        if (h.id !== id) return h;
        const exists = h.completedDates.includes(dateStr);
        // Only give points if completing today and wasn't done before
        if (!exists) updatePoints(10); // Fixed points for habits
        
        let newDates = exists 
            ? h.completedDates.filter(d => d !== dateStr)
            : [...h.completedDates, dateStr];
        return { ...h, completedDates: newDates, streak: newDates.length };
      }));
  }

  const updatePoints = (amount: number) => {
      setUserStats(prev => ({
          ...prev,
          sunlight: prev.sunlight + amount
      }));
  };

  const buyPlant = (plantId: string, cost: number) => {
      if (userStats.sunlight < cost) return;

      const shopItemIconMap: Record<string, string> = {
          '1': 'flower', '2': 'tree', '3': 'rose', '4': 'fern'
      };

      const existingPlantIndex = userStats.inventory.findIndex(p => p.id === plantId);
      let newInventory = [...userStats.inventory];

      if (existingPlantIndex >= 0) {
          newInventory[existingPlantIndex].owned += 1;
      } else {
          newInventory.push({
              id: plantId,
              name: 'Plant',
              cost,
              icon: shopItemIconMap[plantId],
              owned: 1
          });
      }

      setUserStats({
          ...userStats,
          sunlight: userStats.sunlight - cost,
          inventory: newInventory
      });
      alert("Successfully planted in your garden! 🌱");
  };

  const renderView = () => {
    switch(view) {
      case 'today': return <Today todos={todos} habits={habits} userStats={userStats} toggleTodo={toggleTodo} toggleHabit={toggleHabit} />;
      case 'bucket': return <BucketList items={bucketList} setItems={setBucketList} addTodos={addTodos} addHabit={addHabit} />;
      case 'todo': return <TodoList items={todos} setItems={setTodos} bucketList={bucketList} updatePoints={updatePoints} />;
      case 'habit': return <HabitTracker habits={habits} setHabits={setHabits} bucketList={bucketList} />;
      case 'achievements': return <Achievements userStats={userStats} bucketList={bucketList} todos={todos} />;
      case 'me': return <Profile userStats={userStats} buyPlant={buyPlant} />;
      default: return <Today todos={todos} habits={habits} userStats={userStats} toggleTodo={toggleTodo} toggleHabit={toggleHabit} />;
    }
  };

  return (
    <div className="min-h-screen bg-dream-bg font-sans text-dream-text selection:bg-dream-yellow selection:text-black">
      
      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 md:top-0 md:left-0 md:w-24 md:h-full md:border-t-0 md:border-r md:flex md:flex-col md:items-center md:py-8 z-50 overflow-x-auto md:overflow-visible no-scrollbar">
        
        <div className="hidden md:block mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-dream-yellow to-dream-coral rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl">
            DF
          </div>
        </div>

        <div className="flex justify-between md:flex-col md:gap-6 w-full px-2 md:px-0">
          <NavButton active={view === 'today'} onClick={() => setView('today')} icon={<LayoutDashboard size={22} />} label="Today" />
          <NavButton active={view === 'bucket'} onClick={() => setView('bucket')} icon={<Star size={22} />} label="Dreams" />
          <NavButton active={view === 'todo'} onClick={() => setView('todo')} icon={<CheckSquare size={22} />} label="Tasks" />
          <NavButton active={view === 'habit'} onClick={() => setView('habit')} icon={<Activity size={22} />} label="Habits" />
          <NavButton active={view === 'achievements'} onClick={() => setView('achievements')} icon={<Trophy size={22} />} label="Garden" />
          <NavButton active={view === 'me'} onClick={() => setView('me')} icon={<User size={22} />} label="Me" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="md:ml-24 p-6 md:p-12 max-w-7xl mx-auto min-h-screen pb-24 md:pb-6">
        {renderView()}
      </main>

    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 group min-w-[60px] md:w-full ${
      active 
      ? 'text-dream-coral bg-dream-peach/50' 
      : 'text-gray-400 hover:text-dream-text hover:bg-gray-100'
    }`}
  >
    <div className={`transform transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
