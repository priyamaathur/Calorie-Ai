"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { 
  Utensils, ArrowLeft, Flame, Apple, Coffee, Pizza, 
  BookOpen, X, Clock, ChefHat, Leaf, Drumstick, Sun, Moon, Sunrise
} from "lucide-react"

// --- COMPLETE RECIPES DATABASE ---
const recipesData: any = {
  "Lemon Water & Nuts": { type: "veg", ingredients: ["Warm Water", "Lemon", "5 Almonds", "2 Walnuts"], steps: ["Squeeze lemon in warm water.", "Eat soaked nuts alongside."] },
  "Oatmeal with Peanut Butter": { type: "veg", ingredients: ["Oats", "Milk", "PB", "Banana"], steps: ["Cook oats in milk.", "Top with PB and fruit."] },
  "Egg White Omelet": { type: "non-veg", ingredients: ["3 Egg Whites", "Spinach", "Toast"], steps: ["Whisk whites.", "Cook with spinach.", "Serve with toast."] },
  "Paneer Tikka Salad": { type: "veg", ingredients: ["Paneer", "Veggie Mix", "Curd"], steps: ["Grill paneer chunks.", "Toss with fresh salad veggies."] },
  "Grilled Chicken & Rice": { type: "non-veg", ingredients: ["Chicken", "Brown Rice", "Broccoli"], steps: ["Grill chicken breast.", "Serve with boiled rice."] },
  "Roasted Makhana": { type: "veg", ingredients: ["Makhana", "1 tsp Ghee", "Salt"], steps: ["Roast makhana in ghee until crunchy."] },
  "Boiled Eggs": { type: "non-veg", ingredients: ["2 Eggs", "Black Pepper"], steps: ["Boil eggs for 8 mins.", "Sprinkle pepper."] },
  "Clear Lentil Soup": { type: "veg", ingredients: ["Dal", "Veggies", "Garlic"], steps: ["Boil dal with veggies.", "Add garlic tadka."] },
  "Fish & Salad": { type: "non-veg", ingredients: ["Fish", "Lemon", "Green Salad"], steps: ["Pan-sear fish.", "Serve with lemon and greens."] },
  "Sprouts Salad": { type: "veg", ingredients: ["Moong Sprouts", "Onion", "Tomato", "Lemon"], steps: ["Mix all ingredients.", "Add lemon juice."] },
  "Greek Yogurt": { type: "veg", ingredients: ["Yogurt", "Honey", "Seeds"], steps: ["Mix seeds in yogurt.", "Drizzle honey."] }
}

export default function DietPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [dietType, setDietType] = useState<"veg" | "non-veg" | "both">("both")
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const getDietPlan = () => {
    const bmi = profile?.bmi || 0
    let meals: any[] = []

    // 1. DATA MASTER (Har goal ke liye 5 meals)
    if (bmi < 18.5) { // WEIGHT GAIN
      meals = [
        { name: "Lemon Water & Nuts", time: "Early Morning", cal: "150 kcal", type: "veg", icon: <Sunrise size={20}/> },
        { name: "Oatmeal with Peanut Butter", time: "Breakfast", cal: "550 kcal", type: "veg", icon: <Coffee size={20}/> },
        { name: "Grilled Chicken & Rice", time: "Lunch", cal: "700 kcal", type: "non-veg", alt: "Paneer Tikka Salad" },
        { name: "Greek Yogurt", time: "Evening Snack", cal: "300 kcal", type: "veg", icon: <Apple size={20}/> },
        { name: "Fish & Salad", time: "Dinner", cal: "600 kcal", type: "non-veg", alt: "Clear Lentil Soup" }
      ]
    } else if (bmi > 25) { // WEIGHT LOSS
      meals = [
        { name: "Lemon Water & Nuts", time: "Early Morning", cal: "100 kcal", type: "veg", icon: <Sunrise size={20}/> },
        { name: "Egg White Omelet", time: "Breakfast", cal: "250 kcal", type: "non-veg", alt: "Sprouts Salad" },
        { name: "Paneer Tikka Salad", time: "Lunch", cal: "400 kcal", type: "veg", icon: <Pizza size={20}/> },
        { name: "Roasted Makhana", time: "Evening Snack", cal: "150 kcal", type: "veg", icon: <Apple size={20}/> },
        { name: "Clear Lentil Soup", time: "Dinner", cal: "300 kcal", type: "veg", icon: <Moon size={20}/> }
      ]
    } else { // MAINTAIN
      meals = [
        { name: "Lemon Water & Nuts", time: "Early Morning", cal: "120 kcal", type: "veg", icon: <Sunrise size={20}/> },
        { name: "Boiled Eggs", time: "Breakfast", cal: "300 kcal", type: "non-veg", alt: "Oatmeal" },
        { name: "Quinoa Bowl", time: "Lunch", cal: "450 kcal", type: "veg", icon: <Pizza size={20}/> },
        { name: "Sprouts Salad", time: "Evening Snack", cal: "200 kcal", type: "veg", icon: <Apple size={20}/> },
        { name: "Fish & Salad", time: "Dinner", cal: "450 kcal", type: "non-veg", alt: "Clear Lentil Soup" }
      ]
    }

    // Logic to handle Veg/Non-Veg Filtering
    const filtered = meals.map(m => {
      if (dietType === "veg" && m.type === "non-veg") {
        return { ...m, name: m.alt || "Veg Salad Bowl", type: "veg" } // Replace Non-Veg with Alt
      }
      if (dietType === "non-veg" && m.type === "veg") {
        return m // Non-veg users can eat veg too
      }
      return m
    })

    return filtered
  }

  const dietMeals = getDietPlan()

  if (loading) return <div className="p-20 text-center font-black animate-pulse">PLANNING MEALS...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="p-3 bg-slate-100 rounded-2xl"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-black italic">Full Day Plan 🥗</h1>
      </div>

      {/* Toggle */}
      <div className="flex justify-center bg-slate-100 p-1 rounded-3xl w-fit mx-auto border border-slate-200">
        {['veg', 'both', 'non-veg'].map((t) => (
          <button 
            key={t}
            onClick={() => setDietType(t as any)}
            className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase transition-all ${dietType === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {dietMeals.map((meal, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-green-200 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-green-400 transition-all">
                {meal.icon || <ChefHat size={20}/>}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{meal.time}</p>
                <h3 className="text-lg font-black text-slate-800">{meal.name}</h3>
                <p className="text-xs font-bold text-green-500">{meal.cal}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedRecipe({ name: meal.name, ...recipesData[meal.name] })}
              className="p-4 bg-slate-50 rounded-2xl hover:bg-green-500 hover:text-white transition-all"
            >
              <BookOpen size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 relative overflow-hidden">
            <button onClick={() => setSelectedRecipe(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full"><X size={20}/></button>
            <h2 className="text-3xl font-black mb-6">{selectedRecipe.name}</h2>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
              <div>
                <h4 className="text-xs font-black uppercase text-green-500 mb-2">Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.ingredients?.map((ing: any, idx: number) => (
                    <span key={idx} className="bg-slate-50 px-3 py-1 rounded-lg text-sm font-medium">{ing}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-green-500 mb-2">Steps</h4>
                {selectedRecipe.steps?.map((s: any, idx: number) => (
                  <p key={idx} className="text-sm text-slate-600 mb-2 leading-relaxed font-medium">{idx+1}. {s}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}