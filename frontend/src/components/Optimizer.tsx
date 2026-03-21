import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Activity, RefreshCcw, Package, AlertTriangle, Info } from 'lucide-react';

export default function OptimizerSection({ inputs, setInputs, handleSimulate, simData, loading }: any) {
  
  // Debug: If you see "Data received" in your browser console, the connection is working
  if (simData) console.log("Model Output:", simData);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Safety Stock" 
          val={simData?.metrics?.safety_stock} 
          icon={<Package className="text-indigo-600"/>} 
          suffix=" units" 
        />
        <StatCard 
          title="Reorder Point" 
          val={simData?.metrics?.reorder_point} 
          icon={<Activity className="text-blue-600"/>} 
          suffix=" units" 
        />
        <StatCard 
          title="Stockout Risk" 
          val={simData?.metrics?.risk_percent} 
          icon={<AlertTriangle className="text-rose-600"/>} 
          suffix="%" 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- INPUT PANEL --- */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8 italic text-center md:text-left">Model Inputs</h3>
          <div className="space-y-5">
            <InputItem label="Avg Demand" val={inputs.avg_demand} fn={(v) => setInputs({...inputs, avg_demand: v})} />
            <InputItem label="Demand σ" val={inputs.demand_std} fn={(v) => setInputs({...inputs, demand_std: v})} />
            <InputItem label="Lead Time" val={inputs.avg_lead_time} fn={(v) => setInputs({...inputs, avg_lead_time: v})} />
            <InputItem label="Lead Time σ" val={inputs.lead_time_std} fn={(v) => setInputs({...inputs, lead_time_std: v})} />
            
            <div className="pt-4 border-t border-slate-100">
               <label className="text-[10px] font-black text-indigo-600 uppercase mb-4 block">Target Service: {Math.round(inputs.service_level * 100)}%</label>
               <input type="range" min="0.80" max="0.99" step="0.01" value={inputs.service_level} 
                onChange={(e) => setInputs({...inputs, service_level: parseFloat(e.target.value)})}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>

            <button onClick={handleSimulate} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
              {loading ? <RefreshCcw className="animate-spin" /> : "RUN STOCHASTIC ENGINE"}
            </button>
          </div>
        </div>

        {/* --- CHART PANEL --- */}
        <div className="col-span-12 lg:col-span-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px]">
          <h3 className="font-bold text-slate-800 mb-8 italic">Demand Probability Curve</h3>
          
          <div className="h-[300px] w-full">
            {simData?.chart_data ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simData.chart_data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="demand" 
                    type="number" 
                    domain={['auto', 'auto']}
                    tick={{fontSize: 10, fill: '#94a3b8'}}
                    label={{ value: 'Demand Units (LT)', position: 'bottom', fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                  />
                  <YAxis hide width={0} />
                  <Tooltip 
                    labelFormatter={(value) => `Demand: ${Math.round(value)}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="prob" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} strokeWidth={4} />
                  {simData?.metrics?.reorder_point && (
                    <ReferenceLine 
                      x={simData.metrics.reorder_point} 
                      stroke="#F43F5E" 
                      strokeDasharray="8 8" 
                      strokeWidth={2}
                      label={{ position: 'top', value: 'ROP', fill: '#F43F5E', fontSize: 10, fontWeight: 'bold' }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2rem]">
                 <Activity size={48} className="mb-4 opacity-20" />
                 <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting Model Output</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-4">
             <Info className="text-indigo-500 shrink-0" size={20} />
             <p className="text-xs text-slate-600 leading-relaxed font-medium">
                The curve models demand variability during lead time. The <strong>Reorder Point (ROP)</strong> is set where the probability of demand exceeding stock equals your risk tolerance (Stockout Risk).
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ title, val, icon, suffix }: any) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 bg-slate-50 w-fit rounded-2xl mb-4">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h4 className="text-3xl font-black text-slate-900">
        {val !== undefined ? val : "--"}
        <span className="text-sm font-medium text-slate-400">{suffix}</span>
      </h4>
    </div>
  );
}

function InputItem({ label, val, fn }: { label: string; val: number; fn: (v: number) => void }) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">{label}</label>
      <input 
        type="number" 
        value={val} 
        onChange={(e) => fn(parseFloat(e.target.value) || 0)} 
        className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition-all" 
      />
    </div>
  );
}