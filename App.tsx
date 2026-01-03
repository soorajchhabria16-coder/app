import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, LayoutGrid, Upload as UploadIcon, UserCircle, Search, Menu, X } from 'lucide-react';

import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
// Removed static import: import { TwinCard } from './components/TwinCard';
import { UploadTwin } from './components/UploadTwin';
import { ViewState, User, Twin } from './types';

// Lazy load TwinCard (handling named export)
const TwinCard = lazy(() => import('./components/TwinCard').then(module => ({ default: module.TwinCard })));

// Skeleton Loader for TwinCard
const TwinCardSkeleton = () => (
  <div className="h-[480px] rounded-2xl bg-slate-900/50 border border-white/5 animate-pulse flex flex-col overflow-hidden">
    <div className="h-72 bg-slate-800/50" />
    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-slate-800/50 rounded w-1/4" />
          <div className="h-4 bg-slate-800/50 rounded w-1/4" />
        </div>
        <div className="h-4 bg-slate-800/50 rounded w-3/4" />
        <div className="h-3 bg-slate-800/50 rounded w-full" />
      </div>
      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="h-6 bg-slate-800/50 rounded w-1/3" />
        <div className="h-10 bg-slate-800/50 rounded-xl w-1/3" />
      </div>
    </div>
  </div>
);

// Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Chen',
  balance: 12450.00,
  ownedTwins: [
    {
      id: 't1',
      name: 'Alex C. (Cyber)',
      imageUrl: 'https://picsum.photos/400/400?random=1',
      pricePerUse: 450,
      royaltyRate: 15,
      genres: ['Sci-Fi', 'Futuristic'],
      attributes: {
        ageRange: '25-30',
        ethnicity: 'Asian',
        gender: 'Male',
        hairStyle: 'Short',
        distinctiveFeatures: ['Sharp jawline']
      },
      bio: 'A futuristic tech specialist look.',
      totalEarnings: 4500,
      rating: 4.8,
      isVerified: true
    }
  ]
};

const MOCK_MARKETPLACE: Twin[] = [
  {
    id: 'm1',
    name: 'Sarah J.',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    pricePerUse: 200,
    royaltyRate: 10,
    genres: ['Drama', 'Commercial'],
    attributes: { ageRange: '30-35', ethnicity: 'Caucasian', gender: 'Female', hairStyle: 'Long', distinctiveFeatures: [] },
    bio: 'Warm, approachable look perfect for lifestyle commercials.',
    totalEarnings: 1200,
    rating: 4.9,
    isVerified: true
  },
  {
    id: 'm2',
    name: 'Davide R.',
    imageUrl: 'https://picsum.photos/400/400?random=3',
    pricePerUse: 350,
    royaltyRate: 12,
    genres: ['Action', 'Thriller'],
    attributes: { ageRange: '20-25', ethnicity: 'Latino', gender: 'Male', hairStyle: 'Buzzcut', distinctiveFeatures: ['Scar'] },
    bio: 'Intense gaze, athletic build, suitable for action sequences.',
    totalEarnings: 3200,
    rating: 4.7,
    isVerified: true
  },
  {
    id: 'm3',
    name: 'Elena K.',
    imageUrl: 'https://picsum.photos/400/400?random=4',
    pricePerUse: 500,
    royaltyRate: 18,
    genres: ['Period', 'Fantasy'],
    attributes: { ageRange: '25-30', ethnicity: 'Eastern European', gender: 'Female', hairStyle: 'Updo', distinctiveFeatures: [] },
    bio: 'Classic features tailored for high-fantasy and period pieces.',
    totalEarnings: 8000,
    rating: 5.0,
    isVerified: true
  },
  {
    id: 'm4',
    name: 'Marcus T.',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    pricePerUse: 150,
    royaltyRate: 8,
    genres: ['Urban', 'Background'],
    attributes: { ageRange: '40-45', ethnicity: 'Black', gender: 'Male', hairStyle: 'Bald', distinctiveFeatures: [] },
    bio: 'Versatile background character for urban settings.',
    totalEarnings: 500,
    rating: 4.5,
    isVerified: true
  }
];

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<User>(MOCK_USER);
  const [marketplace, setMarketplace] = useState<Twin[]>(MOCK_MARKETPLACE);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCreateSuccess = (data: any) => {
    const newTwin: Twin = {
      id: `t${Date.now()}`,
      name: `New Twin (${data.attributes.gender})`,
      imageUrl: data.image,
      pricePerUse: 300,
      royaltyRate: 10,
      genres: data.suggestedGenres,
      attributes: data.attributes,
      bio: data.bio,
      totalEarnings: 0,
      rating: 5.0, // New items get boost
      isVerified: true // Auto-verified for demo
    };
    
    setUser(prev => ({
      ...prev,
      ownedTwins: [...prev.ownedTwins, newTwin]
    }));
    setMarketplace(prev => [newTwin, ...prev]);
    setView('dashboard');
  };

  const handleLicense = (twin: Twin) => {
    if (user.balance >= twin.pricePerUse) {
      setUser(prev => ({
        ...prev,
        balance: prev.balance - twin.pricePerUse
      }));
      alert(`Successfully licensed ${twin.name} for $${twin.pricePerUse}. New Balance: $${(user.balance - twin.pricePerUse).toFixed(2)}`);
    } else {
      alert(`Insufficient funds. Your balance is $${user.balance.toFixed(2)}`);
    }
  };

  const navItems = [
    { id: 'marketplace', label: 'Marketplace', icon: LayoutGrid },
    { id: 'dashboard', label: 'Dashboard', icon: UserCircle },
    { id: 'upload', label: 'Mint Twin', icon: UploadIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setView('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Ghost size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold font-space-grotesk tracking-tight">SPECTRA</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as ViewState)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    view === item.id ? 'text-violet-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <div className="w-px h-6 bg-white/10 mx-2" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-300">v2.4.0</span>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/10 bg-slate-900"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id as ViewState);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left text-slate-300 hover:text-white py-2"
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onGetStarted={() => setView('upload')} />
              <div className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-3xl font-bold font-space-grotesk">Featured Talent</h2>
                  <button 
                    onClick={() => setView('marketplace')}
                    className="text-violet-400 hover:text-violet-300 flex items-center gap-2 text-sm"
                  >
                    View All <Search size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {marketplace.slice(0, 4).map(twin => (
                    <Suspense key={twin.id} fallback={<TwinCardSkeleton />}>
                      <TwinCard twin={twin} onLicense={handleLicense} />
                    </Suspense>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 py-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-3xl font-bold font-space-grotesk mb-2">Global Marketplace</h2>
                  <p className="text-slate-400">Discover and license high-fidelity digital humans.</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search by genre, look..." 
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 w-64 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {marketplace.map(twin => (
                  <Suspense key={twin.id} fallback={<TwinCardSkeleton />}>
                    <TwinCard twin={twin} onLicense={handleLicense} />
                  </Suspense>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard user={user} />
            </motion.div>
          )}

          {view === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UploadTwin onSuccess={handleCreateSuccess} onCancel={() => setView('dashboard')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Ghost size={20} className="text-violet-500/50" />
            <span className="font-space-grotesk font-bold text-slate-400">SPECTRA</span>
          </div>
          <p>© 2024 Spectra Digital Assets. Powered by Gaussian Splatting & Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}