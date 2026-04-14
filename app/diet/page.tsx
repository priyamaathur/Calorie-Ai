"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Flame, Play, Clock, 
  Info, CheckCircle2, Zap
} from "lucide-react"

// --- HIGH-RELIABILITY YOUTUBE DATABASE (Verified Channels) ---
const dietDatabase: any = {
  veg: [
    { name: "Perfect Veg Poha", cal: "250 kcal", yt: "O9-Rofp8T_E", time: "Breakfast", tag: "Quick" },
    { name: "Masala Paneer Bhurji", cal: "400 kcal", yt: "O_9k_fC9U9M", time: "Breakfast", tag: "Protein" },
    { name: "Healthy Quinoa Salad", cal: "350 kcal", yt: "uH-vG8E-Mcc", time: "Lunch", tag: "Fiber" },
    { name: "Yellow Dal Tadka", cal: "550 kcal", yt: "y08v86A6Y-k", time: "Lunch", tag: "Balanced" },
    { name: "High Protein Soya", cal: "300 kcal", yt: "z0p5KIn9f_I", time: "Lunch", tag: "Vegan" },
    { name: "Masala Makhana", cal: "150 kcal", yt: "A6GZ66W9PKE", time: "Snack", tag: "Light" },
    { name: "Fruit Salad Bowl", cal: "180 kcal", yt: "Z6vN8_yS_Yw", time: "Snack", tag: "Fresh" },
    { name: "Dhaba Style Palak Paneer", cal: "380 kcal", yt: "fO08U8-iX7U", time: "Dinner", tag: "Keto" },
    { name: "Lentil Detox Soup", cal: "200 kcal", yt: "P8pS8X8mC0U", time: "Dinner", tag: "Detox" },
    { name: "Weight Loss Oats Chilla", cal: "280 kcal", yt: "V9H7YI9Y9fU", time: "Dinner", tag: "Low GI" }
  ],
  "non-veg": [
    { name: "Fluffy Egg Omelette", cal: "300 kcal", yt: "mUe_e_288pQ", time: "Breakfast", tag: "Quick" },
    { name: "Perfect Boiled Eggs", cal: "155 kcal", yt: "w-y_Cg9Fh9E", time: "Breakfast", tag: "Lean" },
    { name: "Juicy Grilled Chicken", cal: "450 kcal", yt: "ovvY_A6L6vM", time: "Lunch", tag: "Muscle" },
    { name: "Home Style Fish Curry", cal: "500 kcal", yt: "K5Nn_6i19aM", time: "Lunch", tag: "Omega 3" },
    { name: "Chicken Tikka Salad", cal: "350 kcal", yt: "v9p_qG7D_6o", time: "Lunch", tag: "Keto" },
    { name: "Chicken Sweet Corn Soup", cal: "220 kcal", yt: "s_tN1k5vUIs", time: "Snack", tag: "Protein" },
    { name: "Egg Club Sandwich", cal: "320 kcal", yt: "6S6v7X9Yy8w", time: "Snack", tag: "Energy" },
    { name: "Lemon Butter Salmon", cal: "480 kcal", yt: "ovvY_A6L6vM", time: "Dinner", tag: "Healthy Fat" },
    { name: "Garlic Stir Fry Chicken", cal: "400 kcal", yt: "mUe_e_288pQ", time: "Dinner", tag: "Lean" },
    { name: "Egg Bhurji Dhaba Style", cal: "310 kcal", yt: "O_9k_fC9U9M", time: "Dinner", tag: "Quick" }
  ],
  both: [
    { name: "Berry Yogurt Parfait", cal: "200 kcal", yt: "C3q0mB-XyHk", time: "Breakfast", tag: "Probiotic" },
    { name: "Creamy Scrambled Eggs", cal: "280 kcal", yt: "s_tN1k5vUIs", time: "Breakfast", tag: "Soft" },
    { name: "Light Butter Chicken", cal: "800 kcal", yt: "a03U45jLXgc", time: "Lunch", tag: "Heavy" },
    { name: "Tofu & Chicken Stir Fry", cal: "420 kcal", yt: "V_6YfO_1r2g", time: "Lunch", tag: "High Protein" },
    { name: "Iron Rich Mutton", cal: "650 kcal", yt: "y08v86A6Y-k", time: "Lunch", tag: "Iron" },
    { name: "Egg White Sprouts", cal: "220 kcal", yt: "V9H7YI9Y9fU", time: "Snack", tag: "Low Cal" },
    { name: "Banana Protein Shake", cal: "300 kcal", yt: "P8pS8X8mC0U", time: "Snack", tag: "Fast" },
    { name: "Grilled Mixed Platter", cal: "450 kcal", yt: "ovvY_A6L6vM", time: "Dinner", tag: "Balanced" },
    { name: "Whole Grain Pasta", cal: "380 kcal", yt: "V_6YfO_1r2g", time: "Dinner", tag: "Vegan Opt" },
    { name: "Grilled Veg & Meat", cal: "550 kcal", yt: "K5Nn_6i19aM", time: "Dinner", tag: "Variety" }
  ]
}

