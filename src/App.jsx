import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Calculator from './components/Calculator';
import { Trash2, TrendingUp, Calendar } from 'lucide-react';

/**
 * @file App.jsx
 * @description Main Entry point. Manages User Session and Dashboard state.
 */
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load User from LocalStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('calorieAI_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Utility to clear session
  const resetProfile = () => {
    if(confirm("Are you sure you want to reset? This will delete your progress.")) {
      localStorage.removeItem('calorieAI_user');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Navbar />
      
      <main className="relative max-w-7xl mx-auto px-6 pb-20">
        {user ? (
          /* --- DASHBOARD VIEW --- */
          <div className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-tighter mb-1">
                  <Calendar size={14} /> Today's Overview
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Welcome, Champ! 👋</h1>
                <p className="text-slate-500 font-medium text-lg mt-1">Let's keep your nutrition on track.</p>
              </div>
              <button onClick={resetProfile} className="flex items-center gap-2 text-slate-400 hover:text-rose-500 font-bold transition-colors bg-white px-4 py-2 rounded-xl border border-slate-100">
                <Trash2 size={16} /> Reset Profile
              </button>
            </header>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Target Goal</p>
                <h3 className="text-5xl font-black text-slate-900">{user.dailyGoal} <span className="text-xl text-slate-300">kcal</span></h3>
                <div className="mt-6 flex items-center gap-2 text-green-500 font-bold text-sm">
                   <TrendingUp size={16} /> <span>100% accurate BMR</span>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-white/60">Remaining</p>
                  <h3 className="text-6xl font-black text-orange-500">{user.remaining} <span className="text-xl text-white/40">kcal</span></h3>
                  <p className="mt-4 text-white/60 font-medium">No food logged yet.</p>
                </div>
                {/* Visual Decoration */}
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                 <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4">
                    <TrendingUp size={32} />
                 </div>
                 <p className="text-slate-600 font-bold italic text-sm">"Success starts with a single log."</p>
              </div>
            </div>

            {/* Next Feature Section Placeholder */}
            <div className="bg-orange-50/50 border-2 border-dashed border-orange-100 rounded-[3rem] p-20 text-center">
               <h4 className="text-2xl font-black text-slate-400">AI Food Logger Coming Next...</h4>
            </div>
          </div>
        ) : (
          /* --- LANDING VIEW --- */
          <Hero onOpenModal={() => setIsModalOpen(true)} />
        )}
      </main>

      {/* Modal Components */}
      <Calculator isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Background Aesthetic */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-green-100/40 rounded-full blur-[120px]"></div>
      </div>
    </div>
  )
}

export default App;