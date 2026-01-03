import React from 'react';
import { User } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, Film, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', earnings: 400 },
  { name: 'Feb', earnings: 300 },
  { name: 'Mar', earnings: 600 },
  { name: 'Apr', earnings: 800 },
  { name: 'May', earnings: 1500 },
  { name: 'Jun', earnings: 2100 },
  { name: 'Jul', earnings: 2400 },
];

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold font-space-grotesk text-white">Command Center</h2>
        <p className="text-slate-400">Welcome back, {user.name}. Your twin is active in 14 productions.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Earnings', value: `$${user.balance.toLocaleString()}`, icon: Wallet, color: 'text-emerald-400' },
          { label: 'Royalties (MoM)', value: '+24.5%', icon: TrendingUp, color: 'text-violet-400' },
          { label: 'Active Licenses', value: '14', icon: Film, color: 'text-blue-400' },
          { label: 'Twin Views', value: '8.2k', icon: Users, color: 'text-fuchsia-400' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 font-space-grotesk">{stat.value}</h3>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md h-96 mb-10"
      >
        <h3 className="text-xl font-bold text-white mb-6 font-space-grotesk">Earnings Trajectory</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#a78bfa' }}
            />
            <Area type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Active Assets */}
      <h3 className="text-xl font-bold text-white mb-6 font-space-grotesk">Active Digital Twins</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.ownedTwins.map((twin) => (
          <div key={twin.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 items-center">
            <img src={twin.imageUrl} alt={twin.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h4 className="font-bold text-white">{twin.name}</h4>
              <p className="text-sm text-slate-400">{twin.genres[0]} • {twin.rating} ★</p>
              <p className="text-xs text-violet-400 mt-1">Status: Licensed in 3 projects</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
