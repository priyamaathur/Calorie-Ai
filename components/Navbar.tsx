"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { 
  Menu, X, User, Edit3, LogOut, LayoutDashboard, 
  ScanLine, Activity, Bell, Mail, MessageSquare 
} from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])

  // Notifications load karne ka logic
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history") || "[]")
    const notifs = []
    if (history.length > 0) {
      notifs.push(`Last scan: ${history[history.length - 1].name} added!`)
    }
    notifs.push("Welcome to CalorieAI Dashboard!")
    setNotifications(notifs)
  }, [])

  const handleLogout = async () => {
    localStorage.clear() 
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navigateTo = (path: string) => {
    router.push(path)
    setIsOpen(false)
    setShowNotifs(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigateTo("/dashboard")}>
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
            <Activity size={22} className="text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">CalorieAI</span>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          
          {/* Notification Icon */}
          <div className="relative">
            <button 
              onClick={() => { setShowNotifs(!showNotifs); setIsOpen(false); }}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-700 relative"
            >
              <Bell size={22} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 animate-in fade-in slide-in-from-top-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Recent Activity</p>
                <div className="space-y-2">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Button */}
          <button 
            onClick={() => navigateTo("/contact")}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-700"
            title="Contact Us"
          >
            <MessageSquare size={22} />
          </button>

          {/* Hamburger Menu */}
          <div className="relative">
            <button onClick={() => { setIsOpen(!isOpen); setShowNotifs(false); }} className="p-3 bg-slate-900 text-white rounded-2xl transition-all">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden p-3 space-y-1">
                <button onClick={() => navigateTo("/dashboard")} className="w-full flex items-center gap-3 px-4 py-4 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold transition-all">
                   <LayoutDashboard size={18} className="text-green-500" /> Dashboard
                </button>
                <button onClick={() => navigateTo("/profile")} className="w-full flex items-center gap-3 px-4 py-4 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold transition-all">
                   <User size={18} className="text-blue-500" /> View Profile
                </button>
                <div className="h-px bg-slate-100 my-2 mx-4" />
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 text-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all">
                   <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Overlay to close */}
      {(isOpen || showNotifs) && <div className="fixed inset-0 z-[-1]" onClick={() => { setIsOpen(false); setShowNotifs(false); }} />}
    </nav>
  )
}