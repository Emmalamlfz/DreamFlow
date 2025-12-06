
import React from 'react';
import { UserStats, Plant } from '../types';
import { User, Sun, ShoppingBag } from 'lucide-react';

interface ProfileProps {
  userStats: UserStats;
  buyPlant: (plantId: string, cost: number) => void;
}

const SHOP_ITEMS: Omit<Plant, 'owned'>[] = [
    { id: '1', name: 'Sunflower', icon: 'flower', cost: 50 },
    { id: '2', name: 'Oak Sapling', icon: 'tree', cost: 150 },
    { id: '3', name: 'Rose Bush', icon: 'rose', cost: 80 },
    { id: '4', name: 'Fern', icon: 'fern', cost: 30 },
];

const Profile: React.FC<ProfileProps> = ({ userStats, buyPlant }) => {
  return (
    <div className="animate-fade-in pb-20">
       <header className="mb-8 flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold text-dream-text">Me</h1>
            <p className="text-dream-subtext">Manage your profile and rewards.</p>
         </div>
         <div className="bg-gray-100 p-4 rounded-full">
             <User size={32} className="text-gray-400" />
         </div>
       </header>

       {/* Stats Card */}
       <div className="bg-gradient-to-r from-dream-yellow to-dream-coral text-white p-8 rounded-3xl shadow-lg mb-8">
           <div className="flex justify-between items-start">
               <div>
                   <p className="opacity-80 font-medium mb-1">Current Balance</p>
                   <h2 className="text-5xl font-bold flex items-center">
                       {userStats.sunlight} <span className="text-2xl ml-2 opacity-80">Sunlight</span>
                   </h2>
               </div>
               <Sun size={48} className="opacity-50 spin-slow" />
           </div>
           <div className="mt-8 pt-6 border-t border-white/20 flex gap-8">
               <div>
                   <p className="text-sm opacity-80">Garden Level</p>
                   <p className="text-2xl font-bold">{userStats.level}</p>
               </div>
               <div>
                   <p className="text-sm opacity-80">Plants Owned</p>
                   <p className="text-2xl font-bold">{userStats.inventory.reduce((acc, curr) => acc + curr.owned, 0)}</p>
               </div>
           </div>
       </div>

       {/* Shop */}
       <h2 className="text-2xl font-bold text-dream-text mb-4 flex items-center">
           <ShoppingBag className="mr-2" /> Garden Shop
       </h2>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {SHOP_ITEMS.map(item => (
               <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:border-dream-yellow transition-all">
                   <div className="text-4xl mb-4">
                       {item.icon === 'tree' ? '🌳' : item.icon === 'flower' ? '🌻' : item.icon === 'rose' ? '🌹' : '🌿'}
                   </div>
                   <h3 className="font-bold text-gray-800">{item.name}</h3>
                   <div className="flex items-center text-orange-400 font-bold text-sm my-2">
                       {item.cost} <Sun size={12} className="ml-1" fill="currentColor" />
                   </div>
                   <button 
                    onClick={() => buyPlant(item.id, item.cost)}
                    disabled={userStats.sunlight < item.cost}
                    className={`w-full py-2 rounded-xl text-sm font-bold mt-2 ${
                        userStats.sunlight >= item.cost 
                        ? 'bg-dream-text text-white hover:bg-black' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                   >
                       Buy
                   </button>
               </div>
           ))}
       </div>
    </div>
  );
};

export default Profile;
