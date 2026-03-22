"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, Target, Utensils, Dumbbell, ChevronRight, 
  Bell, MessageSquare, Menu, User, LogOut, Activity, Zap, Settings, Sparkles, UserPlus
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [consumedCalories, setConsumedCalories] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isGuest, setIsGuest] = useState(false)

  const DAILY_GOAL = 2000 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const role = localStorage.getItem("userRole")
        
        // 1. Guest Check
        if (role === "guest") {
          setIsGuest(true)
          setConsumedCalories(0) // Guest starts fresh
          setLoading(false)
          setTimeout(() => setShowToast(true), 1000)
          return
        }

        // 2. Real User Session Check
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push("/login"); return }

        // 3. Fetch User Profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        setProfile(profileData)

        // 4. 🔴 FETCH HISTORY FROM SUPABASE (Fixes old data showing up)
        const { data: historyData, error: historyError } = await supabase
          .from("history")
          .select("nutrition")
          .eq("user_id", user.id)

        if (!historyError && historyData) {
          const total = historyData.reduce((sum: number, item: any) => {
            // Check if nutrition is string or object
            const nutrition = typeof item.nutrition === 'string' 
              ? JSON.parse(item.nutrition) 
              : item.nutrition;
            return sum + (Number(nutrition?.calories) || 0)
          }, 0)
          setConsumedCalories(total)
        } else {
          setConsumedCalories(0) 
        }

        setTimeout(() => setShowToast(true), 1000)
        setTimeout(() => setShowToast(false), 6000)

      } catch (err) {
        console.error("Dashboard Loading Error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [router])

  // 🔴 FIXED LOGOUT: Clears everything
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear() // Deletes history, userRole, etc.
    router.push("/login")
  }

  const progressPercent = Math.min((consumedCalories / DAILY_GOAL) * 100, 100)

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  }

  if (loading) return (
    <div style={{ backgroundColor: '#E1EFFF' }} className="min-h-screen flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="bg-[#00D261] p-4 rounded-2xl shadow-2xl shadow-green-500/30"
      >
        <Activity className="text-white" size={32} />
      </motion.div>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#E1EFFF', minHeight: '100vh' }} className="text-slate-900 font-sans pb-10 overflow-x-hidden">
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[200] flex justify-center px-6 pointer-events-none"
          >
            <div className="bg-[#1A1F2C] text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 flex items-center gap-3 pointer-events-auto">
              <div className="bg-[#00D261] p-1 rounded-full">
                <Sparkles size={14} className="text-white" />
              </div>
              <p className="text-sm font-bold tracking-tight">
                Calorie Ai - <span className="text-slate-400 font-medium italic">{isGuest ? "Guest Mode Active" : "Your Health Buddy"}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header 
        initial={{ y: -100 }} animate={{ y: 0 }}
        className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-6 py-4 flex items-center justify-between sticky top-0 z-[100] shadow-sm"
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <motion.div whileHover={{ rotate: 15 }} className="bg-[#00D261] p-1.5 rounded-lg text-white shadow-lg">
            <Activity size={22} strokeWidth={3} />
          </motion.div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Calorie <span className="text-[#00D261]">Ai</span>
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => router.push(isGuest ? "/register" : "/profile")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 border border-blue-50 shadow-sm relative"
          >
            <User size={20} />
          </motion.button>

          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1F2C] text-white shadow-lg"
            >
              <Menu size={18} />
            </motion.button>
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute top-12 right-0 w-52 bg-white rounded-2xl shadow-2xl border border-blue-50 p-2 z-[110]"
                >
                  <button onClick={() => router.push(isGuest ? "/register" : "/profile")} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl text-sm font-bold text-slate-700">
                    <Settings size={16} className="mr-2" /> {isGuest ? "Create Account" : "Update Profile"}
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-sm font-bold text-red-500">
                    <LogOut size={16} className="mr-2" /> {isGuest ? "Exit" : "Logout"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <motion.main 
        variants={containerVars} initial="hidden" animate="visible"
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        <motion.div variants={itemVars}>
          <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">{isGuest ? "Quick Mode" : "Your Progress"}</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 italic">
            Hey {isGuest ? "Guest! ⚡" : (profile?.full_name?.split(' ')[0] || "User") + "! ⚡"}
          </h1>
        </motion.div>

        <motion.div 
          variants={itemVars}
          className="bg-[#1A1F2C] rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-white/5"
        >
          <motion.div animate={{ opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-[#00D261] rounded-full blur-[120px] -mr-40 -mt-40" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="75" stroke="#334155" strokeWidth="12" fill="transparent" />
                <motion.circle 
                  cx="88" cy="88" r="75" stroke="#00D261" strokeWidth="14" fill="transparent" 
                  initial={{ strokeDashoffset: 471 }}
                  animate={{ strokeDashoffset: 471 - (471 * progressPercent) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeDasharray={471} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tabular-nums">{consumedCalories}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">kcal used</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <p className="text-[#00D261] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center md:justify-start gap-2">
                  <Zap size={14} fill="#00D261" /> {isGuest ? "Guest Overview" : "Daily Overview"}
                </p>
                <h2 className="text-3xl font-bold mt-2 leading-tight">Goal: {DAILY_GOAL} <span className="text-slate-500 font-medium text-lg italic">kcal</span></h2>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#0f172a" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/scan")} 
                className="bg-[#00D261] text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 mx-auto md:mx-0 shadow-2xl shadow-green-500/40"
              >
                <Plus size={20} strokeWidth={4} /> Scan New Meal
              </motion.button>
            </div>
          </div>
        </motion.div>

        {!isGuest ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
            {[
              { label: "BMI Status", value: profile?.bmi || "24.5", sub: profile?.category || "Normal", icon: Target, color: "text-blue-500", bg: "bg-blue-50", path: null },
              { label: "Diet Plan", value: "View Plan", sub: "Pro Strategy", icon: Utensils, color: "text-orange-500", bg: "bg-orange-50", path: "/diet" },
              { label: "Workouts", value: "Exercise", sub: "Daily Routine", icon: Dumbbell, color: "text-purple-500", bg: "bg-purple-50", path: "/exercise" }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVars}
                whileHover={{ y: -8 }}
                onClick={() => item.path && router.push(item.path)}
                className="bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-xl flex items-center justify-between group cursor-pointer shadow-blue-900/5"
              >
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic flex items-center gap-1">
                    {item.value} {item.path && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </h3>
                  <div className={`px-3 py-1 ${item.bg} ${item.color} rounded-full text-[10px] font-black uppercase italic border border-blue-100 inline-block`}>{item.sub}</div>
                </div>
                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                  <item.icon size={32} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={itemVars}
            className="bg-white/40 border-4 border-dashed border-blue-100 p-12 rounded-[3.5rem] text-center"
          >
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#00D261]">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase italic">Unlock Your Full Potential</h3>
            <p className="text-slate-500 font-bold text-sm max-w-sm mx-auto mt-2">
              Create an account to track your BMI, personalized Diet Plans, and Meal History.
            </p>
            <button 
              onClick={() => router.push("/register")}
              className="mt-6 bg-[#1A1F2C] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto hover:scale-105 transition-all"
            >
              <UserPlus size={16} /> Sign Up Now
            </button>
          </motion.div>
        )}
      </motion.main>
    </div>
  )
}