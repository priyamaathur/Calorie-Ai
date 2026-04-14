"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Linkedin, Github, Send, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
  const router = useRouter()
  const [isSent, setIsSent] = useState(false)
  const [message, setMessage] = useState("")

  const handleSendFeedback = () => {
    if (!message.trim()) return alert("Please enter a message!")
    setIsSent(true)
    setMessage("")
    setTimeout(() => {
      setIsSent(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* 🟢 SUCCESS NOTIFICATION (Wahi purana logic) */}
      {isSent && (
        <div className="absolute top-10 z-[100] animate-in slide-in-from-top-full duration-500">
          <div className="bg-emerald-500 text-white px-8 py-4 rounded-3xl shadow-2xl shadow-emerald-200 flex items-center gap-3 border-2 border-white/20">
            <CheckCircle2 size={24} />
            <span className="font-black uppercase tracking-widest text-sm">Feedback Sent Successfully! 🚀</span>
          </div>
        </div>
      )}

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

      <div className="max-w-5xl w-full flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-700">
        
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase">Get In Touch</h1>
          <p className="text-slate-400 font-medium max-w-md mx-auto italic">
            I value your feedback! Reach out for any queries or collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-stretch">
          
          {/* 🟢 DIRECT LINKS CARD (Updated with Real Links) */}
          <div className="bg-white rounded-[3.5rem] p-10 shadow-xl shadow-blue-500/5 flex flex-col justify-between border border-white">
            <div className="space-y-6">
              <h2 className="text-2xl font-black italic text-slate-800">Direct Links</h2>
              
              <div className="flex flex-col gap-4">
                <a href="mailto:priya@example.com" className="flex items-center justify-between p-5 bg-red-50 rounded-[1.5rem] group hover:bg-red-100 transition-all">
                  <div className="flex items-center gap-4">
                    <Mail className="text-red-500" size={24} />
                    <span className="font-black text-red-600 uppercase text-xs tracking-widest">Email Me</span>
                  </div>
                  <ArrowLeft className="rotate-180 text-red-300 group-hover:translate-x-1 transition-transform" size={18} />
                </a>

                {/* 🔴 LinkedIn Fixed */}
                <a href="https://linkedin.com/in/YOUR_ID" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-blue-50 rounded-[1.5rem] group hover:bg-blue-100 transition-all">
                  <div className="flex items-center gap-4">
                    <Linkedin className="text-blue-500" size={24} />
                    <span className="font-black text-blue-600 uppercase text-xs tracking-widest">LinkedIn</span>
                  </div>
                  <ArrowLeft className="rotate-180 text-blue-300 group-hover:translate-x-1 transition-transform" size={18} />
                </a>

                {/* 🔴 GitHub Fixed */}
                <a href="https://github.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] group hover:bg-slate-200 transition-all">
                  <div className="flex items-center gap-4">
                    <Github className="text-slate-700" size={24} />
                    <span className="font-black text-slate-800 uppercase text-xs tracking-widest">GitHub</span>
                  </div>
                  <ArrowLeft className="rotate-180 text-slate-300 group-hover:translate-x-1 transition-transform" size={18} />
                </a>
              </div>
            </div>

            <p className="text-[10px] font-bold text-slate-300 text-center mt-8 uppercase tracking-[0.4em]">developed with love by priya mathur</p>
          </div>

          {/* 🟢 FEEDBACK FORM (Wahi purana code) */}
          <div className="bg-[#1A1F2C] rounded-[3.5rem] p-10 shadow-2xl flex flex-col gap-6 border border-white/5 relative overflow-hidden">
             <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <h2 className="text-2xl font-black italic text-[#00D261]">Share Feedback</h2>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
                   <textarea 
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="What can we improve in CalorieAI?"
                     className="w-full h-44 bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D261] transition-all resize-none font-medium"
                   />
                </div>
                <button 
                  onClick={handleSendFeedback}
                  className="w-full bg-[#00D261] hover:bg-white text-slate-900 font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-lg shadow-green-500/10"
                >
                   <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
                   <span className="uppercase tracking-[0.2em] text-sm">Send Feedback</span>
                </button>
             </div>
             <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#00D261]/10 rounded-full blur-[100px]" />
          </div>

        </div>
      </div>
    </div>
  )
}