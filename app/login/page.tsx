"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Activity, Sparkles, UserCircle, Mail, Lock, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔵 REAL LOGIN (Supabase + old role logic safe)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    // 👇 OLD LOGIC PRESERVED
    localStorage.setItem("userRole", "user")

    setLoading(false)
    router.push("/dashboard")
  }

  // 🟡 Guest mode (UNCHANGED)
  const handleGuestEntry = () => {
    localStorage.setItem("userRole", "guest")
    router.push("/dashboard")
  }

  return (
    <div style={{ backgroundColor: '#E1EFFF' }} className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-white p-10 rounded-[3.5rem] shadow-2xl w-full max-w-[450px] text-center border border-white relative z-10"
      >
        
        {/* BRANDING */}
        <div className="flex flex-col items-center mb-8">
          <motion.div whileHover={{ rotate: 15 }} className="bg-[#00D261] p-3 rounded-2xl text-white mb-4 shadow-lg shadow-green-500/20">
            <Activity size={32} strokeWidth={3} />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Calorie <span className="text-[#00D261] italic">Ai</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2 italic flex items-center gap-2">
            <Sparkles size={12} className="text-[#00D261]" /> Your Personal Health Buddy
          </p>
        </div>

        <h2 className="text-xl font-black text-slate-800 mb-6 uppercase italic tracking-tighter">Welcome Back</h2>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-5 top-5 text-slate-300" size={18} />
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#F5F9FF] p-5 pl-14 rounded-2xl outline-none focus:ring-2 focus:ring-[#00D261]/20 transition-all font-medium text-slate-700"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-5 top-5 text-slate-300" size={18} />
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#F5F9FF] p-5 pl-14 rounded-2xl outline-none focus:ring-2 focus:ring-[#00D261]/20 transition-all font-medium text-slate-700"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1F2C] text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : "Login Now"} <ArrowRight size={18} />
          </button>
        </form>

        {/* GUEST & REGISTER OPTIONS */}
        <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
          <button 
            type="button"
            onClick={handleGuestEntry} 
            className="w-full text-slate-500 font-bold text-sm flex items-center justify-center gap-2 mx-auto py-2 hover:text-slate-900 transition-colors italic"
          >
            <UserCircle size={20} /> Continue as Guest
          </button>
          
          <p className="text-slate-400 font-bold text-sm">
            New here?{" "}
            <button 
              type="button"
              onClick={() => router.push("/register")} 
              className="text-[#00D261] font-black hover:underline underline-offset-4"
            >
              Create Account
            </button>
          </p>
        </div>
      </motion.div>

      {/* Background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-100/30 rounded-full blur-[120px]" />
    </div>
  )
}