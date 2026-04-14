"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
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
      // STEP 1: Signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      // STEP 2: Save Name (IMPORTANT FIX)
      if (data?.user) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            full_name: formData.fullName,
          },
        })

        if (updateError) throw updateError
      }

      // Keep your old logic safe
      localStorage.setItem("userRole", "user")

      alert("Signup successful! Please login.")
      router.push("/login")

    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#E1EFFF' }} className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      <button 
        onClick={() => router.push("/login")} 
        className="fixed top-8 left-8 flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div className="bg-white p-10 rounded-[3rem] shadow-xl w-full max-w-[450px] text-center">
        
        <div className="mb-6">
          <Activity size={32} className="mx-auto text-green-500" />
          <h1 className="text-2xl font-bold">Calorie Ai</h1>
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            required
            autoComplete="off"
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full p-4 border rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            required
            autoComplete="off"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-4 border rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            required
            autoComplete="new-password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-4 border rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={18}/> Sign Up</>}
          </button>
        </form>

        <p className="mt-4">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-green-600">
            Login
          </button>
        </p>
      </motion.div>
    </div>
  )
}