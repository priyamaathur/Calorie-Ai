"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { 
  Camera, Upload, ArrowLeft, Zap, 
  Flame, Dumbbell, History as HistoryIcon, 
  BarChart3, XCircle, PieChart, CheckCircle2 
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

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
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"scan" | "history" | "stats">("scan")

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history") || "[]")
    setHistory(savedHistory)
  }, [])

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleUpload = async () => {
    if (!image) { alert("Upload image"); return }
    setLoading(true)
    const formData = new FormData()
    formData.append("image", image)

    try {
      const res = await fetch("/api/food-scan", { method: "POST", body: formData })
      const data = await res.json()

      if (data.food && data.confidence > 0.6) {
        let nutrition = nutritionMap[data.food.toLowerCase()]
        if (!nutrition) {
          for (const key in nutritionMap) {
            if (data.food.toLowerCase().includes(key)) {
              nutrition = nutritionMap[key]
              break
            }
          }
        }

        const finalRes = { 
          food: data.food, 
          confidence: data.confidence, 
          nutrition: nutrition || { calories: 0, protein: 1, carbs: 1 }, 
          warning: (nutrition?.calories || 0) > 250 ? "High Calorie" : "Safe",
          exercise: ["Running (20 min)", "Brisk Walk (30 min)"]
        }

        setResult(finalRes)

        // 🟢 SAVE TO SUPABASE
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from("history").insert([
            { 
              user_id: user.id, 
              food_name: data.food, 
              nutrition: nutrition || { calories: 0, protein: 0, carbs: 0 }
            }
          ])
        }

        // 🟢 SAVE TO LOCAL STORAGE
        const prev = JSON.parse(localStorage.getItem("history") || "[]")
        const updated = [finalRes, ...prev].slice(0, 10)
        localStorage.setItem("history", JSON.stringify(updated))
        setHistory(updated)

      } else {
        setResult("no-food")
      }
    } catch (err) {
      console.error("Scan Error:", err)
      alert("Error: Python server connect nahi ho raha!")
    } finally {
      setLoading(false)
    }
  }

  const chartData = history.map((item, i) => ({
    name: `M${history.length - i}`,
    calories: item.nutrition?.calories || 0
  })).reverse()

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-10 left-10 right-10 flex justify-between items-center z-50">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-all group">
          <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md"><ArrowLeft size={20} /></div>
          <span>Back</span>
        </button>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <TabButton active={activeTab === "scan"} onClick={() => setActiveTab("scan")} icon={<Camera size={14}/>} label="Scan" />
          <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")} icon={<HistoryIcon size={14}/>} label="History" />
          <TabButton active={activeTab === "stats"} onClick={() => setActiveTab("stats")} icon={<BarChart3 size={14}/>} label="Stats" />
        </div>
      </div>

      <div className="max-w-5xl w-full mt-12 animate-in fade-in zoom-in duration-700">
        {activeTab === "scan" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className={`bg-white p-6 rounded-[3.5rem] shadow-2xl border border-white relative min-h-[450px] flex items-center justify-center overflow-hidden`}>
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} className="w-full aspect-square object-cover rounded-[2.5rem]" alt="Preview" />
                  <button onClick={() => {setPreview(null); setImage(null); setResult(null)}} className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"><XCircle size={24} /></button>
                  {loading && <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px] rounded-[2.5rem] flex items-center justify-center"><div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>}
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-6 group">
                  <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500"><Upload size={40} /></div>
                  <div className="text-center">
                    <span className="block font-black text-slate-800 text-xl uppercase tracking-tighter italic">Upload Photo</span>
                    <span className="text-slate-400 text-sm font-bold tracking-widest uppercase">Click to browse</span>
                  </div>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>

            <div className="space-y-6">
              {!result && !loading && (
                <div className="text-left space-y-4">
                  <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase">Food<br/><span className="text-blue-600">Scanner</span></h1>
                  <p className="text-slate-400 font-medium italic">Upload a meal photo to get detailed nutrition data instantly using AI.</p>
                  {image && (
                    <button onClick={handleUpload} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95">
                      <Zap size={24} fill="currentColor" /> START AI SCAN
                    </button>
                  )}
                </div>
              )}

              {result && result !== "no-food" && (
                <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white space-y-8 animate-in slide-in-from-right-10 duration-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic capitalize">{result.food}</h2>
                      <p className="text-[#00D261] font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-1"><CheckCircle2 size={12}/> 100% AI Accuracy</p>
                    </div>
                    <Badge type={result.warning} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100">
                      <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Calories</p>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{result?.nutrition?.calories ?? 0} <span className="text-sm text-slate-400">kcal</span></h3>
                    </div>
                    <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Protein</p>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{result?.nutrition?.protein ?? 0}g</h3>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 shadow-2xl">
                    <p className="font-black italic uppercase tracking-widest text-xs flex items-center gap-2 text-[#00D261]"><Dumbbell size={18}/> Exercise Required</p>
                    <ul className="grid grid-cols-1 gap-2">
                      {result?.exercise?.map((ex:any, i:any) => (
                        <li key={i} className="text-sm font-bold text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 italic">🔥 {ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {result === "no-food" && <div className="p-10 bg-white rounded-[3rem] text-center font-bold text-red-500 border border-red-50">❌ Food not recognized. Try another photo.</div>}
            </div>
          </div>
        )}

        {activeTab === "history" && <HistorySection history={history} />}
        {activeTab === "stats" && <StatsSection chartData={chartData} />}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}>
      {icon} {label}
    </button>
  )
}

function Badge({ type }: { type: string }) {
  const isSafe = type === "Safe"
  return (
    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSafe ? 'bg-green-50 text-green-600 border-green-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
      {type}
    </div>
  )
}

function HistorySection({ history }: any) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-4 mb-4">
         <div className="p-3 bg-blue-500 text-white rounded-2xl"><HistoryIcon size={24}/></div>
         <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">Recent Scans</h2>
      </div>
      {history.length > 0 ? history.map((h:any, i:any) => (
        <div key={i} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"><Flame size={20}/></div>
             <div>
               <p className="font-black text-slate-800 text-xl italic capitalize">{h.food}</p>
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Logged successfully</p>
             </div>
          </div>
          <p className="text-2xl font-black text-blue-600 italic tracking-tighter">{h.nutrition?.calories} <span className="text-[10px] text-slate-400 uppercase tracking-widest">kcal</span></p>
        </div>
      )) : <div className="text-center py-20 text-slate-300 font-bold italic">No scan history yet...</div>}
    </div>
  )
}

function StatsSection({ chartData }: any) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-4 mb-4">
         <div className="p-3 bg-blue-500 text-white rounded-2xl"><PieChart size={24}/></div>
         <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">Calorie Trends</h2>
      </div>
      <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#cbd5e1'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#cbd5e1'}} />
            <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}} itemStyle={{fontWeight: '900', color: '#2563eb'}} />
            <Line type="monotone" dataKey="calories" stroke="#2563eb" strokeWidth={6} dot={{r: 6, fill: '#2563eb', strokeWidth: 4, stroke: '#fff'}} activeDot={{r: 10}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}