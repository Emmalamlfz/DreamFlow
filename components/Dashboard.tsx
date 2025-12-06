import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { BucketItem, TodoItem, Habit } from '../types';
import { Target, CheckCircle, Flame } from 'lucide-react';

interface DashboardProps {
  bucketList: BucketItem[];
  todos: TodoItem[];
  habits: Habit[];
}

const Dashboard: React.FC<DashboardProps> = ({ bucketList, todos, habits }) => {
  // Calculate Stats
  const completedBucket = bucketList.filter(i => i.isCompleted).length;
  const totalBucket = bucketList.length || 1; // avoid divide by zero
  
  const completedTodos = todos.filter(t => t.isCompleted).length;
  const pendingTodos = todos.length - completedTodos;

  const bucketData = [
    { name: 'Completed', value: completedBucket },
    { name: 'Remaining', value: bucketList.length - completedBucket },
  ];
  
  const COLORS = ['#D3EADA', '#F9ECE3']; // Mint and Peach

  // Habit completion data for the week (mock logic for demo visualization)
  const habitData = habits.map(h => ({
    name: h.title,
    streak: h.streak
  }));

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-dream-text">Good Morning, Dreamer.</h1>
        <p className="text-dream-subtext mt-2">Here is your progress towards your best self.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#F2D894] to-[#F9C0AF] rounded-3xl p-6 text-white shadow-lg transform transition hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold opacity-90">Dreams Realized</h2>
            <Target className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{completedBucket} <span className="text-xl font-normal opacity-80">/ {bucketList.length}</span></p>
        </div>

        <div className="bg-gradient-to-br from-[#D2C7E5] to-[#D3EADA] rounded-3xl p-6 text-slate-700 shadow-lg transform transition hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold opacity-90">Tasks Done</h2>
            <CheckCircle className="w-6 h-6 opacity-60" />
          </div>
          <p className="text-4xl font-bold text-slate-800">{completedTodos}</p>
        </div>

        <div className="bg-gradient-to-br from-[#FFDDD8] to-[#F9C0AF] rounded-3xl p-6 text-white shadow-lg transform transition hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold opacity-90">Active Habits</h2>
            <Flame className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{habits.length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bucket Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-dream-peach">
          <h3 className="text-xl font-bold text-dream-text mb-4">Dream Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bucketData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bucketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-dream-subtext mt-2">
            {Math.round((completedBucket/totalBucket) * 100)}% of your list completed
          </div>
        </div>

        {/* Habit Streaks */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-dream-mint">
          <h3 className="text-xl font-bold text-dream-text mb-4">Current Streaks</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="streak" fill="#D2C7E5" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
