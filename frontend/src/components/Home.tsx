"use client";
import React from 'react';
import { 
  ShieldCheck, AlertTriangle, ArrowUpRight, Zap, 
  Activity, Info, ChevronRight, Package, DollarSign, Target 
} from 'lucide-react';

export default function HomeSection({ onNavigate }: any) {
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- 1. PROJECT OVERVIEW --- */}
      <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">NovaCart Architecture</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            A stochastic inventory engine that bridges the gap between <strong className="text-slate-900 font-black">Predictive Analytics</strong> and <strong className="text-slate-900 font-black">Operational Execution</strong>.
          </p>
        </div>
      </div>

      {/* --- 2. CLICKABLE KPI STRIP (DRILL-DOWN) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIButton 
          title="Stockout Rate" val="2.1%" change="-0.5%" 
          icon={<AlertTriangle size={16}/>} color="rose"
          onClick={() => onNavigate('optimizer')} 
        />
        <KPIButton 
          title="Holding Cost" val="$14.2k" change="+3%" 
          icon={<DollarSign size={16}/>} color="indigo"
          onClick={() => onNavigate('optimization')} 
        />
        <KPIButton 
          title="Inv. Turnover" val="8.4x" change="+12%" 
          icon={<Activity size={16}/>} color="emerald"
          onClick={() => onNavigate('data-lab')} 
        />
        <KPIButton 
          title="Dead Stock" val="4.8%" change="-1.2%" 
          icon={<Package size={16}/>} color="amber"
          onClick={() => onNavigate('data-lab')} 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- 3. HEALTH SCORE BREAKDOWN --- */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Inventory Health</h2>
              <span className="text-5xl font-black text-indigo-400 italic">92</span>
            </div>

            <div className="space-y-5">
               <ScoreBar label="Service Level Coverage" val="96%" weight="40%" color="bg-indigo-500" />
               <ScoreBar label="Inventory Turnover" val="82%" weight="30%" color="bg-emerald-500" />
               <ScoreBar label="Cost Efficiency" val="88%" weight="30%" color="bg-blue-500" />
            </div>

            <div className="pt-6 border-t border-slate-800">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
                  The health score is a weighted index balancing <strong className="text-slate-300">Service Reliability</strong> vs <strong className="text-slate-300">Capital Lock-up</strong>.
               </p>
            </div>
          </div>
        </div>

        {/* --- 4. ACTION FEED (PRIORITIZED) --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3 italic">
            <Zap size={14} className="text-indigo-600" /> Priority Action Feed
          </h3>
          
          <ActionCard 
            title="Increase Safety Stock" 
            impact="High Risk"
            desc="Demand volatility surged 12.4% for SKU-A01. Increase buffer by +15% to maintain 95% service."
            btnLabel="Adjust ROP"
            onAction={() => onNavigate('optimizer', { avg_demand: 180, demand_std: 55 })}
          />

          {/* --- 5. TOP SKUs DRIVING RISK (TABLE) --- */}
          <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/30 overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Top Risk Drivers</h4>
                <Target size={14} className="text-slate-300" />
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
                   <RiskRow id="NOV-001" issue="High CV (0.42)" impact="-12% Service" color="text-rose-600" />
                   <RiskRow id="NOV-042" issue="Lead Time Delay" impact="+8% Holding" color="text-amber-600" />
                   <RiskRow id="NOV-089" issue="Overstocked" impact="Capital Lock" color="text-indigo-600" />
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

function KPIButton({ title, val, change, up, icon, color, onClick }: any) {
  const colors: any = {
    rose: 'hover:border-rose-200 group-hover:text-rose-600',
    indigo: 'hover:border-indigo-200 group-hover:text-indigo-600',
    emerald: 'hover:border-emerald-200 group-hover:text-emerald-600',
    amber: 'hover:border-amber-200 group-hover:text-amber-600',
  };

  return (
    <button onClick={onClick} className={`bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all group text-left w-full ${colors[color]}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-slate-900 transition-all">{icon}</div>
        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{val}</h4>
    </button>
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
        <div className={`h-full ${color}`} style={{ width: val }} />
      </div>
    </div>
  );
}

function ActionCard({ title, impact, desc, btnLabel, onAction }: any) {
  return (
    <div className="p-8 rounded-[3rem] border-2 bg-indigo-50 border-indigo-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 hover:scale-[1.01] transition-transform">
      <div className="space-y-2 text-center md:text-left">
        <div className="flex items-center gap-2 justify-center md:justify-start">
           <h4 className="text-sm font-black uppercase tracking-tighter text-indigo-900">{title}</h4>
           <span className="text-[8px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">{impact}</span>
        </div>
        <p className="text-xs font-medium text-indigo-700/70 max-w-sm leading-relaxed">{desc}</p>
      </div>
      <button onClick={onAction} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shrink-0">
        {btnLabel} <ChevronRight size={12} />
      </button>
    </div>
  );
}

function RiskRow({ id, issue, impact, color }: any) {
  return (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="py-4 text-slate-900 font-black italic">{id}</td>
      <td className="py-4 text-slate-500 font-medium">{issue}</td>
      <td className={`py-4 text-right font-black ${color}`}>{impact}</td>
    </tr>
  );
}