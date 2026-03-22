"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const nutritionMap: any = {
pizza: { calories: 266, protein: 11, carbs: 33 },
burger: { calories: 295, protein: 17, carbs: 30 },
fries: { calories: 312, protein: 3.4, carbs: 41 },
sandwich: { calories: 250, protein: 12, carbs: 30 },
pasta: { calories: 221, protein: 8, carbs: 43 },
noodles: { calories: 190, protein: 7, carbs: 27 },
biryani: { calories: 350, protein: 12, carbs: 40 },
rice: { calories: 130, protein: 2.7, carbs: 28 },
chicken: { calories: 239, protein: 27, carbs: 0 },
paneer: { calories: 265, protein: 18, carbs: 6 },
dosa: { calories: 168, protein: 4, carbs: 30 },
idli: { calories: 39, protein: 2, carbs: 8 },
samosa: { calories: 262, protein: 4, carbs: 32 },
paratha: { calories: 300, protein: 6, carbs: 45 },
cake: { calories: 257, protein: 3.6, carbs: 38 },
donut: { calories: 452, protein: 4.9, carbs: 51 },
icecream: { calories: 207, protein: 3.5, carbs: 24 },
apple: { calories: 52, protein: 0.3, carbs: 14 },
banana: { calories: 89, protein: 1.1, carbs: 23 }
}

