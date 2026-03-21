"use client";
import React from 'react';
import { 
  TrendingUp, AlertCircle, ShieldCheck, DollarSign, 
  ArrowUpRight, Activity, Zap, BarChart, Info, Target, Box
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function HomeSection() {
  const trendData = [
    { name: 'M', value: 400 }, { name: 'T', value: 300 },
    { name: 'W', value: 600 }, { name: 'T', value: 800 },
    { name: 'F', value: 500 }, { name: 'S', value: 900 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- PROJECT OVERVIEW HEADER --- */}
      <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Box size={180} className="text-indigo-600" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">NovaCart: Adaptive Inventory Engine</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            An enterprise-grade supply chain solution utilizing **Stochastic Modeling** and **Economic Order Quantity (EOQ)** optimization. NovaCart analyzes demand volatility and lead-time variance to minimize holding costs 
            while maintaining a 95%+ service level across global catalogs.
          </p>
          <div className="flex gap-4">
            <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-indigo-100">Statistical Simulation</span>
            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100">Real-time Optimization</span>
          </div>
        </div>
      </div>

      {/* --- TOP ROW: KPI STRIP --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIItem title="Inv. Turnover" val="8.4x" change="+12%" up={true} icon={<Activity size={16}/>} />
        <KPIItem title="Stockout Rate" val="2.1%" change="-0.5%" up={true} icon={<AlertCircle size={16}/>} />
        <KPIItem title="Holding Cost" val="$14.2k" change="+3%" up={false} icon={<DollarSign size={16}/>} />
        <KPIItem title="Dead Stock" val="4.8%" change="-1.2%" up={true} icon={<BarChart size={16}/>} />
      </div>

      {/* --- METRIC DEFINITIONS (EXPLAINER) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2">
        <MetricDef label="Inventory Turnover" desc="How many times a year stock is sold and replaced." />
        <MetricDef label="Stockout Rate" desc="Percentage of items unavailable when a customer orders." />
        <MetricDef label="Holding Cost" desc="Total cost of storing unsold goods (warehouse, insurance)." />
        <MetricDef label="Dead Stock" desc="Items that haven't sold in 6 months; wasted capital." />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- LEFT: INVENTORY HEALTH SCORE --- */}
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
                 <p className="text-emerald-400 font-black text-xl flex items-center gap-1 uppercase tracking-tighter">
                   <ArrowUpRight size={20}/> Optimal
                 </p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weighted Efficiency Index</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <HealthMetric label="Service Level" val="96.4%" color="bg-indigo-500" tooltip="Probability of fulfilling all customer demand." />
               <HealthMetric label="Capital Efficiency" val="88.1%" color="bg-emerald-500" tooltip="Balance between inventory investment and profit." />
            </div>
          </div>
        </div>

        {/* --- RIGHT: INSIGHT CARDS (DECISION LAYER) --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3 italic font-bold">
            <Zap size={14} className="text-indigo-600" /> Intelligence Feed
          </h3>
          
          <InsightCard 
            title="Stockout Risk" 
            desc="Demand volatility increased 12.4% across high-margin SKUs. The ROP engine suggests increasing safety buffer."
            stat="+12.4%" 
            isWarning={true}
          />

          <InsightCard 
            title="Revenue Concentration" 
            desc="Top 5 items drive 60% of cashflow. Focus replenishment logic on these core SKUs to maintain momentum."
            stat="Concentrated" 
            isWarning={false}
          />

          {/* Mini Demand Chart */}
          <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/30 flex items-center justify-between group">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Demand Pulse</p>
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">Active Scaling</h4>
             </div>
             <div className="h-16 w-32 grayscale group-hover:grayscale-0 transition-all duration-500">
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

function MetricDef({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="p-3 border-l-2 border-slate-100 group hover:border-indigo-400 transition-colors">
      <h5 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">{label}</h5>
      <p className="text-[10px] text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
  );
}

function KPIItem({ title, val, change, up, icon }: any) {
  return (
    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all group">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl text-slate-900 group-hover:bg-slate-900 group-hover:text-indigo-400 transition-all">
          {icon}
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change}
        </span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{val}</h4>
    </div>
  );
}

function HealthMetric({ label, val, color, tooltip }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl group/tip relative">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
        {label} <Info size={10} className="opacity-40" />
      </p>
      <div className="flex items-center gap-4">
        <span className="text-xl font-black text-white italic">{val}</span>
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
           <div className={`h-full ${color}`} style={{ width: val }} />
        </div>
      </div>
      {/* Mini Tooltip */}
      <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-800 text-[9px] text-slate-300 rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none border border-slate-700">
        {tooltip}
      </div>
    </div>
  );
}

function InsightCard({ title, desc, stat, isWarning }: any) {
  return (
    <div className={`p-8 rounded-[3rem] border-2 flex items-center justify-between shadow-xl transition-all hover:translate-x-1 ${isWarning ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
      <div className="space-y-2">
        <h4 className={`text-sm font-black uppercase tracking-tighter ${isWarning ? 'text-rose-900' : 'text-indigo-900'}`}>{title}</h4>
        <p className={`text-xs font-medium max-w-sm leading-relaxed ${isWarning ? 'text-rose-700/70' : 'text-indigo-700/70'}`}>{desc}</p>
      </div>
      <div className={`text-2xl font-black italic tracking-tighter ${isWarning ? 'text-rose-600' : 'text-indigo-600'}`}>
        {stat}
      </div>
    </div>
  );
}