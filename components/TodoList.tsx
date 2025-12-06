
import React, { useState } from 'react';
import { TodoItem, Priority, JournalEntry, BucketItem } from '../types';
import { Plus, Check, Trash2, Calendar, AlertCircle, Wand2, Star, Book, RotateCw, Image as ImageIcon, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TodoListProps {
  items: TodoItem[];
  setItems: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  bucketList: BucketItem[]; // for displaying linked dream name
  updatePoints: (amount: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ items, setItems, bucketList, updatePoints }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);
  const [newDueDate, setNewDueDate] = useState('');
  const [newPoints, setNewPoints] = useState(10);
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  // Journal Modal State
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  const [journalText, setJournalText] = useState('');
  const [journalImage, setJournalImage] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const item: TodoItem = {
      id: uuidv4(),
      title: newTodo,
      isCompleted: false,
      priority: newPriority,
      dueDate: newDueDate || undefined,
      isRecurring: isRecurring,
      points: newPoints,
      journal: [],
      createdAt: Date.now()
    };
    setItems([item, ...items]);
    
    // Reset form
    setNewTodo('');
    setNewDueDate('');
    setIsRecurring(false);
    setNewPoints(10);
    setIsFormOpen(false);
  };

  const toggleComplete = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item && !item.isCompleted) {
        // Completing a task
        updatePoints(item.points);
        
        // Handle recurrence
        if (item.isRecurring) {
           // Create a new copy for the next occurrence if needed
           // For simplicity in this demo, we just don't mark as complete, or we uncheck it next day.
           // Let's implement simple "Clone for next day" logic or just visual complete for today.
           // Current logic: Mark complete, but if recurring, user has to manually uncheck or we reset daily.
           // Better UX for demo: Show alert.
           alert(`Task completed! You earned ${item.points} Sunlight. Since it's recurring, remember to set it up for next time!`);
        } else {
           // Regular completion
        }
    }
    setItems(items.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTodo = (id: string) => {
    setItems(items.filter(t => t.id !== id));
  };

  const saveJournal = () => {
      if (!activeJournalId || !journalText) return;
      const entry: JournalEntry = {
          id: uuidv4(),
          date: Date.now(),
          text: journalText,
          imageUrl: journalImage
      };
      
      setItems(items.map(t => t.id === activeJournalId ? { ...t, journal: [...t.journal, entry] } : t));
      
      setActiveJournalId(null);
      setJournalText('');
      setJournalImage('');
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'text-red-500 bg-red-50 border-red-100';
      case Priority.MEDIUM: return 'text-amber-500 bg-amber-50 border-amber-100';
      case Priority.LOW: return 'text-blue-500 bg-blue-50 border-blue-100';
    }
  };

  const getLinkedDreamTitle = (id?: string) => {
      if (!id) return null;
      const dream = bucketList.find(b => b.id === id);
      return dream ? dream.title : null;
  };

  const sortedItems = [...items].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      
      if (sortBy === 'date') {
          return (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1;
      } else {
          const pMap = { [Priority.HIGH]: 1, [Priority.MEDIUM]: 2, [Priority.LOW]: 3 };
          return pMap[a.priority] - pMap[b.priority];
      }
  });

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-dream-text">Tasks</h2>
          <p className="text-dream-subtext">Manage actions, earn sunlight.</p>
        </div>
        <div className="flex gap-2">
            <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border-none text-sm p-2 rounded-xl shadow-sm outline-none"
            >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
            </select>
            <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-dream-text text-white p-2 rounded-full shadow-lg hover:bg-black transition-colors"
            >
                <Plus size={24} />
            </button>
        </div>
      </div>

      {/* Input Area (Expandable) */}
      {isFormOpen && (
        <form onSubmit={handleAddTodo} className="bg-white p-6 rounded-3xl shadow-lg mb-8 border border-dream-peach animate-slide-up">
            <h3 className="font-bold text-gray-700 mb-4">New Task</h3>
            
            <input 
            type="text" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?" 
            className="w-full p-4 bg-gray-50 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-dream-peach"
            autoFocus
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-1">Due Date</label>
                    <input 
                        type="date" 
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="p-2 bg-gray-50 rounded-lg outline-none text-sm"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-1">Priority</label>
                    <select 
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as Priority)}
                        className="p-2 bg-gray-50 rounded-lg outline-none text-sm"
                    >
                        <option value={Priority.LOW}>Low</option>
                        <option value={Priority.MEDIUM}>Medium</option>
                        <option value={Priority.HIGH}>High</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-1">Reward Points</label>
                    <input 
                        type="number" 
                        value={newPoints}
                        onChange={(e) => setNewPoints(Number(e.target.value))}
                        className="p-2 bg-gray-50 rounded-lg outline-none text-sm"
                        min="5" max="100" step="5"
                    />
                </div>
                 <div className="flex flex-col justify-end pb-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isRecurring} 
                            onChange={(e) => setIsRecurring(e.target.checked)} 
                            className="accent-dream-coral"
                        />
                        <span className="text-sm text-gray-600">Recurring?</span>
                    </label>
                </div>
            </div>

            <button type="submit" className="w-full bg-dream-text text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">Create Task</button>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {sortedItems.map(todo => (
          <div 
            key={todo.id} 
            className={`relative flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-transparent hover:border-dream-lavender transition-all group ${todo.isCompleted ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center">
                <button 
                onClick={() => toggleComplete(todo.id)}
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors flex-shrink-0 ${
                    todo.isCompleted 
                    ? 'bg-dream-mint border-dream-mint text-emerald-600' 
                    : 'border-gray-300 hover:border-dream-mint'
                }`}
                >
                {todo.isCompleted && <Check size={14} />}
                </button>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className={`text-gray-800 font-medium truncate ${todo.isCompleted ? 'line-through text-gray-400' : ''}`}>
                            {todo.title}
                        </p>
                        {todo.isRecurring && <RotateCw size={12} className="text-blue-400" />}
                    </div>
                    
                    <div className="flex flex-wrap items-center mt-1 gap-2 text-xs">
                        {todo.dueDate && (
                            <span className={`flex items-center ${todo.dueDate < new Date().toISOString().split('T')[0] && !todo.isCompleted ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                <Calendar size={10} className="mr-1" />
                                {todo.dueDate}
                            </span>
                        )}
                        <span className="flex items-center text-orange-400 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                            {todo.points} <Star size={10} className="ml-1 fill-current" />
                        </span>
                        {todo.linkedDreamId && (
                            <span className="flex items-center text-dream-coral font-medium bg-rose-50 px-2 py-0.5 rounded-full max-w-[150px] truncate">
                                <Wand2 size={10} className="mr-1" />
                                {getLinkedDreamTitle(todo.linkedDreamId)}
                            </span>
                        )}
                        {todo.journal.length > 0 && (
                            <span className="text-dream-lavender font-bold flex items-center">
                                <Book size={10} className="mr-1"/> {todo.journal.length} entries
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-2">
                    <button 
                        onClick={() => setActiveJournalId(todo.id)}
                        className="p-2 text-gray-300 hover:text-dream-lavender transition-colors"
                        title="Add Journal Entry"
                    >
                        <Book size={18} />
                    </button>
                    <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            
            {/* Expanded details could go here */}
          </div>
        ))}
      </div>

      {/* Journal Modal */}
      {activeJournalId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-slide-up">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-dream-text">Task Journal</h3>
                      <button onClick={() => setActiveJournalId(null)}><X size={24} className="text-gray-400" /></button>
                  </div>
                  
                  <div className="mb-4 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-xl space-y-2">
                       {items.find(i => i.id === activeJournalId)?.journal.map(j => (
                           <div key={j.id} className="bg-white p-2 rounded-lg text-sm shadow-sm">
                               <p className="text-xs text-gray-400 mb-1">{new Date(j.date).toLocaleDateString()}</p>
                               <p>{j.text}</p>
                               {j.imageUrl && <img src={j.imageUrl} alt="Journal" className="mt-2 h-20 rounded-md object-cover" />}
                           </div>
                       ))}
                       {items.find(i => i.id === activeJournalId)?.journal.length === 0 && <p className="text-center text-gray-400 text-sm">No entries yet.</p>}
                  </div>

                  <textarea 
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="How is it going? Any blockers?"
                    className="w-full p-3 bg-gray-50 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-dream-peach h-24 resize-none"
                  />
                  
                  <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="Image URL (optional)" 
                        value={journalImage}
                        onChange={(e) => setJournalImage(e.target.value)}
                        className="flex-1 p-2 bg-gray-50 rounded-xl text-sm outline-none"
                      />
                      <div className="p-2 bg-gray-100 rounded-xl text-gray-400"><ImageIcon size={20} /></div>
                  </div>

                  <button 
                    onClick={saveJournal}
                    disabled={!journalText}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${!journalText ? 'bg-gray-300' : 'bg-dream-text hover:bg-black'}`}
                  >
                      Save Entry
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default TodoList;