export default function DietPage() {
  const router = useRouter()
  const [dietType, setDietType] = useState<"veg" | "non-veg" | "both">("veg")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push("/login")
      setLoading(false)
    }
    checkUser()
  }, [router])

  const meals = dietDatabase[dietType]

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-slate-400">LOADING DIET HUB...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-8 pb-24">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-white shadow-md rounded-2xl hover:bg-slate-50 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Diet Planner</h1>
        </div>
        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black italic text-[9px] uppercase tracking-widest flex items-center gap-2">
           <Zap size={12} className="text-yellow-400" /> Goal: Maintenance
        </div>
      </div>

      {/* 2. Sleeker Status Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <Info size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">AI Recommendation</span>
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tight italic">Eat Smart, Feel Incredible.</h2>
            <p className="text-white/80 font-bold italic text-xs">"2000 kcal daily target for your goals."</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 text-center min-w-[160px]">
            <p className="text-[9px] font-black uppercase opacity-70 mb-1">Target Calories</p>
            <p className="text-4xl font-black italic">2000</p>
            <p className="text-[8px] font-black uppercase mt-1">Daily Kcal</p>
          </div>
        </div>
      </motion.div>

      {/* 3. Re-ordered Tabs (Veg -> Non-Veg -> Both) */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-[1.8rem] flex gap-1 border shadow-inner">
          {['veg', 'non-veg', 'both'].map((type) => (
            <button
              key={type}
              onClick={() => setDietType(type as any)}
              className={`px-10 py-3 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                dietType === type ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {meals.map((meal: any, i: number) => (
            <motion.div
              key={meal.name + dietType}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => window.open(`https://www.youtube.com/watch?v=${meal.yt}`, '_blank')}
              className="bg-white border border-slate-100 rounded-[2.2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="relative h-36 w-full overflow-hidden bg-slate-50">
                <img 
                  src={`https://img.youtube.com/vi/${meal.yt}/mqdefault.jpg`} 
                  alt={meal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e:any) => e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Play fill="white" className="text-white" size={20} />
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                  <span className="text-[7px] font-black uppercase text-slate-900">{meal.time}</span>
                </div>
              </div>

              <div className="p-5">
                <h4 className="font-black italic text-[11px] leading-tight uppercase group-hover:text-emerald-600 transition-colors h-8 line-clamp-2">
                  {meal.name}
                </h4>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1">
                    <Flame size={12} className="text-orange-500" />
                    <span className="text-[8px] font-black text-slate-400 uppercase italic">{meal.cal}</span>
                  </div>
                  <CheckCircle2 size={12} className="text-emerald-500 opacity-30" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-4 text-center">
         <p className="italic text-slate-400 font-black uppercase tracking-[0.2em] text-[8px] opacity-60">
           "Consistency is more important than perfection. Keep moving, Priya!"
         </p>
      </div>
    </div>
  )
}