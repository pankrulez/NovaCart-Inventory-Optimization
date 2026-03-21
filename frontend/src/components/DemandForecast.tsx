"use client";
import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, Calendar, Cpu, Activity, ArrowUpRight, CheckCircle2, Info 
} from 'lucide-react';

export default function DemandForecastSection() {
  const [data, setData] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    // This calls the new /api/forecast endpoint we'll add to the backend
    fetch(`${API_URL}/api/forecast`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error("Forecast Sync Error:", err));
  }, [API_URL]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- MODEL METADATA STRIP --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ForecastMetric label="Engine" val={data?.metrics.model} icon={<Cpu size={16}/>} color="text-indigo-600" />
        <ForecastMetric label="Accuracy (MAPE)" val={data?.metrics.mape} icon={<CheckCircle2 size={16}/>} color="text-emerald-600" />
        <ForecastMetric label="Trend Phase" val={data?.metrics.trend} icon={<TrendingUp size={16}/>} color="text-blue-600" />
        <ForecastMetric label="Seasonality" val={data?.metrics.seasonality} icon={<Calendar size={16}/>} color="text-amber-600" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- MAIN CHART: DEMAND PROJECTION --- */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/40 min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 italic flex items-center gap-3 uppercase text-xs tracking-tight">
               <Activity className="text-indigo-600" size={18} />
               12-Month Probabilistic Forecast
            </h3>
            <div className="flex items-center gap-4">
               <LegendItem label="95% CI" color="bg-indigo-100" />
               <LegendItem label="Mean Forecast" color="bg-indigo-600" />
            </div>
          </div>

          <div className="h-[350px] w-full bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.points}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px' }}
                    itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                  />
                  {/* Shaded Area for Confidence Interval */}
                  <Area dataKey="upper" stroke="none" fill="#6366f1" fillOpacity={0.1} />
                  <Area dataKey="lower" stroke="none" fill="#F8FAFC" fillOpacity={1} />
                  
                  {/* Main Forecast Line */}
                  <Area type="monotone" dataKey="forecast" stroke="#4f46e5" strokeWidth={4} fill="url(#colorForecast)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 uppercase font-black text-[10px] tracking-widest animate-pulse">
                 Syncing Predictive Models...
              </div>
            )}
          </div>
        </div>

        {/* --- INSIGHTS PANEL --- */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800 h-full">
            <div className="relative z-10 space-y-8">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Planning Intelligence</p>
              
              <div className="space-y-4">
                <h4 className="text-2xl font-black italic tracking-tighter uppercase">Growth Trend Detected</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  The model projects a <strong className="text-white">14.2% increase</strong> in demand over the next quarter. 
                  Historical seasonality suggests a peak in <strong className="text-white">December</strong>.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Model Drift</span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-1 rounded-md">Negligible</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Volatility</span>
                  <span className="text-[9px] font-black text-slate-300 uppercase italic">Low-Med</span>
                </div>
              </div>

              <button className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20">
                 <ArrowUpRight size={14}/> Sync with ROP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

function ForecastMetric({ label, val, icon, color }: any) {
  return (
    <div className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] shadow-lg flex items-center gap-4 hover:shadow-xl transition-all duration-300">
      <div className={`p-3 bg-slate-50 rounded-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-lg font-black text-slate-900 tracking-tighter italic">{val || "--"}</h4>
      </div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}