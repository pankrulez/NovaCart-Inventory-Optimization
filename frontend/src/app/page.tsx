"use client";
import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';

// Import our new modular components
import HomeSection from '@/components/Home';
import OptimizerSection from '@/components/Optimizer';
import PipelineSection from '@/components/Pipeline';
import AboutSection from '@/components/About';
import DataLabSection from '@/components/DataLab'; // (Create a simple UI for this like the others)

export default function NovaCartModular() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [inputs, setInputs] = useState({ avg_demand: 160, demand_std: 40, avg_lead_time: 4, lead_time_std: 1.2, service_level: 0.95 });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      setSimData(await res.json());
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'pipeline') fetch(`${API_URL}/api/pipeline`).then(r => r.json()).then(setPipeline);
  }, [activeTab, API_URL]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Layers className="text-indigo-600 w-6 h-6" />
          <span className="text-xl font-black tracking-tighter">NovaCart.</span>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          {['home', 'optimizer', 'data-lab', 'pipeline', 'about'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-16 px-6">
        {activeTab === 'home' && <HomeSection />}
        {activeTab === 'optimizer' && <OptimizerSection inputs={inputs} setInputs={setInputs} handleSimulate={handleSimulate} simData={simData} loading={loading} />}
        {activeTab === 'data-lab' && <DataLabSection />}
        {activeTab === 'pipeline' && <PipelineSection />}
        {activeTab === 'about' && <AboutSection />}
      </main>
    </div>
  );
}