"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ReferenceLine, CartesianGrid 
} from 'recharts';
import { 
  Activity, RefreshCcw, Package, AlertTriangle, Zap, Info 
} from 'lucide-react';

export default function OptimizerSection({ inputs, setInputs, handleSimulate, simData, loading }: any) {
  
  const chartData = simData?.chart_points || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- KPI SECTION: HIGH CONTRAST --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* DARK PRIMARY CARD: REORDER POINT */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Zap size={140} className="text-indigo-400" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Reorder Point (ROP)</p>
            <h4 className="text-6xl font-black text-white tracking-tighter">
              {simData?.reorder_point ?? "--"}
              <span className="text-sm font-medium text-slate-500 ml-2 italic">Units</span>
            </h4>
            <div className="mt-6 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Optimal Trigger Threshold</p>
            </div>
          </div>
        </div>

        {/* ACCENT CARD: SAFETY STOCK */}
        <StatCard 
          title="Safety Stock" 
          val={simData?.safety_stock} 
          icon={<Package className="text-white"/>} 
          bgColor="bg-indigo-600 shadow-indigo-200"
          suffix=" Buffer Units" 
        />

        {/* RISK CARD: STOCKOUT PROBABILITY */}
        <div className="bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-rose-500 p-3 rounded-2xl shadow-lg shadow-rose-200 text-white">
               <AlertTriangle size={20} />
            </div>
            <span className="bg-rose-200 text-rose-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">System Alert</span>
          </div>
          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Stockout Risk</p>
          <h3 className="text-4xl font-black text-rose-900 tracking-tighter">
            {simData?.risk_percent ?? "--"}%
          </h3>
          <p className="text-[10px] text-rose-600/60 font-medium mt-2 italic">Based on {Math.round(inputs.service_level * 100)}% Service Level</p>
        </div>
      </div>

      {/* --- MAIN INTERFACE GRID --- */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* PARAMETERS PANEL */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-2xl shadow-slate-200/50 h-fit">
          <div className="flex items-center gap-2 mb-8">
             <div className="w-1 h-5 bg-indigo-600 rounded-full" />
             <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-800 italic">Modeling Parameters</h3>
          </div>
          
          <div className="space-y-6">
            <InputItem label="Average Demand" val={inputs.avg_demand} fn={(v: number) => setInputs({...inputs, avg_demand: v})} />
            <InputItem label="Demand Volatility (σ)" val={inputs.demand_std} fn={(v: number) => setInputs({...inputs, demand_std: v})} />
            <InputItem label="Average Lead Time" val={inputs.avg_lead_time} fn={(v: number) => setInputs({...inputs, avg_lead_time: v})} />
            
            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between mb-4">
                 <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Target Service Level</label>
                 <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{Math.round(inputs.service_level * 100)}%</span>
               </div>
               <input 
                type="range" min="0.80" max="0.99" step="0.01" value={inputs.service_level} 
                onChange={(e) => setInputs({...inputs, service_level: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
               />
            </div>

            <button 
              onClick={handleSimulate} 
              disabled={loading} 
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCcw className="animate-spin" /> : "EXECUTE STOCHASTIC ENGINE"}
            </button>
          </div>
        </div>

        {/* VISUALIZATION PANEL */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/40 min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 italic flex items-center gap-3 uppercase text-xs tracking-tight">
               <Activity className="text-indigo-600" size={18} />
               Probability Density (Demand During Lead Time)
            </h3>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase border border-slate-100 px-3 py-1 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Normal Distribution
            </div>
          </div>
          
          <div className="h-[320px] w-full bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 relative">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="demand" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="prob" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorProb)" />
                  {simData?.reorder_point && (
                    <ReferenceLine 
                      x={simData.reorder_point} 
                      stroke="#F43F5E" 
                      strokeDasharray="8 8" 
                      strokeWidth={3} 
                      label={{ position: 'top', value: 'ROP', fill: '#F43F5E', fontSize: 10, fontWeight: 'bold' }} 
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                 <RefreshCcw size={48} className="mb-4 opacity-10" />
                 <p className="font-black uppercase tracking-[0.4em] text-[10px]">System Awaiting Input</p>
              </div>
            )}
          </div>

          {/* Logic Explanation Footer */}
          <div className="mt-8 p-6 bg-slate-900 rounded-[1.5rem] border border-slate-800 flex gap-4">
             <Info className="text-indigo-400 shrink-0" size={20} />
             <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                The **Reorder Point (ROP)** integrates your lead time uncertainty and demand fluctuations. 
                By setting a {Math.round(inputs.service_level * 100)}% service level, the engine calculates a safety buffer 
                to ensure you only risk a stockout {Math.round((1 - inputs.service_level) * 100)}% of the time.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * REUSABLE STAT CARD COMPONENT
 */
function StatCard({ title, val, icon, suffix, bgColor }: any) {
  return (
    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className={`p-3 ${bgColor || 'bg-slate-900'} w-fit rounded-2xl mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-4xl font-black text-slate-900 tracking-tighter italic">
        {val !== undefined ? val : "--"}
        <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-widest not-italic">{suffix}</span>
      </h4>
    </div>
  );
}

/**
 * REUSABLE INPUT COMPONENT
 */
function InputItem({ label, val, fn }: { label: string; val: number; fn: (v: number) => void }) {
  return (
    <div className="group">
      <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </label>
      <input 
        type="number" 
        value={val} 
        onChange={(e) => fn(parseFloat(e.target.value) || 0)} 
        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" 
      />
    </div>
  );
}