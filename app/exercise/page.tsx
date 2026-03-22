"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { 
  ArrowLeft, Dumbbell, Timer, Flame, 
  Zap, Wind, Activity, ChevronRight 
} from "lucide-react"

export default function ExercisePage() {
  const router = useRouter()
  const [lastCalories, setLastCalories] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get History from LocalStorage to find last meal calories
      const history = JSON.parse(localStorage.getItem("history") || "[]")
      if (history.length > 0) {
        setLastCalories(history[0].nutrition?.calories || 0)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Exercise Data based on Calorie Intake Levels
  const getExerciseSuggestions = () => {
    if (lastCalories === 0) {
      return {
        level: "Maintenance",
        desc: "No recent heavy meals detected. Stay active!",
        list: [
          { title: "Brisk Walking", time: "20 min", burn: "100 kcal", icon: <Wind size={20}/>, color: "bg-blue-50 text-blue-600" },
          { title: "Stretching", time: "10 min", burn: "40 kcal", icon: <Activity size={20}/>, color: "bg-cyan-50 text-cyan-600" }
        ]
      }
    }

    if (lastCalories < 300) {
      return {
        level: "Light Burn",
        desc: `You consumed ${lastCalories} kcal. A quick session will fix this!`,
        list: [
          { title: "Slow Jogging", time: "15 min", burn: "120 kcal", icon: <Zap size={20}/>, color: "bg-green-50 text-green-600" },
          { title: "Yoga Flow", time: "20 min", burn: "80 kcal", icon: <Wind size={20}/>, color: "bg-emerald-50 text-emerald-600" },
          { title: "Cycling", time: "10 min", burn: "100 kcal", icon: <Activity size={20}/>, color: "bg-teal-50 text-teal-600" }
        ]
      }
    }

    if (lastCalories >= 300 && lastCalories < 600) {
      return {
        level: "Moderate Burn",
        desc: `${lastCalories} kcal is a bit high. Let's get that heart rate up!`,
        list: [
          { title: "Running", time: "25 min", burn: "250 kcal", icon: <Flame size={20}/>, color: "bg-orange-50 text-orange-600" },
          { title: "Jumping Jacks", time: "10 min", burn: "150 kcal", icon: <Zap size={20}/>, color: "bg-yellow-50 text-yellow-600" },
          { title: "Squats & Lunges", time: "15 min", burn: "180 kcal", icon: <Dumbbell size={20}/>, color: "bg-amber-50 text-amber-600" }
        ]
      }
    }

    return {
      level: "Intensive Burn",
      desc: `Heavy meal alert (${lastCalories} kcal)! Time for a serious workout.`,
      list: [
        { title: "HIIT Workout", time: "30 min", burn: "450 kcal", icon: <Flame size={20}/>, color: "bg-red-50 text-red-600" },
        { title: "Stair Climbing", time: "15 min", burn: "200 kcal", icon: <Activity size={20}/>, color: "bg-rose-50 text-rose-600" },
        { title: "Burpees", time: "10 min", burn: "150 kcal", icon: <Zap size={20}/>, color: "bg-pink-50 text-pink-600" },
        { title: "Plank Hold", time: "5 min", burn: "50 kcal", icon: <Dumbbell size={20}/>, color: "bg-purple-50 text-purple-600" }
      ]
    }
  }

  const suggestions = getExerciseSuggestions()

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">LOADING WORKOUTS...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Workouts</h1>
          <p className="text-slate-500 font-medium">Burn off those extra calories effectively</p>
        </div>
      </div>

      {/* Dynamic Status Card */}
      <div className={`rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden transition-all duration-500 ${lastCalories > 500 ? 'bg-red-600' : 'bg-slate-900'}`}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-white/60 font-black uppercase tracking-[0.2em] text-xs">Current Level: {suggestions.level}</p>
            <h2 className="text-3xl font-black leading-tight">{suggestions.desc}</h2>
          </div>
          <div className="p-6 bg-white/20 rounded-full backdrop-blur-xl border border-white/30 animate-pulse">
             <Flame size={40} className="text-orange-400" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.list.map((ex: any, i: number) => (
          <div key={i} className="glass-card group p-6 rounded-[2.2rem] border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between shadow-sm hover:shadow-xl cursor-pointer">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${ex.color}`}>
                {ex.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{ex.title}</h3>
                <div className="flex items-center gap-3">
                   <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Timer size={12}/> {ex.time}</span>
                   <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase tracking-widest"><Flame size={12}/> {ex.burn}</span>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Motivation Section */}
      <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center italic text-slate-400 font-medium">
        "Consistency is more important than perfection. Keep moving!"
      </div>

    </div>
  )
}