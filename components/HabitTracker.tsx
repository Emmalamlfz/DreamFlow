
import React, { useState } from 'react';
import { Habit, BucketItem } from '../types';
import { Plus, Check, Flame, Trash2, Link as LinkIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  bucketList: BucketItem[];
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits: items, setHabits, bucketList }) => { 
  const [newHabit, setNewHabit] = useState('');
  const [selectedDreamId, setSelectedDreamId] = useState('');

  // Generate last 7 days
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: uuidv4(),
      title: newHabit,
      streak: 0,
      completedDates: [],
      linkedDreamId: selectedDreamId || undefined,
      color: ['#F2D894', '#F9ECE3', '#D2C7E5', '#D3EADA', '#FFDDD8', '#F9C0AF'][Math.floor(Math.random()*6)]
    };
    setHabits([...items, habit]);
    setNewHabit('');
    setSelectedDreamId('');
  };

  const toggleDate = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setHabits(items.map(h => {
      if (h.id !== habitId) return h;
      
      const exists = h.completedDates.includes(dateStr);
      let newDates = exists 
        ? h.completedDates.filter(d => d !== dateStr)
        : [...h.completedDates, dateStr];
      
      // Simple streak logic
      const streak = newDates.length; 

      return { ...h, completedDates: newDates, streak };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(items.filter(h => h.id !== id));
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-dream-text">Habit Tracker</h2>
          <p className="text-dream-subtext">Small actions, compounded daily.</p>
        </div>
      </div>

       {/* Input Area */}
       <form onSubmit={handleAddHabit} className="bg-white p-4 rounded-3xl shadow-md mb-8 border border-gray-100">
        <div className="flex items-center mb-2">
            <input 
            type="text" 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="New habit to build..." 
            className="flex-1 bg-gray-50 p-3 rounded-xl border-none outline-none text-gray-700 placeholder-gray-400 mr-2"
            />
            <button type="submit" className="bg-dream-text text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors">Track</button>
        </div>
        <select 
            value={selectedDreamId}
            onChange={(e) => setSelectedDreamId(e.target.value)}
            className="w-full bg-gray-50 text-sm text-gray-500 p-2 rounded-lg outline-none cursor-pointer"
        >
            <option value="">(Optional) Link to a Dream...</option>
            {bucketList.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
            ))}
        </select>
      </form>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-dream-peach overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 mb-4 text-sm text-gray-400 font-medium">
            <div className="col-span-4">HABIT</div>
            {days.map(d => (
              <div key={d.toString()} className="col-span-1 text-center">
                <div className="text-xs">{d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
                <div className="font-bold text-gray-600">{d.getDate()}</div>
              </div>
            ))}
            <div className="col-span-1 text-center">STREAK</div>
          </div>

          {/* Habits Rows */}
          <div className="space-y-4">
            {items.map(habit => (
              <div key={habit.id} className="grid grid-cols-12 gap-4 items-center group">
                <div className="col-span-4 flex flex-col justify-center pr-4">
                  <div className="font-bold text-gray-700 flex items-center">
                      {habit.title}
                      <button onClick={() => deleteHabit(habit.id)} className="ml-2 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={14} />
                      </button>
                  </div>
                  {habit.linkedDreamId && (
                      <div className="flex items-center text-xs text-dream-coral mt-1">
                          <LinkIcon size={10} className="mr-1" />
                          {bucketList.find(b => b.id === habit.linkedDreamId)?.title || 'Linked Dream'}
                      </div>
                  )}
                </div>
                {days.map(d => {
                   const dateStr = d.toISOString().split('T')[0];
                   const isDone = habit.completedDates.includes(dateStr);
                   return (
                     <div key={dateStr} className="col-span-1 flex justify-center">
                       <button
                         onClick={() => toggleDate(habit.id, d)}
                         className={`w-8 h-8 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                           isDone ? 'text-white' : 'bg-gray-100 hover:bg-gray-200'
                         }`}
                         style={{ backgroundColor: isDone ? habit.color : undefined }}
                       >
                         {isDone && <Check size={16} />}
                       </button>
                     </div>
                   );
                })}
                <div className="col-span-1 flex items-center justify-center text-dream-text font-bold">
                  <Flame size={16} className="text-orange-400 mr-1" fill="currentColor" />
                  {habit.streak}
                </div>
              </div>
            ))}
          </div>
          
          {items.length === 0 && (
             <div className="text-center py-10 text-gray-400 italic">No habits being tracked. Add one above!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
