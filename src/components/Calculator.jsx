import { useState } from 'react';
import { X, User, Ruler, Weight, Activity, Sparkles, ArrowRight } from 'lucide-react';

/**
 * @component Calculator
 * @description Handles user physical metrics and calculates TDEE (Total Daily Energy Expenditure).
 */
const Calculator = ({ isOpen, onClose }) => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activity: '1.2' // Default activity multiplier (Sedentary)
  });

  if (!isOpen) return null;

  // Sync input changes with state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Core Logic: Mifflin-St Jeor Equation
   * Calculates maintenance calories and saves to local storage.
   */
  const handleCalculate = () => {
    const { age, weight, height, activity } = formData;
    
    if(!age || !weight || !height) {
      alert("Please fill all fields to get an accurate result!");
      return;
    }

    // Standard BMR calculation for general profile
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    const tdee = Math.round(bmr * parseFloat(activity));

    // Create user profile object
    const userProfile = {
      ...formData,
      dailyGoal: tdee,
      remaining: tdee, // Initially, remaining calories = daily goal
      setupComplete: true,
      lastUpdated: new Date().toLocaleDateString()
    };

    // Persistent storage
    localStorage.setItem('calorieAI_user', JSON.stringify(userProfile));
    
    // Refresh to trigger state update in App.jsx
    window.location.reload(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 relative shadow-2xl border border-white">
        
        <button onClick={onClose} className="absolute right-8 top-8 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
          <X size={24} />
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-widest">
            <Sparkles size={12} fill="currentColor" /> Personalize
          </div>
          <h2 className="text-3xl font-black text-slate-900">Your <span className="text-orange-500">Daily Goal</span></h2>
          <p className="text-slate-500 font-medium mt-1">AI will calculate your perfect caloric baseline.</p>
        </div>

        <div className="space-y-5">
          {/* Age Input */}
          <div className="group">
            <label className="text-xs font-bold text-slate-400 uppercase ml-4 mb-2 block">Your Age</label>
            <div className="flex items-center bg-slate-50 border border-slate-100 group-focus-within:border-orange-200 group-focus-within:bg-white rounded-2xl p-4 transition-all">
              <User className="text-slate-400 group-focus-within:text-orange-500" size={20} />
              <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="e.g. 25" className="w-full bg-transparent border-none focus:ring-0 pl-3 text-slate-900 font-semibold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div className="group">
              <label className="text-xs font-bold text-slate-400 uppercase ml-4 mb-2 block">Weight (kg)</label>
              <div className="flex items-center bg-slate-50 border border-slate-100 group-focus-within:border-orange-200 group-focus-within:bg-white rounded-2xl p-4 transition-all">
                <Weight className="text-slate-400 group-focus-within:text-orange-500" size={20} />
                <input name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="kg" className="w-full bg-transparent border-none focus:ring-0 pl-3 text-slate-900 font-semibold" />
              </div>
            </div>
            {/* Height */}
            <div className="group">
              <label className="text-xs font-bold text-slate-400 uppercase ml-4 mb-2 block">Height (cm)</label>
              <div className="flex items-center bg-slate-50 border border-slate-100 group-focus-within:border-orange-200 group-focus-within:bg-white rounded-2xl p-4 transition-all">
                <Ruler className="text-slate-400 group-focus-within:text-orange-500" size={20} />
                <input name="height" type="number" value={formData.height} onChange={handleChange} placeholder="cm" className="w-full bg-transparent border-none focus:ring-0 pl-3 text-slate-900 font-semibold" />
              </div>
            </div>
          </div>

          {/* Activity Intensity */}
          <div className="group">
            <label className="text-xs font-bold text-slate-400 uppercase ml-4 mb-2 block">Activity Level</label>
            <div className="flex items-center bg-slate-50 border border-slate-100 group-focus-within:border-orange-200 group-focus-within:bg-white rounded-2xl p-4 transition-all">
              <Activity className="text-slate-400 group-focus-within:text-orange-500" size={20} />
              <select name="activity" value={formData.activity} onChange={handleChange} className="w-full bg-transparent border-none focus:ring-0 pl-3 text-slate-900 font-semibold appearance-none">
                <option value="1.2">Sedentary (No Exercise)</option>
                <option value="1.375">Light (1-2 days/week)</option>
                <option value="1.55">Moderate (3-5 days/week)</option>
                <option value="1.725">Active (6-7 days/week)</option>
              </select>
            </div>
          </div>

          <button onClick={handleCalculate} className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] mt-4 hover:bg-orange-500 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
            Save My Profile <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;