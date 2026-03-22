"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function ExercisePage() {

const router = useRouter()
const [category,setCategory] = useState("")

useEffect(() => {

const load = async () => {

const { data } = await supabase.auth.getUser()

if(!data.user){
router.push("/login")
return
}

const { data: profile } = await supabase
.from("profiles")
.select("category")
.eq("id", data.user.id)
.single()

if(profile){
setCategory(profile.category)
}
}

load()

}, [])

const getExercise = () => {

if(category === "Underweight"){
return [
"Light strength training (20 min)",
"Yoga (15 min)",
"Short walk (20 min)"
]
}

if(category === "Overweight"){
return [
"Running (20–30 min)",
"Brisk walking (40 min)",
"Cycling (30 min)",
"Jump rope (15 min)"
]
}

return [
"Jogging (20 min)",
"Stretching (10 min)",
"Light gym workout (20 min)"
]
}

const exercises = getExercise()

return (
<div className="min-h-screen bg-black text-white p-6">

<div className="flex justify-between mb-6">
<h1 className="text-3xl font-bold">Exercise Plan</h1>

<button
onClick={() => router.push("/dashboard")}
className="bg-gray-700 px-4 py-2 rounded"
>
Back
</button>
</div>

<div className="bg-gray-800 p-6 rounded-xl">

<p className="mb-4 text-lg">
Your Category: <strong>{category}</strong>
</p>

<ul className="space-y-2">
{exercises.map((item,i)=>(
<li key={i} className="bg-gray-700 p-2 rounded">
{item}
</li>
))}
</ul>

</div>

</div>
)
}