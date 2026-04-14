"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"
import { quotes } from "../motivational thoughts/quote"
import { 
  Plus, Target, Utensils, Dumbbell, ChevronRight, 
  Menu, User, LogOut, Activity, Settings, 
  Bell, MessageSquare, Sun, Moon, Camera, 
  ClipboardList, FileText, Tag, Search 
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter()
  
  // --- States ---
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [consumedCalories, setConsumedCalories] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [displayName, setDisplayName] = useState("User")
  const [randomQuote, setRandomQuote] = useState("")
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [stepsCount, setStepsCount] = useState(6432)

  const DAILY_GOAL = 2000 

  useEffect(() => {
    const selected = quotes[Math.floor(Math.random() * quotes.length)];
    setRandomQuote(selected);
    
    const fetchDashboardData = async () => {
      try {
        const role = localStorage.getItem("userRole")
        if (role === "guest") {
          setIsGuest(true); setDisplayName("Guest"); setLoading(false);
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { 
          window.location.href = "/login"; 
          return; 
        }

        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profileData)
        const nameFromMeta = user.user_metadata?.full_name || user.email?.split('@')[0] || "User"
        setDisplayName(profileData?.full_name?.split(' ')[0] || nameFromMeta.split(' ')[0])

        const { data: historyData } = await supabase.from("history").select("nutrition").eq("user_id", user.id)
        
        if (historyData && historyData.length > 0) {
          const total = historyData.reduce((sum: number, item: any) => {
            try {
              const nutrition = typeof item.nutrition === 'string' 
                ? JSON.parse(item.nutrition) 
                : item.nutrition;

              const cal = nutrition?.calories || 
                          nutrition?.Calories || 
                          nutrition?.total_calories || 
                          nutrition?.total_cal || 
                          nutrition?.kcal || 0;
              
              return sum + Number(cal);
            } catch (e) {
              return sum;
            }
          }, 0);
          
          setConsumedCalories(Math.round(total));
        }
      } catch (err) { 
        console.error("Dashboard error:", err) 
      } finally { 
        setLoading(false) 
      }
    }

    fetchDashboardData()
  }, []); 

  const handleLogout = async () => {
    await supabase.auth.signOut(); 
    localStorage.clear(); 
    window.location.href = "/login";
  }

  if (loading) return (
    <div style={{ backgroundColor: isDarkMode ? '#0F172A' : '#E1EFFF' }} className="min-h-screen flex items-center justify-center">
      <Activity className="animate-spin text-[#00D261]" size={40} />
    </div>
  )

  return (
    <div 
      style={{ 
        backgroundColor: isDarkMode ? '#0F172A' : '#E1EFFF', 
        minHeight: '100vh',
        transition: 'background-color 0.4s ease'
      }} 
      className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-sans pb-10 overflow-x-hidden`}
    >
      
      {/* 🟢 HEADER */}
      <motion.header 
        initial={{ y: -50 }} animate={{ y: 0 }}
        className={`${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-blue-100'} w-full backdrop-blur-md border-b px-6 py-4 flex items-center justify-between sticky top-0 z-[100] shadow-sm`}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/dashboard"}>
          <div className="bg-[#00D261] p-1.5 rounded-lg text-white shadow-lg"><Activity size={22} /></div>
          <span className="text-xl font-black italic">Calorie <span className="text-[#00D261]">Ai</span></span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {!isGuest && (
            <>
              <button onClick={() => window.location.href = "/notifications"} className={`${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-blue-50 text-slate-500'} w-10 h-10 flex items-center justify-center rounded-full border shadow-sm active:scale-90 transition-all cursor-pointer`}><Bell size={18} /></button>
              <button onClick={() => window.location.href = "/contact"} className={`${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-blue-50 text-slate-500'} w-10 h-10 flex items-center justify-center rounded-full border shadow-sm active:scale-95 transition-all cursor-pointer`}><MessageSquare size={18} /></button>
              <button onClick={() => window.location.href = "/profile"} className={`${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-blue-50 text-slate-500'} w-10 h-10 flex items-center justify-center rounded-full border shadow-sm active:scale-90 transition-all cursor-pointer`}><User size={20} /></button>

              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`${isDarkMode ? 'bg-yellow-400 text-slate-900' : 'bg-slate-900 text-yellow-400'} w-10 h-10 flex items-center justify-center rounded-full shadow-lg active:scale-90 transition-all transform hover:rotate-12 cursor-pointer`}>
                {isDarkMode ? <Sun size={18} strokeWidth={3} /> : <Moon size={18} strokeWidth={3} />}
              </button>
            </>
          )}

          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1F2C] text-white shadow-lg active:scale-90"><Menu size={18} /></button>
            <AnimatePresence>
              {showMenu && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-blue-50 text-slate-700'} absolute top-12 right-0 w-52 rounded-2xl shadow-2xl p-2 z-[110] border`}>
                  <button onClick={() => window.location.href = "/profile"} className="w-full flex items-center gap-3 p-3 hover:bg-opacity-10 hover:bg-blue-400 rounded-xl text-sm font-bold"><Settings size={16} /> Settings</button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl text-sm font-bold text-red-500"><LogOut size={16} /> Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-black italic">Heyyy {displayName}! ⚡</h1>

        {/* 🟢 DAILY MOTIVATION CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-[2rem] shadow-sm relative overflow-hidden border`}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1.5px] bg-blue-500"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 italic">
                Motivational Thought of the Day!! 
              </p>
            </div>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-800'} text-xl font-bold italic leading-tight`}>
              "{randomQuote || "Loading your daily boost..."}"
            </p>
          </div>
        </motion.div>

        {/* 🟢 PREMIUM PROGRESS CARD (Same as your screenshot) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'} p-10 rounded-[3rem] shadow-sm relative overflow-hidden border`}
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="text-left w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">
                  Daily Consumption
                </p>
              </div>
              <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-5xl font-black italic tracking-tighter`}>
                {consumedCalories} <span className="text-lg font-medium text-gray-400 not-italic ml-1">/ {DAILY_GOAL} kcal</span>
              </h3>
            </div>
            <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
              <span className="text-3xl font-black italic text-blue-600">
                {Math.min(Math.round((consumedCalories / DAILY_GOAL) * 100), 100)}%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative h-5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((consumedCalories / DAILY_GOAL) * 100, 100)}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={`h-full rounded-full shadow-lg ${consumedCalories > DAILY_GOAL ? 'bg-red-500' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`}
              />
            </div>
            <div className="flex justify-between px-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Keep going, {displayName}!</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {Math.max(DAILY_GOAL - consumedCalories, 0)} kcal remaining
              </p>
            </div>
          </div>

{/* 🔍 AI SCANNING HUB (Replacement Code) */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
  
  {/* 1. MEAL SCANNER */}
  <motion.button 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.location.href = "/scan"} 
    className="bg-slate-900 text-white p-5 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center cursor-pointer group min-h-[120px]"
  >
    <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-white/20 mb-2">
      <Camera size={22} strokeWidth={2.5} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-wider italic">Scan Meal</span>
  </motion.button>

  {/* 2. PRESCRIPTION AI */}
  <motion.div 
    whileHover={{ y: -5 }}
    className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-blue-50/50 border-blue-100 text-slate-900'} p-5 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center text-center group min-h-[120px]`}
  >
    <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500 mb-2">
      <ClipboardList size={22} />
    </div>
    <h4 className="font-black text-[9px] uppercase italic leading-none">Prescription</h4>
    <p className="text-[7px] text-gray-400 mt-1 font-bold uppercase tracking-tighter italic">AI Digitize</p>
  </motion.div>

  {/* 3. REPORT SCANNER */}
  <motion.div 
    whileHover={{ y: -5 }}
    className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-purple-50/50 border-purple-100 text-slate-900'} p-5 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center text-center group min-h-[120px]`}
  >
    <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-500 mb-2">
      <FileText size={22} />
    </div>
    <h4 className="font-black text-[9px] uppercase italic leading-none">Lab Reports</h4>
    <p className="text-[7px] text-gray-400 mt-1 font-bold uppercase tracking-tighter italic">AI Analysis</p>
  </motion.div>

  {/* 4. FOOD LABELS */}
  <motion.div 
    whileHover={{ y: -5 }}
    className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-orange-50/50 border-orange-100 text-slate-900'} p-5 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center text-center group min-h-[120px]`}
  >
    <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-500 mb-2">
      <Tag size={22} />
    </div>
    <h4 className="font-black text-[9px] uppercase italic leading-none">Food Label</h4>
    <p className="text-[7px] text-gray-400 mt-1 font-bold uppercase tracking-tighter italic">Safety Check</p>
  </motion.div>
</div>
        </motion.div>
        




{/* 🟢 WATER & STEPS TRACKERS SECTION */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  
  {/* Water Tracker Card */}
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-100'} p-8 rounded-[2.5rem] border shadow-sm relative overflow-hidden group min-h-[220px] flex flex-col justify-center`}
  >
    <AnimatePresence>
      {waterGlasses >= 12 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-20 bg-[#38BDF8] flex flex-col items-center justify-center text-center p-6"
        >
          <div className="bg-white/20 p-3 rounded-full mb-3"><Activity className="text-white" size={30} /></div>
          <h4 className="text-white font-black italic text-xl uppercase">Well Done, {displayName}!</h4>
          <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest mt-1">Daily hydration goal reached! 💧</p>
          <button onClick={() => setWaterGlasses(0)} className="mt-4 text-white/70 text-[9px] font-black uppercase tracking-widest hover:text-white underline decoration-2 underline-offset-4">Reset Tracker</button>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#38BDF8] mb-1 italic">Hydration</p>
        <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-4xl font-black italic tracking-tighter`}>
          {waterGlasses * 250}<span className="text-sm font-medium text-gray-400 not-italic ml-1">ml</span>
        </h3>
        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter italic">
          Progress: {waterGlasses} / 12 Glasses
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button 
          onClick={() => setWaterGlasses(prev => Math.min(prev + 1, 12))}
          className="bg-[#38BDF8] text-white p-4 rounded-2xl hover:bg-blue-500 active:scale-90 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} strokeWidth={4} />
        </button>
        {waterGlasses > 0 && (
          <button onClick={() => setWaterGlasses(prev => Math.max(prev - 1, 0))} className="text-gray-400 hover:text-red-400 text-[9px] font-black uppercase tracking-tighter">Minus</button>
        )}
      </div>
    </div>
    
    {/* Water Wave Animation */}
    <motion.div 
      animate={{ y: 220 - (waterGlasses * 18.3) }}
      className="absolute bottom-0 left-0 right-0 h-[220px] bg-[#38BDF8]/15 -z-0 transition-all duration-1000 ease-out"
      style={{ borderRadius: '45% 45% 0 0' }}
    />
  </motion.div>

  {/* Steps Tracker Card */}
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-blue-100 text-slate-900'} p-8 rounded-[2.5rem] border shadow-sm relative overflow-hidden min-h-[220px] flex flex-col justify-center`}
  >
    <AnimatePresence>
      {stepsCount >= 10000 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-20 bg-[#22C55E] flex flex-col items-center justify-center text-center p-6"
        >
          <div className="bg-white/20 p-3 rounded-full mb-3"><Target className="text-white" size={30} /></div>
          <h4 className="text-white font-black italic text-xl uppercase">Legendary, {displayName}!</h4>
          <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest mt-1">10,000 Steps Goal Reached! 👟</p>
          <button onClick={() => setStepsCount(0)} className="mt-4 text-white/70 text-[9px] font-black uppercase tracking-widest hover:text-white underline decoration-2 underline-offset-4">Reset Steps</button>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="flex justify-between items-center relative z-10">
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22C55E] mb-1 italic">Activity</p>
        <h3 className="text-4xl font-black italic tracking-tighter">
          {stepsCount.toLocaleString()}<span className="text-sm font-medium text-gray-400 not-italic ml-1 uppercase">steps</span>
        </h3>
        <div className="w-40 h-2 bg-gray-100 rounded-full mt-4 overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stepsCount / 10000) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#22C55E] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.3)]"
          />
        </div>
        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter italic">Daily Target: 10k</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button 
          onClick={() => setStepsCount(prev => Math.min(prev + 500, 10000))}
          className="bg-[#22C55E] text-white p-4 rounded-2xl hover:bg-green-600 active:scale-90 transition-all shadow-lg shadow-green-100"
        >
          <Plus size={20} strokeWidth={4} />
        </button>
        {stepsCount > 0 && (
          <button onClick={() => setStepsCount(prev => Math.max(prev - 500, 0))} className="text-gray-400 hover:text-red-500 text-[9px] font-black uppercase tracking-tighter">Minus</button>
        )}
      </div>
    </div>
  </motion.div>

</div>

        {/* 🟢 ACTION GRID */}
        {!isGuest && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => window.location.href = "/profile"} className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-blue-100 text-slate-900'} p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between cursor-pointer border hover:-translate-y-2 transition-all`}>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BMI Status</p><h3 className="text-2xl font-black italic">{profile?.bmi || "19.84"}</h3></div>
              <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500"><Target size={32} /></div>
            </div>
            <div onClick={() => window.location.href = "/diet"} className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-blue-100 text-slate-900'} p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between cursor-pointer border hover:-translate-y-2 transition-all group`}>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diet Plan</p><h3 className="text-2xl font-black italic flex items-center">VIEW <ChevronRight className="group-hover:translate-x-1 transition-transform" /></h3></div>
              <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-500"><Utensils size={32} /></div>
            </div>
            <div onClick={() => window.location.href = "/exercise"} className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-blue-100 text-slate-900'} p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between cursor-pointer border hover:-translate-y-2 transition-all group`}>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workouts</p><h3 className="text-2xl font-black italic flex items-center">EXERCISE <ChevronRight className="group-hover:translate-x-1 transition-transform" /></h3></div>
              <div className="bg-purple-500/10 p-4 rounded-2xl text-purple-500"><Dumbbell size={32} /></div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center mt-10 opacity-30 text-[10px] font-black uppercase tracking-[0.5em]">
        All rights reserved. Calorie.Ai 2026.
      </footer>
    </div>
  )
}