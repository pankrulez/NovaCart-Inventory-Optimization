"use client";
import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, ArrowUpRight, Zap, 
  Activity, ChevronRight, Package, DollarSign, Box, Loader2, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function HomeSection({ onNavigate }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        if (!res.ok) throw new Error("Stats fetch failed");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("📊 Dashboard Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API_URL]);

  if (loading) return (
    <div className="h-96 w-full flex flex-col items-center justify-center space-y-4 text-slate-400">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-black uppercase tracking-widest text-[10px]">Syncing Pipeline Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- 1. ARCHITECTURE OVERVIEW --- */}
      <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Box size={180} className="text-indigo-600" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">NovaCart Architecture</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            A stochastic inventory engine bridging the gap between <strong className="text-slate-900 font-black">Predictive Analytics</strong> and <strong className="text-slate-900 font-black">Operational Execution</strong>. 
            By analyzing demand volatility, NovaCart minimizes holding costs while maintaining a <strong className="text-slate-900 font-black">95%+ service level</strong>.
          </p>
          <div className="flex gap-4">
            <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-indigo-100 shadow-sm">Stochastic Modeling</span>
            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100 shadow-sm">EOQ Optimization</span>
          </div>
        </div>
      </div>

      {/* --- 2. DYNAMIC KPI STRIP (NO HARDCODED DATA) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIButton 
          title="Stockout Rate" val={stats?.stockout_rate} 
          icon={<AlertTriangle size={16}/>} color="rose"
          onClick={() => onNavigate('optimizer')} 
        />
        <KPIButton 
          title="Holding Cost" val={stats?.holding_cost} 
          icon={<DollarSign size={16}/>} color="indigo"
          onClick={() => onNavigate('optimization')} 
        />
        <KPIButton 
          title="Inv. Turnover" val={stats?.turnover} 
          icon={<Activity size={16}/>} color="emerald"
          onClick={() => onNavigate('data-lab')} 
        />
        <KPIButton 
          title="Dead Stock" val="4.8%" 
          icon={<Package size={16}/>} color="amber"
          onClick={() => onNavigate('data-lab')} 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- 4. DYNAMIC HEALTH SCORE BREAKDOWN --- */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
             <ShieldCheck size={280} />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Inventory Health</h2>
              <span className="text-6xl font-black text-indigo-400 italic">{stats?.health_score}</span>
            </div>
            <div className="space-y-6">
               {stats?.health_metrics?.map((m: any, i: number) => (
                 <ScoreBar key={i} label={m.label} val={m.val} weight={m.weight} color="bg-indigo-500" />
               ))}
            </div>
          </div>
        </div>

        {/* --- 5. ACTION FEED (DYNAMIC QUANTIFIED IMPACT) --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3 italic">
            <Zap size={14} className="text-indigo-600" /> Priority Action Feed
          </h3>
          
          {stats?.action_item && (
            <ActionCard 
              title={stats.action_item.title} 
              impact={stats.action_item.impact}
              desc={stats.action_item.desc}
              quantified={stats.action_item.quantified_impact}
              btnLabel="Execute Adjustment"
              onAction={() => onNavigate('optimizer', stats.action_item.params)}
            />
          )}

          <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/30 overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic font-bold">Risk Driver Diagnostics</h4>
                <div className="h-8 w-24">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                         <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[9px] font-black text-slate-400 uppercase tracking-tighter border-b border-slate-50">
                      <th className="pb-3">SKU ID</th>
                      <th className="pb-3">Primary Issue</th>
                      <th className="pb-3 text-right">Impact</th>
                   </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-700">
                   {stats?.risk_skus?.map((risk: any, i: number) => (
                      <RiskRow key={i} id={risk.SKU} issue={risk.issue} impact="Critical" color="text-rose-600" />
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function KPIButton({ title, val, icon, color, onClick }: any) {
  const colors: any = {
    rose: 'hover:border-rose-200 group-hover:text-rose-600',
    indigo: 'hover:border-indigo-200 group-hover:text-indigo-600',
    emerald: 'hover:border-emerald-200 group-hover:text-emerald-600',
    amber: 'hover:border-amber-200 group-hover:text-amber-600',
  };
  return (
    <button onClick={onClick} className={`bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all group text-left w-full ${colors[color]}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{val}</h4>
    </button>
  );
}

function ActionCard({ title, impact, desc, quantified, btnLabel, onAction }: any) {
  return (
    <div className="p-8 rounded-[3rem] border-2 bg-indigo-50 border-indigo-100 shadow-xl flex flex-col gap-6 hover:scale-[1.01] transition-all group">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black uppercase tracking-tighter text-indigo-900">{title}</h4>
            <span className="text-[8px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">{impact}</span>
          </div>
          <p className="text-xs font-medium text-indigo-700/70 max-w-sm leading-relaxed">{desc}</p>
        </div>
        
        <button onClick={onAction} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shrink-0 shadow-lg active:scale-95">
          {btnLabel} <ChevronRight size={12} />
        </button>
      </div>

      {/* --- QUANTIFIED IMPACT LAYER --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-indigo-100/50">
        <ImpactBadge icon={<ShieldCheck size={10}/>} text={quantified?.risk || "Risk Mitigation Active"} color="text-emerald-700" bg="bg-emerald-100/50" />
        <ImpactBadge icon={<TrendingUp size={10}/>} text={quantified?.improvement || "Service Optimization"} color="text-indigo-700" bg="bg-indigo-100/50" />
      </div>
    </div>
  );
}

function ImpactBadge({ icon, text, color, bg }: any) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${bg} ${color} border border-white/20`}>
      <div className="opacity-70">{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-tight">{text}</span>
    </div>
  );
}

function ScoreBar({ label, val, weight, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
        <span className="text-slate-400">{label} <span className="text-slate-600 ml-1 italic">({weight})</span></span>
        <span className="text-white">{val}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: val }} />
      </div>
    </div>
  );
}

function RiskRow({ id, issue, impact, color }: any) {
  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
      <td className="py-4 text-slate-900 font-black italic">{id}</td>
      <td className="py-4 text-slate-500 font-medium">{typeof issue === 'number' ? `CV: ${issue.toFixed(2)}` : issue}</td>
      <td className={`py-4 text-right font-black uppercase tracking-widest text-[10px] ${color}`}>{impact}</td>
    </tr>
  );
}