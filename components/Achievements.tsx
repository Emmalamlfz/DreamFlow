
import React from 'react';
import { UserStats, BucketItem, TodoItem } from '../types';
import { Trophy, Sprout, BookOpen, Calendar, Trees } from 'lucide-react';

interface AchievementsProps {
  userStats: UserStats;
  bucketList: BucketItem[];
  todos: TodoItem[];
}

const Achievements: React.FC<AchievementsProps> = ({ userStats, bucketList, todos }) => {
  const completedBucket = bucketList.filter(b => b.isCompleted);
  const completedTodosWithJournal = todos.filter(t => t.isCompleted && t.journal.length > 0);

  // Simple garden visualizer - just render the inventory repeated for now or static grid
  const gardenGrid = Array.from({ length: 20 }); 

  return (
    <div className="animate-fade-in pb-20 space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-dream-text">Achievements</h1>
        <p className="text-dream-subtext">Your garden of growth and memories.</p>
      </header>

      {/* The Garden */}
      <div className="bg-gradient-to-b from-blue-50 to-green-50 rounded-3xl p-8 border border-green-100 relative overflow-hidden min-h-[300px]">
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-green-700 shadow-sm flex items-center">
            <Trees className="mr-2" size={16}/> Level {userStats.level} Garden
        </div>
        
        <div className="mt-8 grid grid-cols-5 md:grid-cols-8 gap-4 justify-items-center">
            {/* Render User's Plants */}
            {userStats.inventory.length === 0 && (
                <div className="col-span-full text-gray-400 flex flex-col items-center mt-10">
                    <Sprout size={48} className="mb-4 opacity-50" />
                    <p>Your garden is empty. Visit the Shop to plant seeds!</p>
                </div>
            )}
            
            {userStats.inventory.map((plant, index) => (
                Array.from({length: plant.owned}).map((_, i) => (
                    <div key={`${plant.id}-${i}`} className="flex flex-col items-center animate-slide-up" style={{animationDelay: `${i * 0.1}s`}}>
                        <div className="text-4xl transform hover:scale-125 transition-transform cursor-pointer filter drop-shadow-md">
                            {plant.icon === 'tree' ? '🌳' : plant.icon === 'flower' ? '🌻' : plant.icon === 'rose' ? '🌹' : '🌿'}
                        </div>
                    </div>
                ))
            ))}
        </div>
      </div>

      {/* Timeline / Retrospective */}
      <div className="space-y-6">
          <h2 className="text-2xl font-bold text-dream-text flex items-center">
              <BookOpen className="mr-2" /> Journey Log
          </h2>
          
          <div className="border-l-2 border-dream-peach ml-4 pl-8 space-y-12">
              {/* Completed Dreams */}
              {completedBucket.map(dream => (
                  <div key={dream.id} className="relative">
                      <div className="absolute -left-[41px] bg-dream-yellow p-2 rounded-full text-white shadow-md">
                          <Trophy size={16} />
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <span className="text-xs text-dream-subtext uppercase tracking-wider font-bold mb-1 block">Dream Realized</span>
                          <h3 className="text-xl font-bold text-dream-text mb-2">{dream.title}</h3>
                          <p className="text-gray-600 mb-4">{dream.description}</p>
                          <img src={dream.imageUrl} className="w-full h-48 object-cover rounded-xl" alt="Dream" />
                      </div>
                  </div>
              ))}

              {/* Tasks with Journals */}
              {completedTodosWithJournal.map(task => (
                  <div key={task.id} className="relative">
                      <div className="absolute -left-[41px] bg-dream-lavender p-2 rounded-full text-white shadow-md">
                          <Calendar size={16} />
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                           <span className="text-xs text-dream-subtext uppercase tracking-wider font-bold mb-1 block">
                               Task Completed on {task.dueDate || new Date(task.createdAt).toLocaleDateString()}
                           </span>
                           <h3 className="text-lg font-bold text-gray-800 mb-4">{task.title}</h3>
                           
                           <div className="space-y-4">
                               {task.journal.map(j => (
                                   <div key={j.id} className="bg-gray-50 p-4 rounded-xl">
                                       <p className="text-sm text-gray-700 italic">"{j.text}"</p>
                                       {j.imageUrl && (
                                           <img src={j.imageUrl} alt="Memory" className="mt-3 w-full h-40 object-cover rounded-lg" />
                                       )}
                                   </div>
                               ))}
                           </div>
                      </div>
                  </div>
              ))}

              {completedBucket.length === 0 && completedTodosWithJournal.length === 0 && (
                  <div className="text-gray-400 italic">No completed journeys logged yet. Start doing!</div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Achievements;
