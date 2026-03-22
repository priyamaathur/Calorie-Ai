"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Agar login nahi hai toh Login page par bhejo
        router.push("/login")
      } else {
        // Agar login mil gaya, toh hamesha DASHBOARD par bhejo
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse">Loading CalorieAI...</p>
      </div>
    </div>
  )
}