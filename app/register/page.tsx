"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient" // 👈 Check your path
import { motion } from "framer-motion"
import { Activity, Sparkles, ArrowLeft, User, Mail, Lock, UserPlus, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // 1. Supabase Signup
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      })

      if (signUpError) throw signUpError

      if (data?.user) {
        // 2. Setting Role to 'user' so Dashboard shows everything
        localStorage.setItem("userRole", "user")

        // 3. Simple trick: Signup ke baad thoda wait karke redirect
        // Taaki Supabase session settle ho jaye
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh() // 👈 Page refresh taaki naya session detect ho
        }, 1000)
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.")
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#E1EFFF' }} className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* BACK BUTTON */}
      <button 
        onClick={() => router.push("/login")} 
        className="fixed top-8 left-8 z-[100] flex items-center gap-2 bg-white px-5 py-3 rounded-2xl text-slate-600 font-bold shadow-md border border-white hover:bg-slate-50 transition-all"
      >
        <ArrowLeft size={18} /> Back to Login
      </button>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl w-full max-w-[500px] text-center border border-white relative z-10"
      >
        {/* BRANDING */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#00D261] p-3 rounded-2xl text-white shadow-lg mb-4">
            <Activity size={32} strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calorie <span className="text-[#00D261] italic">Ai</span></h1>
        </div>

        <h2 className="text-xl font-black text-slate-800 mb-2 italic uppercase">Create Account</h2>
        <p className="text-slate-400 font-bold text-sm mb-6 uppercase tracking-widest flex items-center justify-center gap-2">
           <Sparkles size={14} className="text-[#00D261]" /> Start Your Journey
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div className="relative group">
             <User className="absolute left-5 top-5 text-slate-300" size={20} />
             <input 
               required
               type="text" 
               placeholder="Full Name" 
               onChange={(e) => setFormData({...formData, fullName: e.target.value})}
               className="w-full bg-[#F5F9FF] p-5 pl-14 rounded-2xl text-slate-700 focus:ring-2 focus:ring-[#00D261]/20 outline-none font-medium transition-all"
             />
          </div>

          <div className="relative group">
             <Mail className="absolute left-5 top-5 text-slate-300" size={20} />
             <input 
               required
               type="email" 
               placeholder="Email Address" 
               onChange={(e) => setFormData({...formData, email: e.target.value})}
               className="w-full bg-[#F5F9FF] p-5 pl-14 rounded-2xl text-slate-700 focus:ring-2 focus:ring-[#00D261]/20 outline-none font-medium transition-all"
             />
          </div>

          <div className="relative group">
             <Lock className="absolute left-5 top-5 text-slate-300" size={20} />
             <input 
               required
               type="password" 
               placeholder="Password (min 6 chars)" 
               onChange={(e) => setFormData({...formData, password: e.target.value})}
               className="w-full bg-[#F5F9FF] p-5 pl-14 rounded-2xl text-slate-700 focus:ring-2 focus:ring-[#00D261]/20 outline-none font-medium transition-all"
             />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1F2C] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl mt-4 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Sign Up Now</>}
          </button>
        </form>

        <p className="mt-8 text-slate-400 font-bold text-sm">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-[#00D261] hover:underline font-black">Login</button>
        </p>
      </motion.div>
    </div>
  )
}