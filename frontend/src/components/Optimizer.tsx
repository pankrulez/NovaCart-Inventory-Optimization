import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Activity, RefreshCcw, DollarSign, ShieldCheck, TrendingUp } from 'lucide-react';

export default function OptimizerSection({ inputs, setInputs, handleSimulate, simData, loading }: any) {
  
  // Real Business Logic for the UI
  const financialImpact = useMemo(() => {
    if (!simData) return null;
    return {
        holding_cost: simData.metrics.ss * 25, // Using backend metrics
        reliability: (100 - simData.metrics.risk).toFixed(1)
    };
  }, [simData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Real Metric Highlights */}
      {simData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 text-white p-8 rounded-[2rem] shadow-xl">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Annual Holding Cost</p>
            <h4 className="text-3xl font-bold">${financialImpact?.holding_cost.toLocaleString()}</h4>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Stock</p>
            <h4 className="text-3xl font-bold text-slate-900">{simData.metrics.ss} Units</h4>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stockout Probability</p>
            <h4 className="text-3xl font-bold text-rose-500">{simData.metrics.risk}%</h4>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Controls */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8 italic">Model Inputs</h3>
          <div className="space-y-5">
            <InputItem label="Avg Demand" val={inputs.avg_demand} fn={(v: number) => setInputs({...inputs, avg_demand: v})} />
            <InputItem label="Demand σ" val={inputs.demand_std} fn={(v: number) => setInputs({...inputs, demand_std: v})} />
            <InputItem label="Lead Time (Days)" val={inputs.avg_lead_time} fn={(v: number) => setInputs({...inputs, avg_lead_time: v})} />
            
            <div className="pt-4 border-t border-slate-100">
               <label className="text-[10px] font-black text-indigo-600 uppercase mb-4 block">Target Service: {Math.round(inputs.service_level * 100)}%</label>
               <input type="range" min="0.80" max="0.99" step="0.01" value={inputs.service_level} 
                onChange={(e) => setInputs({...inputs, service_level: parseFloat(e.target.value)})}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>

            <button onClick={handleSimulate} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
              {loading ? <RefreshCcw className="animate-spin" /> : "COMPUTE MODEL"}
            </button>
          </div>
        </div>

        {/* Real Dynamic Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm h-[500px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900">Stochastic Demand Curve</h3>
            {simData && (
              <div className="text-right">
                <span className="text-[10px] font-black text-indigo-600 uppercase">System ROP</span>
                <p className="text-4xl font-black text-slate-900 leading-none">{Math.round(simData.metrics.rop)}</p>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simData?.chart || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="x" hide />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="y" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} strokeWidth={4} />
              {simData && <ReferenceLine x={simData.metrics.rop} stroke="#F43F5E" strokeDasharray="8 8" strokeWidth={2} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function InputItem({ label, val, fn }: any) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">{label}</label>
      <input type="number" value={val} onChange={(e) => fn(parseFloat(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
    </div>
  );
}