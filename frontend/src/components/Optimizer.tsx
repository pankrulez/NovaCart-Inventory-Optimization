"use client";
import React, { useState, useEffect } from 'react';
import { 
  Settings, Play, Save, CheckCircle, AlertTriangle, 
  Zap, Clock, Package, TrendingDown, RefreshCw, Info, Database
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
    <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
      {/* --- SIDEBAR CONTROLS --- */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 space-y-6 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300"><Settings size={18} /></div>
            <h3 className="text-sm font-black uppercase tracking-tighter italic text-slate-900">Policy Variables</h3>
          </div>

          <Slider label="Target Service Level" min={0.80} max={0.99} step={0.01} 
            val={params.service_level} onChange={(v: number) => setParams({...params, service_level: v})} isPercent />
          
          <Slider label="Lead Time (Weeks)" min={1} max={12} step={1} 
            val={params.avg_lead_time} onChange={(v: number) => setParams({...params, avg_lead_time: v})} />

          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={handleExecute}
              disabled={isSaving}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-lg ${
                success ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-900/20 hover:shadow-indigo-500/30'
              }`}
            >
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : 
               success ? <CheckCircle size={14} className="animate-in zoom-in duration-300" /> : <Save size={14} className="group-hover:translate-y-px transition-transform" />}
              {success ? "Policy Applied" : "Commit to Production"}
            </button>
          </div>
        </div>

        {/* --- STOCHASTIC LOGIC SUMMARY --- */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/60 p-8 rounded-[2.5rem] space-y-5 shadow-lg shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300">
           <div className="flex items-center gap-2 text-indigo-800 font-black uppercase text-[10px] tracking-widest italic">
              <Database size={14} className="text-indigo-500 animate-pulse" /> Operational Logic
           </div>
           <div className="space-y-4">
              <LogicPoint 
                title="Days to Stockout" 
                desc="Calculated using real current_stock (inventory_snapshot.csv) divided by avg_weekly_demand (sales_fact.csv)." 
              />
              <LogicPoint 
                title="Urgency Ranking" 
                desc="A mathematical comparison between Days to Stockout and supplier Lead Time. If stock expires before delivery, CRITICAL status is triggered." 
              />
              <LogicPoint 
                title="EOQ Optimization" 
                desc="Uses cost_price (products_master.csv) to calculate order quantities that balance holding vs. ordering costs." 
              />
           </div>
        </div>
      </div>

      {/* --- MAIN DASHBOARD --- */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden border border-slate-600 group hover:shadow-indigo-500/20 transition-all duration-500">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10">
            <MetricBlock label="Safety Stock" val={results?.safety_stock} color="text-indigo-400" />
            <MetricBlock label="Reorder Point" val={results?.reorder_point} color="text-emerald-400" />
            <MetricBlock label="Days to Stockout" val={results?.days_to_stockout} color="text-rose-400" icon={<Clock size={10} className="animate-pulse" />} />
            <MetricBlock label="Rec. Order Qty" val={results?.recommended_order_qty} color="text-amber-400" icon={<Package size={10}/>} />
          </div>
          
          <div className="h-48 mt-12 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results?.chart_points}>
                <defs>
                  <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="prob" stroke="#818cf8" fill="url(#colorProb)" strokeWidth={3} />
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

// --- HELPER COMPONENTS ---

function LogicPoint({ title, desc }: any) {
  return (
    <div className="space-y-1 group">
      <h5 className="text-[9px] font-black text-indigo-900 uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors">{title}</h5>
      <p className="text-[10px] text-indigo-900/60 font-medium leading-tight">{desc}</p>
    </div>
  );
}

function MetricBlock({ label, val, color, icon }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
        {icon} {label}
      </p>
      <h4 className={`text-4xl font-black italic tracking-tighter ${color} drop-shadow-md`}>{val ?? "--"}</h4>
    </div>
  );
}

function StatusCard({ label, val, icon, isAlert, isAction }: any) {
  // Dynamically set colors and borders based on the state
  const baseStyle = "border p-8 rounded-[2.5rem] flex items-center gap-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-default";
  
  let themeStyle = "bg-white border-slate-200 shadow-slate-200/50";
  let iconStyle = "bg-slate-50 text-slate-600 group-hover:bg-slate-100";
  let textStyle = "text-slate-900";

  if (isAlert) {
    themeStyle = "bg-rose-50 border-rose-200 shadow-rose-100/50";
    iconStyle = "bg-rose-100 text-rose-600 group-hover:bg-rose-200 group-hover:scale-110 transition-transform";
    textStyle = "text-rose-700";
  } else if (isAction) {
    themeStyle = "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200/60 shadow-indigo-100/50";
    iconStyle = "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 group-hover:scale-110 transition-transform";
    textStyle = "text-indigo-900";
  }

  return (
    <div className={`${baseStyle} ${themeStyle}`}>
      <div className={`p-4 rounded-2xl transition-all duration-300 ${iconStyle}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{label}</p>
        <h4 className={`${isAction ? `text-xs font-bold leading-tight ${textStyle}` : `text-xl font-black italic uppercase ${textStyle}`}`}>
          {val || "---"}
        </h4>
      </div>
    </div>
  );
}

function Slider({ label, min, max, step, val, onChange, isPercent }: any) {
  return (
    <div className="space-y-3 group">
      <div className="flex justify-between text-[10px] font-black uppercase">
        <span className="text-slate-400 group-hover:text-slate-600 transition-colors">{label}</span>
        <span className="text-indigo-600 font-bold">{isPercent ? `${(val * 100).toFixed(0)}%` : val}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={val} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 group-hover:bg-slate-200 transition-colors" 
      />
    </div>
  );
}