"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { User, Height, Weight, Activity, Save, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // States matching your Supabase Database columns exactly
  const [full_name, setFullName] = useState("")
  const [height_cm, setHeightCm] = useState("")
  const [weight_kg, setWeightKg] = useState("")
  const [gender, setGender] = useState("male")
  const [activity_level, setActivityLevel] = useState("low")

  // Load existing data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || "")
        setHeightCm(profile.height_cm || "")
        setWeightKg(profile.weight_kg || "")
        setGender(profile.gender || "male")
        setActivityLevel(profile.activity_level || "low")
      }
    }
    fetchProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // BMI Calculation Logic
    const h = parseFloat(height_cm) / 100
    const w = parseFloat(weight_kg)
    const bmiValue = parseFloat((w / (h * h)).toFixed(2))
    
    // Determine Category
    let cat = "Normal"
    if (bmiValue < 18.5) cat = "Underweight"
    else if (bmiValue >= 25) cat = "Overweight"

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("No user found")

      // Saving to Database (Removed updated_at to avoid schema errors)
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: full_name,
        height_cm: height_cm,
        weight_kg: weight_kg,
        gender: gender,
        activity_level: activity_level,
        bmi: bmiValue,
        // If 'category' column is still missing in DB, comment the line below
        // category: cat, 
      })

      if (error) throw error

      setMessage("Profile Updated Successfully! 🚀")
      
      // Redirect to Dashboard after success
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)

    } catch (error: any) {
      console.error(error)
      alert("Error saving: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10 p-4 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push("/dashboard")} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Health Profile</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                value={full_name} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-12 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Enter your name" 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Height */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Height (cm)</label>
              <input 
                type="number" 
                value={height_cm} 
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="e.g. 170" 
                required
              />
            </div>
            {/* Weight */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Weight (kg)</label>
              <input 
                type="number" 
                value={weight_kg} 
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="e.g. 65" 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 outline-none focus:ring-2 focus:ring-green-500/20 appearance-none cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Activity Level */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Activity Level</label>
              <select 
                value={activity_level} 
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 outline-none focus:ring-2 focus:ring-green-500/20 appearance-none cursor-pointer"
              >
                <option value="low">Low (Sedentary)</option>
                <option value="moderate">Moderate (Active)</option>
                <option value="high">High (Athlete)</option>
              </select>
            </div>
          </div>
        </div>

        {message && (
          <div className="flex items-center gap-2 text-green-600 font-bold justify-center animate-bounce">
            <CheckCircle2 size={20} /> {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <Save size={24} />
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  )
}