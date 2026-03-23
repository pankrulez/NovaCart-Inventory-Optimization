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
      <p className="font-black uppercase tracking-widest text-[10px] animate-pulse">Syncing Pipeline Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
      {/* --- 1. ARCHITECTURE OVERVIEW --- */}
      <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
          <Box size={180} className="text-indigo-600" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">NovaCart Architecture</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Real-time stochastic optimization utilizing <strong className="text-indigo-600 font-black">SciPy</strong> and <strong className="text-indigo-600 font-black">FastAPI</strong>. 
            Data is currently served directly from your <strong className="text-slate-900 font-black group-hover:text-indigo-600 transition-colors">Production Pipeline</strong> artifacts.
          </p>
        </div>
      </div>

      {/* --- INFERENCE ENGINE SUMMARY --- */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/60 p-8 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-8 shadow-lg shadow-indigo-100/50">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-black uppercase text-[10px] tracking-widest">
            <Info size={14} className="animate-pulse" /> Intelligence Overview
          </div>
          <p className="text-[11px] text-indigo-900/70 leading-relaxed font-medium">
            The <strong className="text-indigo-900 font-black text-[12px]">Inventory Health Score</strong> is calculated by taking the inverse of the <strong className="text-indigo-900">Coefficient of Variation (CV)</strong> across all SKUs. If demand becomes volatile in <code className="bg-white px-1.5 py-0.5 rounded text-indigo-800 shadow-sm border border-indigo-200">sales_fact.csv</code>, this score drops automatically.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-black uppercase text-[10px] tracking-widest">
            <Zap size={14} className="text-amber-500" /> Priority Logic
          </div>
          <p className="text-[11px] text-indigo-900/70 leading-relaxed font-medium">
            Our <strong className="text-indigo-900 font-black text-[12px]">Action Feed</strong> identifies the "Worst SKU" by sorting processed data for highest risk/volatility, ensuring operational focus is directed to critical stockout threats first.
          </p>
        </div>
      </div>

      {/* --- 2. STATIC KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Stockout Rate" val={stats?.stockout_rate || "N/A"} icon={<AlertTriangle size={16}/>} colorTheme="rose" />
        <KPICard title="Holding Cost" val={stats?.holding_cost || "N/A"} icon={<DollarSign size={16}/>} colorTheme="indigo" />
        <KPICard title="Inv. Turnover" val={stats?.turnover || "N/A"} icon={<Activity size={16}/>} colorTheme="emerald" />
        <KPICard title="Dead Stock" val="4.8%" icon={<Package size={16}/>} colorTheme="amber" />
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-center gap-4 text-rose-800 shadow-md shadow-rose-100/50">
           <AlertTriangle size={20} className="animate-pulse" />
           <p className="text-xs font-bold uppercase tracking-tight">
             Pipeline inactive. Run <code className="bg-white px-2 py-1 rounded shadow-sm border border-rose-200 text-rose-600">python -m backend.src.pipeline</code> to generate real data.
           </p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- 4. DYNAMIC HEALTH SCORE --- */}
        <div className="col-span-12 lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden border border-slate-600 group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <ShieldCheck size={280} className="text-indigo-300" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Inventory Health</h2>
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic drop-shadow-md">
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

        {/* --- 5. ACTION FEED & RISK TABLE --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3 italic">
            <Zap size={14} className="text-indigo-500" /> Priority Action Feed
          </h3>
          
          {stats?.action_item ? (
            <ActionCard 
              title={stats.action_item.title} 
              desc={stats.action_item.desc}
              onAction={() => onNavigate('optimizer', stats.action_item.params)}
            />
          ) : (
            <div className="p-10 rounded-[3rem] border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 text-center uppercase font-black text-[10px] tracking-widest shadow-inner">
               Waiting for Pipeline Analysis...
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/70 transition-shadow duration-300">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Risk Driver Diagnostics</h4>
                <div className="h-8 w-24 group">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                         <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#colorUv)" fillOpacity={0.2} strokeWidth={2} />
                         <defs>
                           <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                             <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[9px] font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">
                      <th className="pb-3">SKU ID</th>
                      <th className="pb-3">Primary Issue</th>
                      <th className="pb-3 text-right">Impact</th>
                   </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-700">
                   {stats?.risk_skus?.map((risk: any, i: number) => (
                      <RiskRow 
                        key={i} 
                        id={risk.SKU || risk.id} 
                        issue={typeof risk.issue === 'number' ? `CV: ${risk.issue.toFixed(2)}` : risk.issue} 
                        impact="Critical" 
                        color="text-rose-500" 
                      />
                   )) || (
                     <tr><td colSpan={3} className="py-8 text-center text-slate-400 italic font-medium">No Active Risks Detected</td></tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (VIBRANT THEME) ---

function KPICard({ title, val, icon, colorTheme }: any) {
  const themeStyles: any = {
    rose: "text-rose-600 bg-rose-50 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-rose-500/30",
    indigo: "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-indigo-500/30",
    emerald: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-emerald-500/30",
    amber: "text-amber-600 bg-amber-50 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-amber-500/30",
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-lg shadow-slate-200/40 text-left w-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out group cursor-default">
      <div className={`p-3 rounded-2xl w-fit mb-6 shadow-sm transition-all duration-300 ${themeStyles[colorTheme]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{val}</h4>
    </div>
  );
}

function ScoreBar({ label, val, weight }: any) {
  return (
    <div className="space-y-2 group">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
        <span className="text-slate-400 group-hover:text-indigo-200 transition-colors">{label} <span className="text-slate-500 ml-1 italic">({weight})</span></span>
        <span className="text-white">{val}</span>
      </div>
      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out relative" style={{ width: val }}>
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, onAction }: any) {
  return (
    <div className="p-8 rounded-[3rem] border border-indigo-200/60 bg-gradient-to-br from-indigo-50 to-white shadow-xl shadow-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300 group">
      <div className="space-y-2 text-left">
        <h4 className="text-sm font-black uppercase tracking-tighter text-indigo-900 group-hover:text-indigo-700 transition-colors">{title}</h4>
        <p className="text-xs font-medium text-indigo-700/70 max-w-sm leading-relaxed">{desc}</p>
      </div>
      <button onClick={onAction} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300 flex items-center gap-2 shrink-0 shadow-lg shadow-slate-900/20 active:scale-95">
        Execute Adjustment <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function RiskRow({ id, issue, impact, color }: any) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-rose-50/40 transition-colors duration-200 group">
      <td className="py-4 text-slate-900 font-black italic group-hover:text-rose-700 transition-colors">{id}</td>
      <td className="py-4 text-slate-500 font-medium group-hover:text-rose-600/80 transition-colors">{issue}</td>
      <td className={`py-4 text-right font-black uppercase tracking-widest text-[10px] ${color} flex items-center justify-end gap-2`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse hidden group-hover:block"></span> {impact}
      </td>
    </tr>
  );
}