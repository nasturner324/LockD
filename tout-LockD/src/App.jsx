import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Dumbbell, 
  Trophy, 
  Camera, 
  Sparkles, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Share2, 
  Lock, 
  Smartphone, 
  ChevronRight,
  Zap,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('widget');
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('lockd_streak') || '5'));
  const [calories, setCalories] = useState(() => parseInt(localStorage.getItem('lockd_calories') || '420'));
  const [activeMinutes, setActiveMinutes] = useState(() => parseInt(localStorage.getItem('lockd_minutes') || '45'));
  const [miles, setMiles] = useState(() => parseFloat(localStorage.getItem('lockd_miles') || '2.8'));
  
  const [selectedSpot, setSelectedSpot] = useState('Eppley Recreation Center');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [aiCaption, setAiCaption] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
  const [reactions, setReactions] = useState(() => JSON.parse(localStorage.getItem('lockd_reactions') || '{"🔥": 12, "🐢": 24, "💪": 18}'));

  useEffect(() => {
    localStorage.setItem('lockd_streak', streak.toString());
    localStorage.setItem('lockd_calories', calories.toString());
    localStorage.setItem('lockd_minutes', activeMinutes.toString());
    localStorage.setItem('lockd_miles', miles.toString());
    localStorage.setItem('lockd_reactions', JSON.stringify(reactions));
  }, [streak, calories, activeMinutes, miles, reactions]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateGeminiCaption = async () => {
    setIsGeneratingAi(true);
    setAiCaption('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setTimeout(() => {
        const fallbackCaptions = [
          `Pushed through a solid ${activeMinutes}m session at ${selectedSpot}! Testudo would be proud. 🐢🔥 #FearTheTurtle`,
          `Crushed ${calories} calories at ${selectedSpot}! Maryland grit hits different. 🐢💪`,
          `Locked in for ${miles} miles around campus. Eppley energy was unreal today! 🐢⚡`
        ];
        setAiCaption(fallbackCaptions[Math.floor(Math.random() * fallbackCaptions.length)]);
        setIsGeneratingAi(false);
      }, 1200);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a short, hype, UMD college student workout caption (max 2 sentences) for a post at "${selectedSpot}". Workout details: ${calories} calories burned, ${activeMinutes} active minutes, ${miles} miles. Include UMD references like Testudo or Fear The Turtle.`
            }]
          }]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        setAiCaption(generatedText.trim());
      } else {
        throw new Error('No output');
      }
    } catch (err) {
      setAiCaption(`Just logged ${activeMinutes} mins at ${selectedSpot}! Stacking streaks for UMD. 🐢🔥`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCheckIn = () => {
    setStreak(prev => prev + 1);
    setCalories(prev => prev + 180);
    setActiveMinutes(prev => prev + 30);
    setMiles(prev => parseFloat((prev + 1.2).toFixed(1)));
  };

  const addReaction = (emoji) => {
    setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-yellow-500 p-0.5 shadow-lg shadow-red-900/30">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15 8H21L16 12L18 18L12 14L6 18L8 12L3 8H9L12 2Z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
                tout <span className="text-red-500">LockD</span>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 font-medium">UMD</span>
              </h1>
              <p className="text-xs text-slate-400">Social Fitness Lockscreen</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-sm font-bold text-orange-400">{streak} Day Streak</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Phone Simulator */}
        <section className="md:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[320px] bg-slate-900 border-[6px] border-slate-800 rounded-[40px] p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[580px] my-auto">
            
            {/* Background Image / Gradient */}
            {photoPreview ? (
              <img src={photoPreview} alt="Lockscreen preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-950" />
            )}
            
            {/* Phone Notch */}
            <div className="relative z-10 mx-auto w-28 h-4 bg-slate-950 rounded-b-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-slate-900 rounded-full" />
            </div>

            {/* Lockscreen Time */}
            <div className="relative z-10 text-center mt-6">
              <div className="text-5xl font-light tracking-tight text-white/90 drop-shadow-md">09:41</div>
              <div className="text-xs font-medium text-slate-300 mt-1 uppercase tracking-widest">Sunday, Oct 18</div>
            </div>

            {/* LockD Active Widget */}
            <div className="relative z-10 my-auto bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-xl text-left space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold text-red-400 tracking-wider uppercase">Live LockD Widget</span>
                </div>
                <span className="text-[10px] text-slate-400">{selectedSpot.split(' ')[0]}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
                  <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                  <div className="text-xs font-bold">{calories}</div>
                  <div className="text-[9px] text-slate-400 uppercase">kcal</div>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
                  <Dumbbell className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <div className="text-xs font-bold">{activeMinutes}m</div>
                  <div className="text-[9px] text-slate-400 uppercase">Active</div>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-xs font-bold">{miles}</div>
                  <div className="text-[9px] text-slate-400 uppercase">Miles</div>
                </div>
              </div>

              {aiCaption && (
                <div className="text-[11px] text-slate-200 bg-red-950/30 border border-red-500/20 p-2 rounded-lg italic">
                  "{aiCaption}"
                </div>
              )}
            </div>

            {/* Bottom Lock Icon */}
            <div className="relative z-10 text-center mb-2">
              <Lock className="w-4 h-4 mx-auto text-slate-400" />
            </div>
          </div>
        </section>

        {/* Right Column: Controls & Campus Feed */}
        <section className="md:col-span-7 space-y-6">
          
          {/* Gym Check-in & Photo Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-red-400">
              <MapPin className="w-5 h-5" /> Gym Check-In
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Campus Location</label>
                <select 
                  value={selectedSpot} 
                  onChange={(e) => setSelectedSpot(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                >
                  <option>Eppley Recreation Center</option>
                  <option>Ritchie Coliseum</option>
                  <option>SPH Fitness Center</option>
                  <option>McKeldin Mall Loop</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Upload Gym Photo</label>
                <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 cursor-pointer transition">
                  <Camera className="w-4 h-4 text-red-400" />
                  <span>Choose Image</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={handleCheckIn}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition"
              >
                <CheckCircle2 className="w-4 h-4" /> Log Workout (+Stats)
              </button>

              <button 
                onClick={generateGeminiCaption}
                disabled={isGeneratingAi}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" /> 
                {isGeneratingAi ? 'Generating...' : 'AI Caption'}
              </button>
            </div>
          </div>

          {/* Community Social Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-yellow-400">
              <Trophy className="w-5 h-5" /> Campus LockD Feed
            </h2>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center font-bold text-red-400 text-xs">
                    NT
                  </div>
                  <div>
                    <div className="text-sm font-bold">Nassir Turner</div>
                    <div className="text-[11px] text-slate-400">{selectedSpot}</div>
                  </div>
                </div>
                <span className="text-xs text-slate-500">Just now</span>
              </div>

              <p className="text-sm text-slate-300 italic bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                "{aiCaption || `Crushed an intense workout at ${selectedSpot}! Keeping the LockD streak strong.`}"
              </p>

              {/* Emoji Reactions */}
              <div className="flex items-center gap-2 pt-1">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button 
                    key={emoji}
                    onClick={() => addReaction(emoji)}
                    className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-300 transition"
                  >
                    <span>{emoji}</span>
                    <span className="text-slate-400">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
