import { Flame, Menu } from 'lucide-react';

/**
 * Navbar Component
 * Features Glassmorphism effect and clean typography.
 */
const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <Flame className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            CALORIE <span className="text-orange-500">AI</span>
          </span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-slate-600 font-semibold text-sm">
          <a href="#" className="hover:text-orange-500 transition-colors">Methodology</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Success Stories</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Community</a>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-slate-900 font-bold hover:text-orange-500 transition-colors">
            Log In
          </button>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-slate-200">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;