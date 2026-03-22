"use client";
import React, { useState, useEffect } from 'react';
import { 
  Settings, Play, Save, CheckCircle, AlertTriangle, 
  Zap, Clock, Package, TrendingDown, RefreshCw 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const runSimulation = async () => {
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
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
      
      {/* --- SIDEBAR CONTROLS --- */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white"><Settings size={18} /></div>
            <h3 className="text-sm font-black uppercase tracking-tighter italic">Policy Variables</h3>
          </div>

          <Slider label="Target Service Level" min={0.80} max={0.99} step={0.01} 
            val={params.service_level} onChange={(v: number) => setParams({...params, service_level: v})} isPercent />
          
          <Slider label="Lead Time (Weeks)" min={1} max={12} step={1} 
            val={params.avg_lead_time} onChange={(v: number) => setParams({...params, avg_lead_time: v})} />

          <div className="pt-6 border-t border-slate-50">
            <button 
              onClick={handleExecute}
              disabled={isSaving}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 ${
                success ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg'
              }`}
            >
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : 
               success ? <CheckCircle size={14} /> : <Save size={14} />}
              {success ? "Policy Applied" : "Commit to Production"}
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN DASHBOARD --- */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        
        {/* REAL DATA KPI GRID */}
        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10">
            <MetricBlock label="Safety Stock" val={results?.safety_stock} color="text-indigo-400" />
            <MetricBlock label="Reorder Point" val={results?.reorder_point} color="text-emerald-400" />
            <MetricBlock label="Days to Stockout" val={results?.days_to_stockout} color="text-rose-400" icon={<Clock size={10}/>} />
            <MetricBlock label="Rec. Order Qty" val={results?.recommended_order_qty} color="text-amber-400" icon={<Package size={10}/>} />
          </div>
          
          <div className="h-48 mt-12 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results?.chart_points}>
                <Area type="monotone" dataKey="prob" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OPERATIONAL PROTOCOL CARDS */}
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

// --- STYLED COMPONENTS ---

function MetricBlock({ label, val, color, icon }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
        {icon} {label}
      </p>
      <h4 className={`text-4xl font-black italic tracking-tighter ${color}`}>{val ?? "--"}</h4>
    </div>
  );
}

function StatusCard({ label, val, icon, isAlert, isAction }: any) {
  return (
    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
      <div className={`p-4 rounded-2xl ${isAlert ? 'bg-rose-100 text-rose-600' : isAction ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className={`${isAction ? 'text-xs font-bold text-slate-600 leading-tight' : 'text-xl font-black italic text-slate-900 uppercase'}`}>
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
        <span className="text-slate-400">{label}</span>
        <span className="text-indigo-600 font-bold">{isPercent ? `${(val * 100).toFixed(0)}%` : val}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={val} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
      />
    </div>
  );
}