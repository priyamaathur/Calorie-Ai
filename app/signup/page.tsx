"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserPlus, Mail, Lock } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    alert("Signup successful! Please log in.")
    router.push("/login")
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/50 bg-white/40 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <UserPlus size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">Join Us</h1>
          <p className="text-slate-500 mt-2">Start your health journey today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 px-10 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 px-10 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              type="password"
              placeholder="Min. 6 characters"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}