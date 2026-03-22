"use client";
import React, { useState, useEffect } from 'react';
import { Settings, Play, Save, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function OptimizerSection({ initialParams }: any) {
  // PRESERVED: State for Stochastic Simulation
  const [params, setParams] = useState(initialParams || {
    avg_demand: 160, demand_std: 64, avg_lead_time: 4, lead_time_std: 1.2, service_level: 0.95, sku: "NOV-772"
  });
  const [results, setResults] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // PRESERVED: Simulation Logic
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

  // NEW: Execution Logic (Persisting to real data)
  const handleExecute = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/optimizer/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: params.sku || "UNKNOWN",
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
    <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* --- PRESERVED: PARAMETER CONTROLS --- */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white"><Settings size={18} /></div>
            <h3 className="text-sm font-black uppercase tracking-tighter italic">Policy Variables</h3>
          </div>

          <Slider label="Target Service Level" min={0.80} max={0.99} step={0.01} 
            val={params.service_level} onChange={(v: number) => setParams({...params, service_level: v})} />
          
          <Slider label="Lead Time (Weeks)" min={1} max={12} step={1} 
            val={params.avg_lead_time} onChange={(v: number) => setParams({...params, avg_lead_time: v})} />

          <div className="pt-6 border-t border-slate-50">
            <button 
              onClick={handleExecute}
              disabled={isSaving}
              className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                success ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'
              }`}
            >
              {isSaving ? <span className="animate-pulse">Writing to Pipeline...</span> : 
               success ? <><CheckCircle size={14} /> Policy Applied</> : 
               <><Save size={14} /> Commit to Production</>}
            </button>
          </div>
        </div>
      </div>

      {/* --- PRESERVED: VISUALIZATION & OUTPUTS --- */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-2 gap-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recommended SS</p>
              <h4 className="text-5xl font-black italic tracking-tighter text-indigo-400">{results?.safety_stock ?? "--"}</h4>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reorder Point</p>
              <h4 className="text-5xl font-black italic tracking-tighter text-emerald-400">{results?.reorder_point ?? "--"}</h4>
            </div>
          </div>
          
          <div className="h-64 mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results?.chart_points}>
                <XAxis dataKey="demand" hide />
                <Tooltip />
                <Area type="monotone" dataKey="prob" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, min, max, step, val, onChange }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase">
        <span className="text-slate-400">{label}</span>
        <span className="text-indigo-600 font-bold">{label.includes('Level') ? `${(val * 100).toFixed(0)}%` : val}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
    </div>
  );
}