"use client";
import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Zap, Activity, 
  ChevronRight, Package, DollarSign, Box, Loader2, Info
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function HomeSection({ onNavigate }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';

  const trendData = [
    { name: 'M', value: 400 }, { name: 'T', value: 300 },
    { name: 'W', value: 600 }, { name: 'T', value: 800 },
    { name: 'F', value: 500 }, { name: 'S', value: 900 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/stats`);
        if (!res.ok) throw new Error("Pipeline data not initialized");
        const data = await res.json();
        setStats(data);
        setError(false);
      } catch (err) {
        console.error("📊 Dashboard Sync Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API_URL]);

  if (loading) return (
    <div className="h-96 w-full flex flex-col items-center justify-center space-y-4 text-slate-400">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="font-black uppercase tracking-widest text-[10px]">Syncing Pipeline Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- 1. ARCHITECTURE OVERVIEW (GLASS) --- */}
      <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Box size={180} className="text-indigo-400" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">NovaCart Architecture</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            Real-time stochastic optimization utilizing <strong className="text-white font-black">SciPy</strong> and <strong className="text-white font-black">FastAPI</strong>. 
            Data is currently served directly from your <strong className="text-indigo-400 font-black">Production Pipeline</strong> artifacts.
          </p>
        </div>
      </div>

      {/* --- INFERENCE ENGINE SUMMARY (DUAL GLASS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[2.5rem] border-l-4 border-indigo-500/50 space-y-3 hover:bg-white/5 transition-all">
          <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-widest">
            <Info size={14} /> Intelligence Overview
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            The <strong className="text-white font-black text-[12px]">Inventory Health Score</strong> is calculated by taking the inverse of the <strong className="text-indigo-400">Coefficient of Variation (CV)</strong> across all SKUs. If demand fluctuates in the raw dataset, this score drops.
          </p>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] border-l-4 border-emerald-500/50 space-y-3 hover:bg-white/5 transition-all">
          <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-[10px] tracking-widest">
            <Zap size={14} /> Priority Logic
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Our <strong className="text-white font-black text-[12px]">Action Feed</strong> identifies the "Worst SKU" by sorting processed data for highest volatility, ensuring operational focus is directed to critical stockout threats.
          </p>
        </div>
      </div>

      {/* --- 2. KPI CARDS (STAGGERED GLASS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Stockout Rate" val={stats?.stockout_rate || "N/A"} icon={<AlertTriangle size={16}/>} accent="rose" />
        <KPICard title="Holding Cost" val={stats?.holding_cost || "N/A"} icon={<DollarSign size={16}/>} accent="indigo" />
        <KPICard title="Inv. Turnover" val={stats?.turnover || "N/A"} icon={<Activity size={16}/>} accent="emerald" />
        <KPICard title="Dead Stock" val="4.8%" icon={<Package size={16}/>} accent="amber" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- 4. DYNAMIC HEALTH SCORE (DEEP GLASS) --- */}
        <div className="col-span-12 lg:col-span-5 glass-card rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
             <ShieldCheck size={280} />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Inventory Health</h2>
              <span className="text-6xl font-black text-indigo-400 italic drop-shadow-[0_0_15px_rgba(129,140,248,0.4)]">
                {stats?.health_score ?? (error ? "0" : "--")}
              </span>
            </div>
            <div className="space-y-6">
               {(stats?.health_metrics || [
                 {label: "Service Level Coverage", val: "0%", weight: "40%"},
                 {label: "Inventory Turnover", val: "0%", weight: "30%"},
                 {label: "Cost Efficiency", val: "0%", weight: "30%"}
               ]).map((m: any, i: number) => (
                 <ScoreBar key={i} label={m.label} val={m.val} weight={m.weight} />
               ))}
            </div>
          </div>
        </div>

        {/* --- 5. ACTION FEED & RISK TABLE (GLASS LIST) --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-3 italic">
            <Zap size={14} className="text-indigo-400" /> Priority Action Feed
          </h3>
          
          {stats?.action_item ? (
            <ActionCard 
              title={stats.action_item.title} 
              desc={stats.action_item.desc}
              onAction={() => onNavigate('optimizer', stats.action_item.params)}
            />
          ) : (
            <div className="p-10 rounded-[3rem] border-2 border-dashed border-white/5 bg-white/5 text-slate-600 text-center uppercase font-black text-[10px] tracking-widest">
               Waiting for Pipeline Analysis...
            </div>
          )}

          <div className="glass-card rounded-[2.5rem] p-8">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Risk Driver Diagnostics</h4>
             </div>
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[9px] font-black text-slate-500 uppercase tracking-tighter border-b border-white/5">
                      <th className="pb-3">SKU ID</th>
                      <th className="pb-3">Primary Issue</th>
                      <th className="pb-3 text-right">Impact</th>
                   </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-300">
                   {stats?.risk_skus?.map((risk: any, i: number) => (
                      <RiskRow 
                        key={i} 
                        id={risk.SKU || risk.id} 
                        issue={typeof risk.issue === 'number' ? `CV: ${risk.issue.toFixed(2)}` : risk.issue} 
                        impact="Critical" 
                        color="text-rose-400" 
                      />
                   )) || (
                     <tr><td colSpan={3} className="py-8 text-center text-slate-600 italic">No Active Risks</td></tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (CINEMATIC VARIANTS) ---

function KPICard({ title, val, icon, accent }: any) {
  const accents: any = {
    rose: 'text-rose-400 bg-rose-400/10 hover:bg-rose-400 hover:text-white',
    indigo: 'text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400 hover:text-white',
    emerald: 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400 hover:text-white',
    amber: 'text-amber-400 bg-amber-400/10 hover:bg-amber-400 hover:text-white',
  };

  return (
    <div className="glass-card p-8 rounded-[2.5rem] text-left w-full group overflow-hidden">
      <div className={`p-3 rounded-2xl w-fit mb-6 shadow-sm transition-all duration-500 ${accents[accent]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-white tracking-tighter italic">{val}</h4>
    </div>
  );
}

function ScoreBar({ label, val, weight }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
        <span className="text-slate-500">{label} <span className="text-slate-700 ml-1 italic">({weight})</span></span>
        <span className="text-white">{val}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: val }} />
      </div>
    </div>
  );
}

function ActionCard({ title, desc, onAction }: any) {
  return (
    <div className="p-8 rounded-[3rem] border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500/60 transition-all group">
      <div className="space-y-2 text-left">
        <h4 className="text-sm font-black uppercase tracking-tighter text-indigo-400 group-hover:text-indigo-300 transition-colors">{title}</h4>
        <p className="text-xs font-medium text-slate-400 max-w-sm leading-relaxed">{desc}</p>
      </div>
      <button onClick={onAction} className="bg-indigo-600 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-500/20 active:scale-95">
        Execute Adjustment <ChevronRight size={12} />
      </button>
    </div>
  );
}

function RiskRow({ id, issue, impact, color }: any) {
  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
      <td className="py-4 text-white font-black italic">{id}</td>
      <td className="py-4 text-slate-400 font-medium">{issue}</td>
      <td className={`py-4 text-right font-black uppercase tracking-widest text-[10px] ${color}`}>{impact}</td>
    </tr>
  );
}