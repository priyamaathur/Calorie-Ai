"use client"

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("SUPABASE KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert("Signup successful!")
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-8 border rounded-lg w-80">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>

        <input
          className="border p-2 w-full mb-3"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="bg-black text-white w-full p-2 rounded"
        >
          Create Account
        </button>
      </div>
    </div>
  )
}