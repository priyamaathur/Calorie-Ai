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
<div className="min-h-screen bg-black text-white p-6">

{/* HEADER */}
<div className="flex justify-between items-center mb-6">
<h1 className="text-3xl font-bold">Dashboard</h1>

<button
onClick={handleLogout}
className="bg-red-500 px-4 py-2 rounded"
>
Logout
</button>
</div>

{/* GRID CARDS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* Scan Food */}
<div
onClick={() => router.push("/scan")}
className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700"
>
<h2 className="text-xl font-semibold">🍔 Scan Food</h2>
<p className="text-gray-400">Analyze food & calories</p>
</div>

{/* Profile */}
<div
onClick={() => router.push("/profile")}
className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700"
>
<h2 className="text-xl font-semibold">👤 Profile</h2>
<p className="text-gray-400">View & update your health data</p>
</div>

{/* Diet */}
<div
onClick={() => router.push("/diet")}
className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700"
>
<h2 className="text-xl font-semibold">🥗 Diet Plan</h2>
<p className="text-gray-400">Personalized diet suggestions</p>
</div>

{/* Exercise */}
<div
onClick={() => router.push("/exercise")}
className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700"
>
<h2 className="text-xl font-semibold">🏃 Exercise</h2>
<p className="text-gray-400">Workout recommendations</p>
</div>

</div>

</div>
)
}