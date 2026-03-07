"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const router = useRouter()

useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push("/login")
      return
    }

    const userId = data.user.id

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single()

    if (!profile) {
      router.push("/profile")
    }
  }

  checkUser()
}, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }
return (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6">

    <h1 className="text-3xl font-bold">
      Calorie AI Dashboard
    </h1>

    <div className="flex flex-col gap-3 w-60">

      <button
        onClick={() => router.push("/profile")}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Edit Profile
      </button>

      <button
        onClick={() => router.push("/scan")}
        className="bg-purple-500 text-white p-2 rounded"
      >
        Scan Food (AI)
      </button>

      <button
        onClick={() => router.push("/label")}
        className="bg-yellow-500 text-white p-2 rounded"
      >
        Scan Food Label
      </button>

      <button
        onClick={() => router.push("/graph")}
        className="bg-green-500 text-white p-2 rounded"
      >
        Calorie Graph
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>

    </div>
  </div>
)
}