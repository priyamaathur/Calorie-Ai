"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePage() {

const router = useRouter()

const [name,setName] = useState("")
const [gender,setGender] = useState("")
const [height,setHeight] = useState("")
const [weight,setWeight] = useState("")
const [bmi,setBmi] = useState("")
const [category,setCategory] = useState("")

useEffect(() => {
const loadProfile = async () => {
const { data: userData } = await supabase.auth.getUser()

if (!userData.user) {
router.push("/login")
return
}

const userId = userData.user.id

const { data } = await supabase
.from("profiles")
.select("*")
.eq("id", userId)
.single()

if (data) {
setName(data.full_name ?? "")
setGender(data.gender ?? "")
setHeight(data.height_cm?.toString() ?? "")
setWeight(data.weight_kg?.toString() ?? "")
setBmi(data.bmi?.toString() ?? "")
setCategory(data.category ?? "")
}
}

loadProfile()
}, [])

const calculateBMI = () => {

const h = parseFloat(height) / 100
const w = parseFloat(weight)

if (!h || !w) return

const bmiValue = (w / (h * h)).toFixed(2)
setBmi(bmiValue)

let cat = ""

if (parseFloat(bmiValue) < 18.5) cat = "Underweight"
else if (parseFloat(bmiValue) < 25) cat = "Normal"
else cat = "Overweight"

setCategory(cat)
}

const saveProfile = async () => {

const { data: userData } = await supabase.auth.getUser()

if (!userData.user) {
alert("User not logged in")
return
}

const userId = userData.user.id

const { error } = await supabase
.from("profiles")
.upsert({
id: userId,
full_name: name,
gender: gender,
height_cm: height,
weight_kg: weight,
bmi: bmi,
category: category
})

if (error) {
alert(error.message)
return
}

alert("Profile saved successfully")
router.push("/dashboard")
}

return (
<div className="min-h-screen bg-black text-white flex items-center justify-center">

<div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">

{/* HEADER */}
<div className="flex justify-between items-center">
<h1 className="text-2xl font-bold">Profile</h1>

<button
onClick={() => router.push("/dashboard")}
className="bg-gray-700 px-3 py-1 rounded"
>
Back
</button>
</div>

{/* INPUTS */}
<input
className="w-full p-2 rounded text-black"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<select
className="w-full p-2 rounded text-black"
value={gender}
onChange={(e)=>setGender(e.target.value)}
>
<option value="">Select Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>
</select>

<input
className="w-full p-2 rounded text-black"
placeholder="Height (cm)"
value={height}
onChange={(e)=>setHeight(e.target.value)}
/>

<input
className="w-full p-2 rounded text-black"
placeholder="Weight (kg)"
value={weight}
onChange={(e)=>setWeight(e.target.value)}
/>

<button
onClick={calculateBMI}
className="bg-blue-500 w-full p-2 rounded"
>
Calculate BMI
</button>

<input
className="w-full p-2 rounded text-black"
value={bmi}
placeholder="BMI"
readOnly
/>

{category && (
<p className="text-center text-green-400">
Category: {category}
</p>
)}

<button
onClick={saveProfile}
className="bg-green-600 w-full p-2 rounded"
>
Save Profile
</button>

</div>

</div>
)
}