"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, BellOff, Circle } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()

  // Dummy notifications data
  const notifications = [
    { id: 1, title: "Daily Goal Reached! 🎯", desc: "You've hit your calorie target for today. Great job!", time: "2h ago", unread: true },
    { id: 2, title: "New Diet Plan Available", desc: "Your personalized weekly diet guide is ready to view.", time: "5h ago", unread: true },
    { id: 3, title: "System Update", desc: "CalorieAI is now faster with the new Vision Engine 2.0.", time: "1d ago", unread: false },
  ]

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center p-6 relative">
      
      {/* 🟢 GO BACK BUTTON */}
      <button 
        onClick={() => router.back()}
        className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-all active:scale-95 z-50 group"
      >
        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md">
          <ArrowLeft size={20} />
        </div>
        <span>Go Back</span>
      </button>

      {/* 🟢 NOTIFICATIONS CONTENT */}
      <div className="max-w-3xl w-full mt-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Notifications</h1>
            <p className="text-slate-400 font-medium italic text-sm">Stay updated with your health journey</p>
          </div>
          <div className="bg-blue-500/10 p-4 rounded-3xl text-blue-500">
            <Bell size={32} strokeWidth={2.5} />
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`bg-white p-6 rounded-[2.5rem] border ${n.unread ? 'border-blue-100 shadow-xl shadow-blue-500/5' : 'border-slate-50 opacity-80'} flex items-start gap-5 transition-all hover:scale-[1.01]`}
              >
                <div className={`mt-1.5 ${n.unread ? 'text-blue-500' : 'text-slate-300'}`}>
                  {n.unread ? <Circle size={12} fill="currentColor" /> : <Circle size={12} />}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-black text-slate-800 tracking-tight text-lg">{n.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{n.desc}</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-2">{n.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center gap-4 text-center border border-slate-100">
              <BellOff size={48} className="text-slate-200" />
              <p className="text-slate-400 font-bold italic">No new notifications</p>
            </div>
          )}
        </div>

        <button className="w-full py-5 text-slate-400 font-bold text-xs uppercase tracking-[0.3em] hover:text-blue-500 transition-colors">
          Mark all as read
        </button>
      </div>
    </div>
  )
}