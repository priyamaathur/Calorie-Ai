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
      }
    }

    checkUser()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        Welcome to Calorie AI Dashboard
      </h1>
    </div>
  )
}