"use client";
import React, { useEffect, useState } from 'react';
import { Activity, Database, Cpu, CheckCircle2, Server, Globe, Zap, Info, Share2 } from 'lucide-react';

export default function PipelineSection() {
  const [status, setStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const res = await fetch(`${API_URL}/api/pipeline`);
        if (!res.ok) throw new Error("404 Not Found");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Pipeline Sync Error:", err);
        setStatus([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchPipeline();
  }, [API_URL]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'database': return <Database size={24} />;
      case 'cpu': return <Cpu size={24} />;
      case 'zap': return <Zap size={24} />;
      default: return <Activity size={24} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700 space-y-12">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">System Pipeline</h2>
          <p className="text-slate-500 font-medium italic">Architectural flow of the NovaCart stack.</p>
        </div>
        <div className="bg-slate-900 text-indigo-400 px-6 py-3 rounded-2xl flex items-center gap-3 border border-slate-800 shadow-xl">
           <Server size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">Production Node: Render-01</span>
        </div>
      </div>

      {/* --- NEW: SYSTEM FLOW SUMMARY --- */}
      <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-[10px] tracking-widest italic">
            <Info size={14} className="text-indigo-600" /> Data Orchestration
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            The pipeline automates the transition from <strong className="text-slate-900">Raw CSVs</strong> to <strong className="text-slate-900">Production Artifacts</strong>. It performs feature engineering (Lag-variables) and ABC segmentation before persisting the weights in <code className="bg-slate-200 px-1 rounded text-[10px]">sku_models.pkl</code>.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-[10px] tracking-widest italic">
            <Share2 size={14} className="text-indigo-600" /> Hybrid Deployment
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Next.js assets and the UI are served via <strong className="text-slate-900">Vercel’s Edge Network</strong> for ultra-low latency, while the FastAPI modeling core runs on <strong className="text-slate-900">Render</strong> to handle heavy SciPy/NumPy computations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-8" />

        {Array.isArray(status) && status.length > 0 ? status.map((item, idx) => (
          <div key={idx} className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all group">
            <div className="flex justify-between items-start mb-8">
               <div className="bg-slate-50 p-4 rounded-2xl text-indigo-600 group-hover:rotate-12 transition-transform shadow-sm">
                  {getIcon(item.icon_type)}
               </div>
               <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                  <span className={`text-[9px] font-black uppercase ${item.status === 'Active' ? 'text-emerald-700' : 'text-rose-700'}`}>{item.status}</span>
               </div>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">{item.step}</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{item.desc}</p>
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Latency: 14ms</span>
               <CheckCircle2 size={16} className={item.status === 'Active' ? "text-emerald-500" : "text-slate-200"} />
            </div>
          </div>
        )) : (
          <div className="col-span-3 py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Initializing Live Connection...</p>
          </div>
        )}
      </div>

      {/* Infrastructure Card */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
           <Globe size={240} className="text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Cloud Infrastructure</h3>
            <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
              NovaCart utilizes a hybrid cloud model. Next.js assets are served at the edge via <strong className="text-white">Vercel</strong>, while the Python Modeling Core is managed in <strong className="text-white">Render</strong> containers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <InfraMetric label="Uptime" val="99.9%" />
            <InfraMetric label="Compute" val="vCPU-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfraMetric({ label, val }: { label: string, val: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center backdrop-blur-sm">
      <p className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest">{label}</p>
      <p className="text-2xl font-black text-white italic">{val}</p>
    </div>
  );
}