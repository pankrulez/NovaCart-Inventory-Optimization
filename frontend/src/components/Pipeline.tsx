"use client";
import React, { useEffect, useState } from 'react';
import { Activity, Database, Cpu, CheckCircle2, Server, Globe, Zap, Info, Share2, RefreshCw } from 'lucide-react';

export default function PipelineSection() {
  const [status, setStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';

  const fetchPipeline = async () => {
    setLoading(true);
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

  useEffect(() => {
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
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">System Pipeline</h2>
          <p className="text-slate-500 font-medium italic">Architectural flow of the NovaCart stack.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-indigo-300 px-6 py-3.5 rounded-2xl flex items-center gap-3 border border-slate-700 shadow-xl shadow-indigo-900/20 group-hover:shadow-indigo-500/30 transition-shadow duration-300">
             <Server size={18} className="text-indigo-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white">Production Node: Render-01</span>
          </div>
          <button 
            onClick={fetchPipeline}
            disabled={loading}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors px-2 disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh Status
          </button>
        </div>
      </div>

      {/* --- SYSTEM FLOW SUMMARY --- */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/60 p-8 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-8 shadow-lg shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-800 font-black uppercase text-[10px] tracking-widest italic">
            <Info size={14} className="text-indigo-600 animate-pulse" /> Data Orchestration
          </div>
          <p className="text-[11px] text-indigo-900/70 leading-relaxed font-medium">
            The pipeline automates the transition from <strong className="text-indigo-900">Raw CSVs</strong> to <strong className="text-indigo-900">Production Artifacts</strong>. It performs feature engineering (Lag-variables) and ABC segmentation before persisting the weights in <code className="bg-white px-1.5 py-0.5 rounded text-[10px] text-indigo-800 border border-indigo-200 shadow-sm">sku_models.pkl</code>.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-800 font-black uppercase text-[10px] tracking-widest italic">
            <Share2 size={14} className="text-indigo-600" /> Hybrid Deployment
          </div>
          <p className="text-[11px] text-indigo-900/70 leading-relaxed font-medium">
            Next.js assets and the UI are served via <strong className="text-indigo-900">Vercel’s Edge Network</strong> for ultra-low latency, while the FastAPI modeling core runs on <strong className="text-indigo-900">Render</strong> to handle heavy SciPy/NumPy computations.
          </p>
        </div>
      </div>

      {/* --- PIPELINE NODES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10 -translate-y-8" />

        {Array.isArray(status) && status.length > 0 ? status.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group cursor-default">
            <div className="flex justify-between items-start mb-8">
               <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  {getIcon(item.icon_type)}
               </div>
               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-inner ${item.status === 'Active' ? 'bg-emerald-50 border-emerald-200/60' : 'bg-rose-50 border-rose-200/60'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'text-emerald-700' : 'text-rose-700'}`}>{item.status}</span>
               </div>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter group-hover:text-indigo-900 transition-colors">{item.step}</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{item.desc}</p>
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-slate-500 transition-colors">Latency: 14ms</span>
               <CheckCircle2 size={16} className={item.status === 'Active' ? "text-emerald-500 group-hover:scale-110 transition-transform" : "text-slate-300"} />
            </div>
          </div>
        )) : (
          <div className="col-span-3 py-24 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-300 shadow-sm flex flex-col items-center justify-center">
             <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mb-4 opacity-50" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Initializing Live Connection...</p>
          </div>
        )}
      </div>

      {/* --- INFRASTRUCTURE CARD --- */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[3.5rem] p-12 border border-slate-700/50 shadow-2xl shadow-indigo-900/20 relative overflow-hidden group hover:shadow-indigo-500/20 transition-all duration-500">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
           <Globe size={300} className="text-indigo-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Cloud Infrastructure</h3>
            <p className="text-indigo-200/70 text-sm max-w-md font-medium leading-relaxed">
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
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center backdrop-blur-sm shadow-inner group-hover:bg-white/10 transition-colors duration-300">
      <p className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest">{label}</p>
      <p className="text-2xl font-black text-white italic">{val}</p>
    </div>
  );
}