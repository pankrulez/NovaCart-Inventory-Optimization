"use client";
import React, { useState, useEffect } from 'react';
import { Layers, Activity, Database, Layout, User, PieChart, Zap, TrendingUp } from 'lucide-react';

// Component Imports (Ensure these files exist in your /components folder)
import HomeSection from '@/components/Home';
import OptimizerSection from '@/components/Optimizer';
import OptimizationSection from '@/components/Optimization';
import DataLabSection from '@/components/DataLab';
import AboutSection from '@/components/About';
import PipelineSection from '@/components/Pipeline';
import DemandForecastSection from '@/components/DemandForecast';

export default function NovaCartModular() {
  // 1. GLOBAL STATE
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [dataLabReport, setDataLabReport] = useState<any>(null);
  
  // Stochastic Inputs State
  const [inputs, setInputs] = useState({ 
    avg_demand: 160, 
    demand_std: 40, 
    avg_lead_time: 4, 
    lead_time_std: 1.2, 
    service_level: 0.95 
  });

  // 2. API CONFIGURATION
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';

  // 3. CORE LOGIC: TRIGGER STOCHASTIC ENGINE
  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      
      if (!res.ok) throw new Error("Backend unavailable");
      
      const data = await res.json();
      console.log("✅ Stochastic Sync:", data);
      setSimData(data);
    } catch (error) {
      console.error("❌ Simulation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* --- PREMIUM STICKY NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-8 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="bg-slate-900 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/20">
            <Layers className="text-indigo-400 w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-800 leading-none">NovaCart.</span>
            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-1">Stochastic Engine</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl gap-1 border border-slate-200/50 shadow-inner">
          <NavBtn id="home" active={activeTab} label="Overview" icon={<Layout size={14}/>} onClick={setActiveTab} />
          <NavBtn id="optimizer" active={activeTab} label="Live ROP" icon={<Activity size={14}/>} onClick={setActiveTab} />
          <NavBtn id="optimization" active={activeTab} label="EOQ Logic" icon={<PieChart size={14}/>} onClick={setActiveTab} />
          <NavBtn id="forecast" active={activeTab} label="Forecast" icon={<TrendingUp size={14}/>} onClick={setActiveTab} />
          <NavBtn id="data-lab" active={activeTab} label="Data Lab" icon={<Database size={14}/>} onClick={setActiveTab} />
          <NavBtn id="pipeline" active={activeTab} label="Pipeline" icon={<Zap size={14}/>} onClick={setActiveTab} />
          <NavBtn id="about" active={activeTab} label="Profile" icon={<User size={14}/>} onClick={setActiveTab} />
        </div>
        
        {/* API Status Indicator */}
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-emerald-700 uppercase">System Live</span>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-6xl mx-auto py-12 px-8">
        {activeTab === 'home' && <HomeSection />}
        
        {activeTab === 'optimizer' && (
          <OptimizerSection 
            inputs={inputs} 
            setInputs={setInputs} 
            handleSimulate={handleSimulate} 
            simData={simData} 
            loading={loading} 
          />
        )}
        
        {activeTab === 'optimization' && <OptimizationSection />}

        {activeTab === 'forecast' && <DemandForecastSection />}
        
        {activeTab === 'data-lab' && (
          <DataLabSection 
            report={dataLabReport} 
            setReport={setDataLabReport} 
          />
        )}

        {activeTab === 'pipeline' && <PipelineSection />}
        
        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center border-t border-slate-200/50 mt-20">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          NovaCart Enterprise • Stochastic Inventory Intelligence
        </p>
      </footer>
    </div>
  );
}

/** * REUSABLE NAV BUTTON COMPONENT
 */
function NavBtn({ id, active, label, icon, onClick }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => onClick(id)} 
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
        isActive 
        ? 'bg-white text-indigo-600 shadow-md scale-105 border border-slate-100' 
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
      }`}
    >
      {icon} {label}
    </button>
  );
}