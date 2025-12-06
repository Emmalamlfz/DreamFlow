
import React, { useState } from 'react';
import { BucketItem, Category, TodoItem, Priority, Habit } from '../types';
import { Plus, Wand2, Trash2, MapPin, Briefcase, Heart, Activity, DollarSign, Palette, Loader2, BookOpen, User, Mountain, Shuffle, Link as LinkIcon } from 'lucide-react';
import { generateActionPlan } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface BucketListProps {
  items: BucketItem[];
  setItems: React.Dispatch<React.SetStateAction<BucketItem[]>>;
  addTodos: (todos: TodoItem[]) => void;
  addHabit: (habit: Habit) => void;
}

const BucketList: React.FC<BucketListProps> = ({ items, setItems, addTodos, addHabit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<BucketItem>>({
    title: '',
    description: '',
    category: Category.ADVENTURE,
  });
  
  // Link creation state
  const [createLinkedTask, setCreateLinkedTask] = useState(false);
  const [createLinkedHabit, setCreateLinkedHabit] = useState(false);

  const handleAddItem = () => {
    if (!newItem.title) return;
    const newId = uuidv4();
    
    // Create bucket item
    const item: BucketItem = {
      id: newId,
      title: newItem.title,
      description: newItem.description || '',
      category: newItem.category as Category,
      isCompleted: false,
      generatedTasks: false,
      relatedTodoIds: [],
      relatedHabitIds: [],
      imageUrl: `https://picsum.photos/seed/${Math.random()}/400/200`
    };

    const newTodos: TodoItem[] = [];
    const newHabit: Habit | null = createLinkedHabit ? {
        id: uuidv4(),
        title: `Work on: ${item.title}`,
        streak: 0,
        completedDates: [],
        color: '#F2D894',
        linkedDreamId: newId
    } : null;

    if (createLinkedTask) {
        newTodos.push({
            id: uuidv4(),
            title: `Start: ${item.title}`,
            isCompleted: false,
            priority: Priority.HIGH,
            points: 50,
            journal: [],
            linkedDreamId: newId,
            createdAt: Date.now()
        });
    }

    if (newHabit) {
        item.relatedHabitIds.push(newHabit.id);
        addHabit(newHabit);
    }
    if (newTodos.length > 0) {
        item.relatedTodoIds = newTodos.map(t => t.id);
        addTodos(newTodos);
    }

    setItems([...items, item]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewItem({ title: '', description: '', category: Category.ADVENTURE });
    setCreateLinkedTask(false);
    setCreateLinkedHabit(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const toggleComplete = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, isCompleted: !i.isCompleted } : i));
  };

  const handleGeneratePlan = async (item: BucketItem) => {
    if (item.generatedTasks) return;
    setLoadingId(item.id);
    try {
      const steps = await generateActionPlan(item.title);
      const newTodos: TodoItem[] = steps.map(step => ({
        id: uuidv4(),
        title: step,
        linkedDreamId: item.id,
        isCompleted: false,
        priority: Priority.MEDIUM,
        points: 20, // Default points for AI tasks
        journal: [],
        createdAt: Date.now()
      }));
      
      addTodos(newTodos);
      // Update bucket item links
      setItems(items.map(i => i.id === item.id ? { 
          ...i, 
          generatedTasks: true,
          relatedTodoIds: [...i.relatedTodoIds, ...newTodos.map(t => t.id)]
      } : i));
      
      alert(`🎉 Added ${steps.length} actionable steps to your To-Do list!`);
    } catch (e) {
      alert("Failed to generate plan. Please check API Key.");
    } finally {
      setLoadingId(null);
    }
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case Category.TRAVEL: return <MapPin size={16} />;
      case Category.CAREER: return <Briefcase size={16} />;
      case Category.PERSONAL: return <Heart size={16} />;
      case Category.HEALTH: return <Activity size={16} />;
      case Category.FINANCE: return <DollarSign size={16} />;
      case Category.CREATIVE: return <Palette size={16} />;
      case Category.LEARNING: return <BookOpen size={16} />;
      case Category.SELF_IMPROVEMENT: return <User size={16} />;
      case Category.ADVENTURE: return <Mountain size={16} />;
      case Category.RELATIONSHIP: return <Heart size={16} className="text-red-400" />;
      case Category.OTHER: return <Shuffle size={16} />;
      default: return <Heart size={16} />;
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-dream-text">Bucket List</h2>
          <p className="text-dream-subtext">Visualize your dreams. Make them tangible.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-dream-text text-white p-3 rounded-full shadow-lg hover:bg-black transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className={`group bg-white rounded-3xl overflow-hidden shadow-sm border border-transparent hover:border-dream-peach transition-all duration-300 ${item.isCompleted ? 'opacity-60 grayscale' : ''}`}>
            <div className="h-32 bg-gray-200 relative">
               <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
               <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
                 {getCategoryIcon(item.category)}
               </div>
               {item.isCompleted && (
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                       <span className="bg-white/90 text-dream-text font-bold px-4 py-1 rounded-full text-sm">Realized</span>
                   </div>
               )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-xl font-bold text-dream-text ${item.isCompleted ? 'line-through' : ''}`}>{item.title}</h3>
                <input 
                  type="checkbox" 
                  checked={item.isCompleted} 
                  onChange={() => toggleComplete(item.id)}
                  className="w-6 h-6 rounded-full border-2 border-dream-lavender text-dream-lavender focus:ring-dream-lavender cursor-pointer accent-dream-lavender flex-shrink-0 ml-2"
                />
              </div>
              <p className="text-sm text-dream-subtext mb-4 line-clamp-2">{item.description || 'No description'}</p>
              
              {(item.relatedTodoIds.length > 0 || item.relatedHabitIds.length > 0) && (
                  <div className="flex gap-2 mb-4 text-xs text-gray-400">
                      {item.relatedTodoIds.length > 0 && <span className="flex items-center"><LinkIcon size={10} className="mr-1"/> {item.relatedTodoIds.length} Tasks</span>}
                      {item.relatedHabitIds.length > 0 && <span className="flex items-center"><LinkIcon size={10} className="mr-1"/> {item.relatedHabitIds.length} Habits</span>}
                  </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                
                {!item.isCompleted && (
                  <button 
                    onClick={() => handleGeneratePlan(item)}
                    disabled={item.generatedTasks || loadingId === item.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      item.generatedTasks 
                      ? 'bg-gray-100 text-gray-400 cursor-default' 
                      : 'bg-gradient-to-r from-dream-yellow to-dream-coral text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {loadingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    {item.generatedTasks ? 'Plan Created' : 'Break it Down'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-dream-text">New Dream</h3>
            
            <label className="block text-sm font-bold text-gray-500 mb-1">Dream Title</label>
            <input
              type="text"
              placeholder="Visit space, Write a book..."
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full p-4 mb-4 bg-dream-bg rounded-xl border-none focus:ring-2 focus:ring-dream-peach outline-none"
            />

            <label className="block text-sm font-bold text-gray-500 mb-1">Category</label>
            <select 
               value={newItem.category}
               onChange={(e) => setNewItem({...newItem, category: e.target.value as Category})}
               className="w-full p-4 mb-4 bg-dream-bg rounded-xl border-none focus:ring-2 focus:ring-dream-peach outline-none"
            >
                {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <label className="block text-sm font-bold text-gray-500 mb-1">Why is this important?</label>
            <textarea
              placeholder="Motivation..."
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full p-4 mb-4 bg-dream-bg rounded-xl border-none focus:ring-2 focus:ring-dream-peach outline-none h-24 resize-none"
            />
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <p className="text-sm font-bold text-gray-500 mb-2">Immediate Actions (Optional)</p>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={createLinkedTask} onChange={(e) => setCreateLinkedTask(e.target.checked)} className="accent-dream-coral" />
                        <span className="text-sm">Create a "Start" Task in To-Do List</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={createLinkedHabit} onChange={(e) => setCreateLinkedHabit(e.target.checked)} className="accent-dream-coral" />
                        <span className="text-sm">Create a tracking Habit</span>
                    </label>
                </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddItem} className="flex-1 py-3 bg-dream-text text-white rounded-xl shadow-lg hover:bg-black transition-colors font-medium">Add Dream</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BucketList;
