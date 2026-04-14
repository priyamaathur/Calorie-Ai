"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, Flame, Trophy, Play, Youtube, 
  Timer, Activity, Dumbbell, Zap, Wind 
} from "lucide-react"

// 10 YouTube Videos Data
const workoutVideos = [
  { id: "ml6cT4AZdqI", title: "30 Min HIIT Cardio", burn: "300 kcal", type: "Cardio", channel: "Growwithjo" },
  { id: "L_xrDAtykMI", title: "Intense Ab Workout", burn: "150 kcal", type: "Strength", channel: "Pamela Reif" },
  { id: "sTANio_2E0Q", title: "Full Body Yoga", burn: "100 kcal", type: "Yoga", channel: "Yoga With Adriene" },
  { id: "gC_L9qAHVJ8", title: "15 Min Fat Burn", burn: "200 kcal", type: "Cardio", channel: "MadFit" },
  { id: "2MoGxae-zyo", title: "Upper Body Strength", burn: "250 kcal", type: "Strength", channel: "Caroline Girvan" },
  { id: "Jkvv3_vT6j8", title: "Stress Relief Yoga", burn: "80 kcal", type: "Yoga", channel: "Yoga With Kassandra" },
  { id: "M0uO8X3_tEA", title: "10 Min Morning HIIT", burn: "120 kcal", type: "Cardio", channel: "The Body Coach" },
  { id: "IFQmOas_6W8", title: "Leg Day Workout", burn: "280 kcal", type: "Strength", channel: "Whitney Simmons" },
  { id: "4vTJHUDB5ak", title: "Power Yoga Flow", burn: "180 kcal", type: "Yoga", channel: "Breathe and Flow" },
  { id: "6TmViH_O2pQ", title: "Full Body Cardio", burn: "350 kcal", type: "Cardio", channel: "Emi Wong" },
];

export default function ExercisePage() {
  const router = useRouter()
  const [lastCalories, setLastCalories] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history") || "[]")
    if (history.length > 0) {
      setLastCalories(history[0].nutrition?.calories || 0)
    }
    setLoading(false)
  }, [])

  // Smart Logic for Status Card
  const getStatus = () => {
    if (lastCalories === 0) return { level: "Maintenance", color: "bg-slate-900", desc: "No heavy meals detected. Stay active!" }
    if (lastCalories < 300) return { level: "Light Burn", color: "bg-blue-600", desc: `Just ${lastCalories}kcal? A quick walk is enough!` }
    if (lastCalories < 600) return { level: "Moderate Burn", color: "bg-orange-600", desc: `${lastCalories}kcal consumed. Let's sweat a bit!` }
    return { level: "Intensive Burn", color: "bg-red-600", desc: "HEAVY MEAL ALERT! Time for serious HIIT." }
  }

  const status = getStatus()

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">LOADING AI WORKOUTS...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 pb-20">
      
      {/* 1. Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/dashboard")} className="p-4 bg-white shadow-md rounded-2xl hover:bg-slate-50 transition-all active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Workouts</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">AI-Powered Training Hub</p>
          </div>
        </div>
        <div className="hidden md:flex bg-slate-100 p-2 rounded-2xl gap-2 font-black italic text-[11px] uppercase">
            <span className="px-4 py-2 bg-white rounded-xl shadow-sm">Daily Goal: 500 kcal</span>
        </div>
      </div>

      {/* 2. PREMIUM AI STATUS CARD (Dynamic) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${status.color} rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden`}
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                Level: {status.level}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight italic">
              {status.desc}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 text-center">
                <p className="text-[10px] font-black uppercase opacity-60 mb-1">Last Meal</p>
                <p className="text-3xl font-black italic">{lastCalories} <span className="text-sm font-normal">kcal</span></p>
             </div>
             <motion.div 
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="p-8 bg-white text-slate-900 rounded-full shadow-2xl shadow-white/20"
             >
                <Flame size={40} fill="currentColor" />
             </motion.div>
          </div>
        </div>
        {/* Background Animation Layer */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </motion.div>

      {/* 3. WORKOUT GRID (10 Videos) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">Recommended for You</h3>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b-2 border-blue-500 pb-1 cursor-pointer">Explore All Categories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {workoutVideos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
              className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative h-36 w-full overflow-hidden">
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                     <Play fill="white" className="text-white" size={20} />
                   </div>
                </div>
                <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full shadow-lg">
                  <span className="text-[8px] font-black uppercase text-slate-900">{video.type}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="font-black italic text-[11px] leading-tight line-clamp-2 uppercase h-8 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h4>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1">
                    <Zap size={12} className="text-orange-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase italic">{video.burn}</span>
                  </div>
                  <span className="text-[8px] font-black text-blue-500 italic uppercase">{video.channel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Footer Inspiration */}
      <div className="p-10 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
         <p className="italic text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
           "Consistency is more important than perfection. Keep moving, Priya!"
         </p>
      </div>

    </div>
  )
}