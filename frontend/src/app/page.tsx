"use client";
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, 
  CartesianGrid, BarChart, Bar, Line, ComposedChart 
} from 'recharts';
import { 
  Activity, Package, ShieldCheck, AlertTriangle, RefreshCcw, Github, 
  Linkedin, Layers, Database, Cpu, UploadCloud, FileSpreadsheet, ArrowRight, CheckCircle2
} from 'lucide-react';

export default function NovaCartPortfolio() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [inputs, setInputs] = useState({ avg_demand: 160, demand_std: 40, avg_lead_time: 4, lead_time_std: 1.2, service_level: 0.95 });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleSimulate = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/simulate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
    });
    setSimData(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'pipeline') fetch(`${API_URL}/api/pipeline`).then(r => r.json()).then(setPipeline);
  }, [activeTab, API_URL]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Layers className="text-indigo-600 w-6 h-6" />
          <span className="text-xl font-black tracking-tighter">NovaCart<span className="text-indigo-600">.</span></span>
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
        
        {/* --- 1. HOME TAB --- */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-16">
              <h1 className="text-7xl font-black tracking-tight mb-6">Inventory <span className="text-indigo-600">Intelligence.</span></h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">NovaCart is a full-stack data science solution designed to solve the "Safety Stock Paradox"—balancing capital liquidity with service reliability.</p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <FeatureCard icon={<Cpu className="text-indigo-500"/>} title="Stochastic Engine" desc="Uses probability density functions to model lead-time demand variability." />
              <FeatureCard icon={<Database className="text-blue-500"/>} title="Data Pipelines" desc="Structured ETL processes converting raw CSV/ERP data into optimized insights." />
              <FeatureCard icon={<ShieldCheck className="text-emerald-500"/>} title="Risk Mitigation" desc="Dynamically calculates ROP to ensure 95%+ service levels." />
            </div>
          </div>
        )}

        {/* --- 2. LIVE OPTIMIZER --- */}
        {activeTab === 'optimizer' && (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Simulation Control</h3>
              <div className="space-y-6">
                {Object.keys(inputs).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">{key.replace(/_/g, ' ')}</label>
                    <input type="number" step="0.1" value={(inputs as any)[key]} onChange={(e) => setInputs({...inputs, [key]: parseFloat(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                ))}
                <button onClick={handleSimulate} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                  {loading ? <RefreshCcw className="animate-spin" /> : <Activity size={20}/>} RUN ANALYSIS
                </button>
              </div>
            </div>
            <div className="col-span-8 space-y-8">
              <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm h-[400px]">
                <h4 className="font-bold text-slate-800 mb-6">Probability Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simData?.chart || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="x" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="y" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} strokeWidth={4} />
                    {simData && <ReferenceLine x={simData.metrics.rop} stroke="#F43F5E" strokeDasharray="8 8" strokeWidth={2} label={{ value: 'ROP', position: 'top', fill: '#F43F5E', fontSize: 10, fontWeight: '900' }} />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. DATA LAB (UPLOAD) --- */}
        {activeTab === 'data-lab' && (
          <div className="max-w-3xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-[3rem] p-20 text-center hover:border-indigo-400 transition-all group cursor-pointer">
              <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-indigo-600 w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black mb-4">Upload Inventory Data</h2>
              <p className="text-slate-500 font-medium mb-10 text-lg">Drag and drop your .csv or .xlsx file here to perform a batch stochastic analysis.</p>
              <div className="flex justify-center gap-4">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200"><FileSpreadsheet size={16}/> CSV</span>
                <span className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200"><Database size={16}/> XLSX</span>
              </div>
            </div>
          </div>
        )}

        {/* --- 4. PIPELINE TAB --- */}
        {activeTab === 'pipeline' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-left-8 duration-700">
            <h2 className="text-4xl font-black mb-12 text-center">Architectural Pipeline</h2>
            <div className="relative border-l-2 border-indigo-100 ml-6 space-y-12">
              {pipeline.map((p, i) => (
                <div key={i} className="relative pl-12 group">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white border-4 border-indigo-600 rounded-full group-hover:scale-125 transition-transform shadow-sm"></div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-slate-800">{p.step}</h4>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{p.status}</span>
                    </div>
                    <p className="text-slate-500 font-medium">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 5. ABOUT ME --- */}
        {activeTab === 'about' && (
          <div className="max-w-2xl mx-auto text-center animate-in fade-in duration-700">
            <div className="w-32 h-32 bg-indigo-600 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-5xl font-black">P</div>
            <h2 className="text-4xl font-black mb-2">Punk</h2>
            <p className="text-slate-500 font-medium mb-10 italic">Data Scientist | Supply Chain Enthusiast</p>
            <div className="flex justify-center gap-6">
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={20}/>} label="LinkedIn" />
              <SocialLink href="https://github.com" icon={<Github size={20}/>} label="GitHub" />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- Internal Components ---
function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
      <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">{icon}</div>
      <h4 className="text-2xl font-black mb-4 tracking-tight">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function SocialLink({ href, icon, label }: any) {
  return (
    <a href={href} target="_blank" className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-sm">
      {icon} {label}
    </a>
  );
}

function TabBtn({ active, onClick, label }: any) {
  return (
    <button onClick={onClick} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
      {label}
    </button>
  );
}