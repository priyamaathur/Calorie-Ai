import { ArrowRight, Calculator, Zap, Star } from 'lucide-react';

/**
 * Hero Component
 * @param {Object} props - Contains onOpenModal function
 */
const Hero = ({ onOpenModal }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
      
      {/* Motivational Badge */}
      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 px-4 py-2 rounded-full mb-8 animate-fade-in">
        <Zap size={14} fill="currentColor" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Revolutionizing Personal Nutrition</span>
      </div>

      {/* Main Catchy Headline */}
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
        Eat Smarter. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
          Feel Stronger.
        </span>
      </h1>

      {/* Supporting Text */}
      <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
        Stop guessing and start progressing. Our AI analyzes your body's needs to create a 
        perfectly balanced nutrition plan tailored just for you.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
        <button 
          onClick={onOpenModal}
          className="group bg-slate-900 text-white px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-orange-500 transition-all shadow-2xl shadow-slate-300 active:scale-95 flex items-center gap-3"
        >
          Check My Daily Goal
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </button>
        
        {/* Trust Pilot Style Social Proof */}
        <div className="flex flex-col items-center sm:items-start gap-1 px-4">
           <div className="flex text-orange-400">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
           </div>
           <p className="text-xs font-bold text-slate-400">Trusted by 10,000+ Health Enthusiasts</p>
        </div>
      </div>

      {/* App Preview Card (Placeholder for now) */}
      <div className="mt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent z-10 h-full w-full"></div>
        <div className="rounded-[40px] border-[8px] border-white bg-white p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] max-w-4xl mx-auto overflow-hidden">
           <div className="bg-slate-50 rounded-[32px] h-[400px] flex items-center justify-center border border-slate-100">
               <div className="text-center">
                 <div className="bg-white p-4 rounded-3xl shadow-sm mb-4 inline-block">
                    <Calculator className="text-orange-500" size={48} />
                 </div>
                 <p className="text-slate-400 font-bold italic">Smart Dashboard visualization coming in Step 10...</p>
               </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;