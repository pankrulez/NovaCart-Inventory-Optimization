"use client";
import React from 'react';
import { 
  TrendingUp, AlertCircle, ShieldCheck, DollarSign, 
  ArrowUpRight, ArrowDownRight, Activity, Zap, BarChart 
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function HomeSection() {
  // Mock trend data for the mini-sparkline
  const trendData = [
    { name: 'Mon', value: 400 }, { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 }, { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 }, { name: 'Sat', value: 900 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- TOP ROW: KPI STRIP --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIItem title="Inv. Turnover" val="8.4x" change="+12%" up={true} icon={<Activity size={16}/>} />
        <KPIItem title="Stockout Rate" val="2.1%" change="-0.5%" up={true} icon={<AlertCircle size={16}/>} />
        <KPIItem title="Holding Cost" val="$14.2k" change="+3%" up={false} icon={<DollarSign size={16}/>} />
        <KPIItem title="Dead Stock" val="4.8%" change="-1.2%" up={true} icon={<BarChart size={16}/>} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- LEFT: INVENTORY HEALTH SCORE (THE HERO) --- */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
             <ShieldCheck size={280} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Operational Status</p>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Inventory Health</h2>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
                92
              </span>
              <div className="space-y-1">
                 <p className="text-emerald-400 font-black text-xl flex items-center gap-1">
                   <ArrowUpRight size={20}/> EXCELLENT
                 </p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weighted Efficiency Index</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <HealthMetric label="Service Level" val="96.4%" color="bg-indigo-500" />
               <HealthMetric label="Capital Efficiency" val="88.1%" color="bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* --- RIGHT: INSIGHT CARDS (DECISION LAYER) --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3 italic">
            <Zap size={14} className="text-indigo-600" /> Intelligence Feed
          </h3>
          
          <InsightCard 
            title="Stockout Risk WoW" 
            desc="Volatility increased 12% across North-East SKUs. Lead time variance is driving ROP shifts."
            stat="+12.4%" 
            isWarning={true}
          />

          <InsightCard 
            title="Revenue Concentration" 
            desc="Top 5 SKUs are now driving 60% of total revenue. Recommended: Increase Safety Stock buffer by 5%."
            stat="High" 
            isWarning={false}
          />

          {/* Mini Chart Integration */}
          <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/30 flex items-center justify-between">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Demand Trend</p>
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">Active Scaling</h4>
             </div>
             <div className="h-16 w-32">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function KPIItem({ title, val, change, up, icon }: any) {
  return (
    <div className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all group">
      <div className="flex justify-between items-center mb-4">
        <div className="bg-slate-50 p-2.5 rounded-xl text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change}
        </span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">{val}</h4>
    </div>
  );
}

function HealthMetric({ label, val, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-xl font-black text-white">{val}</span>
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
           <div className={`h-full ${color}`} style={{ width: val }} />
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, desc, stat, isWarning }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] border-2 flex items-center justify-between shadow-xl transition-all hover:scale-[1.01] ${isWarning ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
      <div className="space-y-1">
        <h4 className={`text-sm font-black uppercase tracking-tighter ${isWarning ? 'text-rose-900' : 'text-indigo-900'}`}>{title}</h4>
        <p className={`text-xs font-medium max-w-sm leading-relaxed ${isWarning ? 'text-rose-700/70' : 'text-indigo-700/70'}`}>{desc}</p>
      </div>
      <div className={`text-2xl font-black italic tracking-tighter ${isWarning ? 'text-rose-600' : 'text-indigo-600'}`}>
        {stat}
      </div>
    </div>
  );
}