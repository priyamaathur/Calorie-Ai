"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function DietPage() {

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

const getDiet = () => {

if(category === "Underweight"){
return [
"Eat high protein foods (eggs, paneer)",
"Increase calorie intake",
"Add healthy fats (nuts, milk)",
"Eat 5 meals a day"
]
}

if(category === "Overweight"){
return [
"Avoid fried food",
"Reduce sugar intake",
"Eat more vegetables",
"Drink more water"
]
}

return [
"Balanced diet",
"Include protein, carbs, fats",
"Eat fruits daily",
"Stay hydrated"
]
}

const diet = getDiet()

return (
<div className="min-h-screen bg-black text-white p-6">

<div className="flex justify-between mb-6">
<h1 className="text-3xl font-bold">Diet Plan</h1>

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
{diet.map((item,i)=>(
<li key={i} className="bg-gray-700 p-2 rounded">
{item}
</li>
))}
</ul>

</div>

</div>
)
}