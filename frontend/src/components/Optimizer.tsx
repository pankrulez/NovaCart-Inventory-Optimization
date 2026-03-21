"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ReferenceLine, CartesianGrid 
} from 'recharts';
import { 
  Activity, RefreshCcw, AlertTriangle, Zap, 
  Clock, ArrowRight, ShieldCheck, Info 
} from 'lucide-react';

export default function OptimizerSection({ inputs, setInputs, handleSimulate, simData, loading }: any) {
  
  const chartData = simData?.chart_points || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- 1. DYNAMIC PRIORITY TABLE --- */}
      <div className="bg-white border-2 border-slate-100 rounded-[3rem] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Urgency Ranking</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Prioritized by Days to Stockout</p>
          </div>
          <button onClick={handleSimulate} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg">
            {loading ? <RefreshCcw className="animate-spin" size={14}/> : <><RefreshCcw size={14}/> Refresh Engine</>}
          </button>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border-b border-slate-100">
              <th className="px-8 py-5">SKU ID</th>
              <th className="px-8 py-5">Reorder Point (ROP)</th>
              <th className="px-8 py-5">Safety Stock</th>
              <th className="px-8 py-5">Risk %</th>
              <th className="px-8 py-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {/* Real Data Row Example */}
            <PriorityRow 
              sku="NOV-772" 
              rop={simData?.reorder_point || 982} 
              ss={simData?.safety_stock || 140} 
              risk={`${simData?.risk_percent || 5}%`}
              days={3} 
              isHighVariance={true}
            />
            <PriorityRow 
              sku="NOV-104" 
              rop={450} 
              ss={62} 
              risk="2.4%"
              days={12} 
              isHighVariance={false}
            />
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- 2. THE DISTRIBUTION INSIGHT LAYER --- */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 italic flex items-center gap-3 uppercase text-xs">
               <Activity className="text-indigo-600" size={18} /> Probability Density
            </h3>
            {simData && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 text-[10px] font-black uppercase ${ (inputs.demand_std / inputs.avg_demand) > 0.3 ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                {(inputs.demand_std / inputs.avg_demand) > 0.3 ? <><AlertTriangle size={14}/> High Variance: Increase Buffer</> : <><ShieldCheck size={14}/> Stable SKU: Lean Inventory</>}
              </div>
            )}
          </div>
          
          <div className="h-[300px] w-full bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
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
                  <XAxis dataKey="demand" tick={{fontSize: 10}} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="prob" stroke="#4f46e5" strokeWidth={4} fill="url(#colorProb)" />
                  <ReferenceLine x={simData.reorder_point} stroke="#F43F5E" strokeDasharray="8 8" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Awaiting Simulation</div>}
          </div>
        </div>

        {/* --- 3. PARAMETERS & ACTION LAYER --- */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Optimization Inputs</p>
            <div className="space-y-5">
              <InputItem label="Avg Demand" val={inputs.avg_demand} fn={(v: number) => setInputs({...inputs, avg_demand: v})} />
              <InputItem label="Demand σ" val={inputs.demand_std} fn={(v: number) => setInputs({...inputs, demand_std: v})} />
              <div className="pt-4">
                <button 
                  onClick={handleSimulate} 
                  className="w-full bg-indigo-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                >
                  Apply Stochastic Fix
                </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-100 p-8 rounded-[2.5rem] shadow-lg">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600 p-2 rounded-lg text-white"><Clock size={16}/></div>
                <h4 className="text-xs font-black text-indigo-900 uppercase">Action Protocol</h4>
             </div>
             <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
               {simData?.reorder_point > 800 ? 
                 "System recommends reordering within **3 days**. High variance detected; increase buffer by 15% to safeguard service levels." : 
                 "Inventory levels are stable. Maintain current replenishment cycle."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function PriorityRow({ sku, rop, ss, risk, days, isHighVariance }: any) {
  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-8 py-5 text-sm font-black text-slate-900 italic">{sku}</td>
      <td className="px-8 py-5 text-sm font-bold text-slate-600">{rop} Units</td>
      <td className="px-8 py-5 text-sm font-bold text-slate-600">{ss} Buffer</td>
      <td className="px-8 py-5 text-sm font-black text-rose-500">{risk}</td>
      <td className="px-8 py-5 text-right">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${days < 5 ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
          {days < 5 ? <Zap size={10}/> : <Clock size={10}/>} {days} Days Left
        </div>
      </td>
    </tr>
  );
}

function InputItem({ label, val, fn }: any) {
  return (
    <div>
      <label className="text-[9px] font-black text-slate-500 uppercase block mb-2 tracking-widest">{label}</label>
      <input 
        type="number" 
        value={val} 
        onChange={(e) => fn(parseFloat(e.target.value) || 0)} 
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 font-black text-white outline-none focus:border-indigo-500 transition-all text-sm" 
      />
    </div>
  );
}