export default function ScanPage() {

const router = useRouter()

const [image,setImage] = useState<File | null>(null)
const [preview,setPreview] = useState<string | null>(null)
const [result,setResult] = useState<any>(null)
const [loading,setLoading] = useState(false)

const [foodType,setFoodType] = useState("")

// PROFILE
const [height,setHeight] = useState("")
const [weight,setWeight] = useState("")
const [bmi,setBmi] = useState<number | null>(null)
const [category,setCategory] = useState("")
const [gender,setGender] = useState("")
const [activity,setActivity] = useState("")

const [history,setHistory] = useState<any[]>([])

// GRAPH
const chartData = history.map((item, i) => ({
name: `#${i+1}`,
calories: item.nutrition?.calories || 0
})).reverse()

// BMI
const calculateBMI = () => {
const h = parseFloat(height)/100
const w = parseFloat(weight)
const bmiValue = w/(h*h)

setBmi(bmiValue)

if(bmiValue < 18.5) setCategory("Underweight")
else if(bmiValue < 25) setCategory("Normal")
else setCategory("Overweight")

localStorage.setItem("profile", JSON.stringify({
height,weight,bmi:bmiValue,category,gender,activity
}))
}

// LOAD PROFILE
useEffect(()=>{
const saved = localStorage.getItem("profile")
if(saved){
const p = JSON.parse(saved)
setHeight(p.height||"")
setWeight(p.weight||"")
setBmi(p.bmi||null)
setCategory(p.category||"")
setGender(p.gender||"")
setActivity(p.activity||"")
}
},[])

// LOAD HISTORY
useEffect(()=>{
const h = JSON.parse(localStorage.getItem("history")||"[]")
setHistory(h)
},[])

// CAL LIMIT
const getCalorieLimit = () => {
if(!gender || !activity || !category) return null

let base=0

if(gender==="male"){
if(activity==="low") base=2200
else if(activity==="moderate") base=2500
else base=2800
}else{
if(activity==="low") base=1800
else if(activity==="moderate") base=2000
else base=2200
}

if(category==="Underweight") base+=300
if(category==="Overweight") base-=300

return Math.round(base/3)
}

// EXERCISE
const getExercise = (cal:number,limit:number)=>{

let exercises:string[] = []

// BMI BASED
if(category === "Underweight"){
exercises.push(
"Light strength training (20 min)",
"Yoga (15 min)",
"Resistance band workout"
)
}

if(category === "Normal"){
exercises.push(
"Jogging (20 min)",
"Stretching (10 min)",
"Light gym workout"
)
}

if(category === "Overweight"){
exercises.push(
"Running (25 min)",
"Brisk walking (40 min)",
"Cycling (30 min)",
"Jump rope (15 min)"
)
}

// ACTIVITY BASED
if(activity === "low"){
exercises.push(
"Daily walking (30 min)",
"Basic mobility exercises"
)
}

if(activity === "moderate"){
exercises.push(
"Bodyweight training",
"Core exercises"
)
}

if(activity === "high"){
exercises.push(
"HIIT workout (15 min)",
"Advanced strength training"
)
}

// CALORIE BASED
const extra = cal - limit

if(extra > 0){
exercises.push(
`🔥 Burn extra: ${Math.ceil(extra/10)} min running`,
`🚶 Walk: ${Math.ceil(extra/5)} min`
)
}

return exercises
}

// IMAGE
const handleImageChange = (e:any)=>{
const file=e.target.files?.[0]
if(!file) return
setImage(file)
setPreview(URL.createObjectURL(file))
setResult(null)
}

// UPLOAD
const handleUpload = async ()=>{
if(!image){ alert("Upload image"); return }

setLoading(true)

const formData=new FormData()
formData.append("image",image)

try{
const res=await fetch("/api/food-scan",{method:"POST",body:formData})
const data=await res.json()

if(data.food && data.confidence>0.6){

let nutrition=nutritionMap[data.food.toLowerCase()]

if(!nutrition){
for(const key in nutritionMap){
if(data.food.toLowerCase().includes(key)){
nutrition=nutritionMap[key]
break
}
}
}

// 🔥 HOME FOOD ADJUST
if(nutrition && foodType==="home"){
nutrition = {...nutrition, calories: Math.round(nutrition.calories*0.8)}
}

const limit=getCalorieLimit()

let warning=""
let exercise=""

if(nutrition && limit){

const ratio = nutrition.calories / limit

if(ratio > 1){
warning = "❌ High calorie — avoid"
}else if(ratio > 0.7){
warning = "⚠️ Moderate — eat carefully"
}else{
warning = "✅ Safe"
}

exercise=getExercise(nutrition.calories,limit)
}

const finalRes={ food:data.food,confidence:data.confidence,nutrition,warning,exercise }

setResult(finalRes)

// SAVE HISTORY
const prev=JSON.parse(localStorage.getItem("history")||"[]")
const updated=[finalRes,...prev].slice(0,5)
localStorage.setItem("history",JSON.stringify(updated))
setHistory(updated)

}else{
setResult("no-food")
}

}catch{
alert("Error")
}finally{
setLoading(false)
}
}

return(
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-black flex flex-col items-center gap-6 p-6">

<button onClick={()=>router.push("/dashboard")} className="bg-gray-700 px-3 py-1 rounded">
Back
</button>

<h1 className="text-3xl font-bold">Food Scan</h1>

{/* PROFILE */}
<div className="bg-white shadow-lg border rounded-2xl p-4 w-80">
<input placeholder="Height" value={height} onChange={(e)=>setHeight(e.target.value)} className="w-full p-2 mb-2 text-black"/>
<input placeholder="Weight" value={weight} onChange={(e)=>setWeight(e.target.value)} className="w-full p-2 mb-2 text-black"/>

<select value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full p-2 mb-2 text-black">
<option value="">Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>
</select>

<select value={activity} onChange={(e)=>setActivity(e.target.value)} className="w-full p-2 mb-2 text-black">
<option value="">Activity</option>
<option value="low">Low</option>
<option value="moderate">Moderate</option>
<option value="high">High</option>
</select>

<button onClick={calculateBMI} className="bg-blue-500 px-3 py-1">Calculate BMI</button>

{bmi && <p>BMI: {bmi.toFixed(2)} ({category})</p>}
</div>

{/* FOOD TYPE */}
<select value={foodType} onChange={(e)=>setFoodType(e.target.value)} className="p-2 rounded text-black">
<option value="">Food Type</option>
<option value="home">Home Made</option>
<option value="outside">Restaurant</option>
</select>

<input type="file" onChange={handleImageChange}/>
{preview && <img src={preview} className="w-60"/>}

<button onClick={handleUpload} className="bg-green-500 px-4 py-2 text-white">
{loading?"Analyzing...":"Scan"}
</button>

{/* RESULT */}
{result && result!=="no-food" && (
<div className="bg-white shadow-xl border rounded-2xl p-4 w-80">
<p>{result.food}</p>
<p>{(result.confidence*100).toFixed(1)}%</p>

{result.nutrition && (
<div className="space-y-3">

<p className="text-lg font-semibold">
🔥 {result.nutrition.calories} kcal
</p>

<p className={
result.warning.includes("High") ? "text-red-400 font-semibold" :
result.warning.includes("Moderate") ? "text-yellow-400 font-semibold" :
"text-green-400 font-semibold"
}>
{result.warning}
</p>
<div className="bg-green-50 border border-green-200 p-3 rounded-xl">
<p className="text-sm text-gray-300 mb-1">Exercise Plan</p>

{result.exercise.map((ex:string,i:number)=>(
<p key={i} className="text-green-400 text-sm">• {ex}</p>
))}
</div>

</div>
)}
</div>
)}

{/* HISTORY */}
{history.length>0 && (
<div className="bg-white shadow-xl border rounded-2xl p-4 w-80">
<h2>History</h2>
{history.map((h,i)=>(
<p key={i}>{h.food} - {h.nutrition?.calories} kcal</p>
))}
</div>
)}

{/* GRAPH */}
{chartData.length>0 && (
<div className="bg-white shadow-md rounded-2xl p-4 w-80">
<h2>Graph</h2>
<ResponsiveContainer width="100%" height={200}>
<LineChart data={chartData}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="calories" stroke="#00ff99"/>
</LineChart>
</ResponsiveContainer>
</div>
)}

</div>
)
}