"use client";
import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, CheckCircle, AlertTriangle, 
  Zap, Clock, Package, RefreshCw, Database, TrendingDown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function OptimizerSection({ initialParams }: any) {
  const [params, setParams] = useState(initialParams || {
    avg_demand: 160, 
    demand_std: 64, 
    avg_lead_time: 4, 
    lead_time_std: 1.2, 
    service_level: 0.95,
    sku: "SKU0001"
  });
  
  const [results, setResults] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';

  const runSimulation = async () => {
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: params.sku,
          avg_demand: params.avg_demand,
          demand_std: params.demand_std,
          avg_lead_time: params.avg_lead_time,
          lead_time_std: params.lead_time_std,
          service_level: params.service_level
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch (e) { console.error("Sim Error", e); }
  };

  useEffect(() => { runSimulation(); }, [params]);

  const handleExecute = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/optimizer/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: params.sku,
          new_ss: results.safety_stock,
          new_rop: results.reorder_point
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) { console.error("Execution Error", e); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- SIDEBAR CONTROLS (GLASS) --- */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30"><Settings size={18} /></div>
            <h3 className="text-sm font-black uppercase tracking-tighter italic text-white">Policy Variables</h3>
          </div>

          <Slider label="Target Service Level" min={0.80} max={0.99} step={0.01} 
            val={params.service_level} onChange={(v: number) => setParams({...params, service_level: v})} isPercent />
          
          <Slider label="Lead Time (Weeks)" min={1} max={12} step={1} 
            val={params.avg_lead_time} onChange={(v: number) => setParams({...params, avg_lead_time: v})} />

          <div className="pt-6 border-t border-white/5">
            <button 
              onClick={handleExecute}
              disabled={isSaving}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                success ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
              }`}
            >
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : 
               success ? <CheckCircle size={14} /> : <Save size={14} />}
              {success ? "Policy Applied" : "Commit to Production"}
            </button>
          </div>
        </div>

        {/* --- LEAD TIME SENSITIVITY (CINEMATIC) --- */}
        <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-500/5 border-indigo-500/20 relative overflow-hidden group">
          <TrendingDown className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700" size={140} />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Efficiency Potential</p>
            <h4 className="text-3xl font-black mb-2 italic text-white">{results?.sensitivity_saving || "$0.00"}</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Calculated capital recovery if Lead Time variability is reduced by <strong className="text-indigo-400">20%</strong>.
            </p>
          </div>
        </div>

        {/* --- OPERATIONAL LOGIC (GLASS) --- */}
        <div className="glass-card p-8 rounded-[2.5rem] space-y-5">
           <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-widest italic">
              <Database size={14} /> Operational Logic
           </div>
           <div className="space-y-4">
              <LogicPoint title="Days to Stockout" desc="Calculated using real-time burn rates from sales_fact.csv." />
              <LogicPoint title="Urgency Ranking" desc="Mathematical stock-depletion vs lead-time arrival analysis." />
              <LogicPoint title="EOQ Optimization" desc="Minimizing total cost using products_master.csv pricing." />
           </div>
        </div>
      </div>

      {/* --- MAIN DASHBOARD (GLASS) --- */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        
        <div className="glass-card rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10">
            <MetricBlock label="Safety Stock" val={results?.safety_stock} color="text-indigo-400" />
            <MetricBlock label="Reorder Point" val={results?.reorder_point} color="text-emerald-400" />
            <MetricBlock label="Days to Stockout" val={results?.days_to_stockout} color="text-rose-400" icon={<Clock size={10}/>} />
            <MetricBlock label="Rec. Order Qty" val={results?.recommended_order_qty} color="text-amber-400" icon={<Package size={10}/>} />
          </div>
          
          <div className="h-48 mt-12 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results?.chart_points}>
                <Area type="monotone" dataKey="prob" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatusCard 
            label="Urgency Ranking" 
            val={results?.urgency_ranking} 
            icon={<AlertTriangle size={24} />} 
            isAlert={results?.urgency_ranking === 'CRITICAL'} 
          />
          <StatusCard 
            label="Action Protocol" 
            val={results?.action_protocol} 
            icon={<Zap size={24} />} 
            isAction 
          />
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LogicPoint({ title, desc }: any) {
  return (
    <div className="space-y-1">
      <h5 className="text-[9px] font-black text-indigo-400 uppercase italic tracking-tighter">{title}</h5>
      <p className="text-[10px] text-slate-500 font-medium leading-tight">{desc}</p>
    </div>
  );
}

function MetricBlock({ label, val, color, icon }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
        {icon} {label}
      </p>
      <h4 className={`text-4xl font-black italic tracking-tighter ${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>{val ?? "--"}</h4>
    </div>
  );
}

function StatusCard({ label, val, icon, isAlert, isAction }: any) {
  return (
    <div className={`glass-card p-8 rounded-[2.5rem] flex items-center gap-6 ${isAlert ? 'border-rose-500/30 bg-rose-500/5' : ''}`}>
      <div className={`p-4 rounded-2xl ${isAlert ? 'bg-rose-500/20 text-rose-500' : isAction ? 'bg-indigo-500/20 text-indigo-500' : 'bg-white/5 text-slate-500'}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <h4 className={`${isAction ? 'text-xs font-bold text-slate-300 leading-tight' : 'text-xl font-black italic text-white uppercase'}`}>
          {val || "---"}
        </h4>
      </div>
    </div>
  );
}

function Slider({ label, min, max, step, val, onChange, isPercent }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase">
        <span className="text-slate-500">{label}</span>
        <span className="text-indigo-400 font-bold">{isPercent ? `${(val * 100).toFixed(0)}%` : val}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={val} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500" 
      />
    </div>
  );
}