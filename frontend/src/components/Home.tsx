"use client";
import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, Zap, Activity, ChevronRight, Box, DollarSign, Package } from 'lucide-react';

export default function HomeSection({ onNavigate }: any) {
  const [stats, setStats] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Dashboard Sync Error:", err));
  }, [API_URL]);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      
      {/* --- KPI BUTTONS: ICON TURNS BLACK ON HOVER --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIButton title="Stockout Rate" val={stats?.stockout_rate} icon={<AlertTriangle size={16}/>} onClick={() => onNavigate('optimizer')} />
        <KPIButton title="Holding Cost" val={stats?.holding_cost} icon={<DollarSign size={16}/>} onClick={() => onNavigate('optimization')} />
        <KPIButton title="Inv. Turnover" val={stats?.turnover} icon={<Activity size={16}/>} onClick={() => onNavigate('data-lab')} />
        <KPIButton title="Dead Stock" val="4.8%" icon={<Package size={16}/>} onClick={() => onNavigate('data-lab')} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- HEALTH SCORE --- */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative border border-slate-800">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Inventory Health</h2>
              <span className="text-6xl font-black text-indigo-400 italic">{stats?.health_score ?? "--"}</span>
            </div>
            <div className="space-y-6">
               {stats?.health_metrics.map((m: any, i: number) => (
                 <ScoreBar key={i} label={m.label} val={m.val} weight={m.weight} />
               ))}
            </div>
          </div>
        </div>

        {/* --- DYNAMIC ACTION FEED --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
           {stats?.action_item && (
             <ActionCard 
                title={stats.action_item.title} 
                desc={stats.action_item.desc}
                onAction={() => onNavigate('optimizer', stats.action_item.params)}
             />
           )}
           <RiskTable risks={stats?.risk_skus} />
        </div>
      </div>
    </div>
  );
}

function KPIButton({ title, val, icon, onClick }: any) {
  return (
    <button onClick={onClick} className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-lg group text-left w-full hover:border-slate-300 transition-all">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{val ?? "--"}</h4>
    </button>
  );
}

function ScoreBar({ label, val, weight }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase">
        <span className="text-slate-400">{label} <span className="text-slate-600 ml-1 italic">({weight})</span></span>
        <span className="text-white">{val}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500" style={{ width: val }} />
      </div>
    </div>
  );
}

function ActionCard({ title, desc, onAction }: any) {
  return (
    <div className="p-8 rounded-[3rem] border-2 bg-indigo-50 border-indigo-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 hover:scale-[1.01] transition-transform">
      <div className="space-y-2">
        <h4 className="text-sm font-black uppercase tracking-tighter text-indigo-900">{title}</h4>
        <p className="text-xs font-medium text-indigo-700/70 max-w-sm">{desc}</p>
      </div>
      <button onClick={onAction} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg">
        Execute ROP Adjust
      </button>
    </div>
  );
}

function RiskTable({ risks }: any) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-xl">
      <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest italic">Risk Driver Diagnostics</h4>
      <table className="w-full">
        <tbody className="text-xs font-bold text-slate-700">
          {risks?.map((risk: any, i: number) => (
            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="py-4 font-black italic">{risk.id}</td>
              <td className="py-4 text-slate-500">{risk.issue}</td>
              <td className="py-4 text-right text-rose-600 font-black">{risk.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}