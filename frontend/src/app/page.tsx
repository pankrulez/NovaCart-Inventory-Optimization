"use client";
import React, { useState, useEffect } from 'react';
import { Layers, Activity, Database, Layout, User, PieChart } from 'lucide-react';

// Modular Component Imports
import HomeSection from '@/components/Home';
import OptimizerSection from '@/components/Optimizer';     // Stochastic/ROP Tab
import OptimizationSection from '@/components/Optimization'; // EOQ/Cost Tab
import DataLabSection from '@/components/DataLab';
import PipelineSection from '@/components/Pipeline';
import AboutSection from '@/components/About';

export default function NovaCartModular() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  
  // Simulation State (for the Optimizer/Stochastic Tab)
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  
  // Pipeline State
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  
  // Shared Input State for Stochastic Model
  const [inputs, setInputs] = useState({ 
    avg_demand: 160, 
    demand_std: 40, 
    avg_lead_time: 4, 
    lead_time_std: 1.2, 
    service_level: 0.95 
  });

  // Environment Variable for API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  /**
   * handleSimulate
   * Triggers the Stochastic/ROP model on the FastAPI backend
   */
  const handleSimulate = async () => {
    console.log("🚀 Triggering Stochastic Engine...");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      
      if (!res.ok) throw new Error("Backend connection failed");
      
      const result = await res.json();
      console.log("✅ Data Received:", result);
      setSimData(result);
    } catch (error) {
      console.error("❌ Simulation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pipeline data when the tab is accessed
  useEffect(() => {
    if (activeTab === 'pipeline') {
      fetch(`${API_URL}/api/pipeline`)
        .then(r => r.json())
        .then(setPipelineData)
        .catch(err => console.error("Pipeline Fetch Error:", err));
    }
  }, [activeTab, API_URL]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 md:px-12 py-5 flex justify-between items-center overflow-x-auto">
        <div className="flex items-center gap-2 min-w-fit mr-8">
          <Layers className="text-indigo-600 w-6 h-6" />
          <span className="text-xl font-black tracking-tighter uppercase italic">NovaCart.</span>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 whitespace-nowrap">
          <TabButton id="home" active={activeTab} label="Overview" icon={<Layout size={14}/>} onClick={setActiveTab} />
          <TabButton id="optimizer" active={activeTab} label="Live ROP" icon={<Activity size={14}/>} onClick={setActiveTab} />
          <TabButton id="optimization" active={activeTab} label="EOQ Logic" icon={<PieChart size={14}/>} onClick={setActiveTab} />
          <TabButton id="data-lab" active={activeTab} label="Data Lab" icon={<Database size={14}/>} onClick={setActiveTab} />
          <TabButton id="pipeline" active={activeTab} label="Pipeline" icon={<Layers size={14}/>} onClick={setActiveTab} />
          <TabButton id="about" active={activeTab} label="About" icon={<User size={14}/>} onClick={setActiveTab} />
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-6xl mx-auto py-10 md:py-16 px-6">
        
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

        {activeTab === 'optimization' && (
          <OptimizationSection />
        )}

        {activeTab === 'data-lab' && <DataLabSection />}
        
        {activeTab === 'pipeline' && (
          <PipelineSection pipeline={pipelineData} />
        )}
        
        {activeTab === 'about' && <AboutSection />}

      </main>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-slate-200 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          NovaCart Enterprise Edition • 2026
        </p>
      </footer>
    </div>
  );
}

// --- Internal Nav Helper Component ---
function TabButton({ id, active, label, icon, onClick }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => onClick(id)} 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
        isActive 
        ? 'bg-white text-indigo-600 shadow-sm' 
        : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      {icon} {label}
    </button>
  );
}