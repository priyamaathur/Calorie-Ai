"use client"

import { useState } from "react"

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

const [image,setImage] = useState<File | null>(null)
const [preview,setPreview] = useState<string | null>(null)
const [result,setResult] = useState<any>(null)
const [loading,setLoading] = useState(false)

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0]
if(!file) return

setImage(file)
setPreview(URL.createObjectURL(file))
setResult(null)
}

const handleUpload = async () => {

if(!image){
alert("Please upload an image first")
return
}

setLoading(true)

const formData = new FormData()
formData.append("image",image)

try{

const res = await fetch("/api/food-scan",{
method:"POST",
body:formData
})

const data = await res.json()

if(data.food && data.confidence){

if(data.confidence > 0.6){

const foodName = data.food.toLowerCase()

let nutrition = nutritionMap[foodName]

// fallback matching
if(!nutrition){
if(foodName.includes("pizza")) nutrition = nutritionMap["pizza"]
else if(foodName.includes("burger")) nutrition = nutritionMap["burger"]
else if(foodName.includes("sandwich")) nutrition = nutritionMap["sandwich"]
else if(foodName.includes("rice")) nutrition = nutritionMap["rice"]
else if(foodName.includes("chicken")) nutrition = nutritionMap["chicken"]
}

setResult({
food: data.food,
confidence: data.confidence,
nutrition: nutrition || null
})

}else{
setResult("no-food")
}

}else{
setResult("no-food")
}

}catch(err){
alert("Something went wrong. Try again.")
}finally{
setLoading(false)
}

}

return(

<div className="flex min-h-screen flex-col items-center justify-center gap-6">

<h1 className="text-3xl font-bold">
Food Scan
</h1>

<input
type="file"
accept="image/*"
onChange={handleImageChange}
/>

{preview && (
<img
src={preview}
alt="preview"
className="w-64 rounded-lg shadow"
/>
)}

<button
onClick={handleUpload}
disabled={loading}
className="bg-green-500 px-4 py-2 rounded text-white"
>
{loading ? "Analyzing..." : "Analyze Food"}
</button>

{result && result !== "no-food" && (
<div className="bg-gray-900 text-white p-5 rounded-xl mt-4 w-80 shadow-lg">
<h2 className="text-xl font-semibold mb-2">Detected Food</h2>

<p><strong>Food:</strong> {result.food}</p>
<p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>

{result.nutrition ? (
<div className="mt-3">
<p><strong>Calories:</strong> {result.nutrition.calories} kcal</p>
<p><strong>Protein:</strong> {result.nutrition.protein} g</p>
<p><strong>Carbs:</strong> {result.nutrition.carbs} g</p>
</div>
) : (
<p className="text-yellow-400 mt-2">
⚠️ Nutrition data not available
</p>
)}

</div>
)}

{result === "no-food" && (
<p className="text-red-500">
No food detected in this image
</p>
)}

</div>
)
}