import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Activity, RefreshCcw, Info, DollarSign, TrendingUp } from 'lucide-react';

export default function OptimizerSection({ inputs, setInputs, handleSimulate, simData, loading }: any) {
  
  // Calculate financial impact based on industry averages (25% carrying cost)
  const financialMetrics = useMemo(() => {
    if (!simData) return null;
    const unit_cost = 50; // Assume $50 per unit for the demo
    const annual_carrying_rate = 0.25; 
    const safety_stock = simData.metrics.rop - (inputs.avg_demand * (inputs.avg_lead_time / 7)); 
    const holding_cost = Math.max(0, safety_stock * unit_cost * annual_carrying_rate);
    
    return {
      safety_stock: Math.round(safety_stock),
      holding_cost: holding_cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      risk_score: (inputs.service_level * 100).toFixed(1)
    };
  }, [simData, inputs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- FINANCIAL INSIGHT BAR --- */}
      {financialMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-200 flex items-center gap-5">
            <div className="bg-white/20 p-3 rounded-2xl"><DollarSign /></div>
            <div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Est. Annual Carrying Cost</p>
              <h4 className="text-2xl font-bold">{financialMetrics.holding_cost}</h4>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-5">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl"><TrendingUp /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safety Stock Units</p>
              <h4 className="text-2xl font-bold text-slate-900">{financialMetrics.safety_stock} Units</h4>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-5">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl"><ShieldCheck /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Level Reliability</p>
              <h4 className="text-2xl font-bold text-slate-900">{financialMetrics.risk_score}%</h4>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* --- CONTROLS --- */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Model Inputs</h3>
             <div className="group relative cursor-help">
                <Info size={14} className="text-slate-300" />
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-3 rounded-lg w-48 leading-relaxed">
                   The Z-Score is automatically calculated based on your target Service Level.
                </div>
             </div>
          </div>
          
          <div className="space-y-6">
            <InputGroup label="Weekly Avg Demand" value={inputs.avg_demand} onChange={(v: number) => setInputs({...inputs, avg_demand: v})} />
            <InputGroup label="Demand Std Dev (σ)" value={inputs.demand_std} onChange={(v: number) => setInputs({...inputs, demand_std: v})} />
            <InputGroup label="Lead Time (Days)" value={inputs.avg_lead_time} onChange={(v: number) => setInputs({...inputs, avg_lead_time: v})} />
            
            <div className="pt-4 border-t border-slate-100">
               <label className="text-[10px] font-black text-indigo-600 uppercase mb-4 block tracking-widest">Service Level Target: {Math.round(inputs.service_level * 100)}%</label>
               <input 
                type="range" min="0.80" max="0.99" step="0.01" 
                value={inputs.service_level} 
                onChange={(e) => setInputs({...inputs, service_level: parseFloat(e.target.value)})}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
            </div>

            <button onClick={handleSimulate} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 mt-4">
              {loading ? <RefreshCcw className="animate-spin" /> : "RECALCULATE ROP"}
            </button>
          </div>
        </div>

        {/* --- CHART --- */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] relative">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 italic">Demand Probability Curve</h3>
              <p className="text-xs font-medium text-slate-400">Safety stock is the area to the right of the mean.</p>
            </div>
            {simData && (
              <div className="text-right">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Calculated ROP</p>
                <p className="text-3xl font-black text-slate-900">{Math.round(simData.metrics.rop)} <span className="text-sm font-medium text-slate-400">units</span></p>
              </div>
            )}
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simData?.chart || []}>
                <defs>
                  <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="x" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="y" stroke="#4f46e5" strokeWidth={4} fill="url(#colorY)" />
                {simData && <ReferenceLine x={simData.metrics.rop} stroke="#F43F5E" strokeDasharray="8 8" strokeWidth={3} label={{ position: 'top', value: 'Reorder Point', fill: '#F43F5E', fontSize: 10, fontWeight: 'bold' }} />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InputGroup({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">{label}</label>
      <input 
        type="number" value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
      />
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-2xl">
        <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Probability Density</p>
        <p className="text-white font-bold">{payload[0].value.toFixed(4)}</p>
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-slate-400 text-[10px]">Impact: <strong>Stockout Risk Decreasing</strong></p>
        </div>
      </div>
    );
  }
  return null;
};

const ShieldCheck = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);