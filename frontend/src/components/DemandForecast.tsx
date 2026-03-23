"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, TrendingUp, AlertTriangle, Calendar, 
  Settings, RefreshCw, BarChart2, Crosshair, Box,
  ShieldCheck
} from 'lucide-react';
import { 
  ComposedChart, Area, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';

export default function ForecastSection() {
  const [skuList, setSkuList] = useState<string[]>([]);
  const [selectedSku, setSelectedSku] = useState("");
  const [horizon, setHorizon] = useState(12); // Weeks to forecast
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';

  // 1. Fetch SKU List on Mount
  useEffect(() => {
    const fetchSkus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/stats`);
        const data = await res.json();
        if (data.risk_skus) {
          const ids = data.risk_skus.map((s: any) => s.SKU);
          setSkuList(ids);
          if (ids.length > 0) setSelectedSku(ids[0]);
        }
      } catch (e) { console.error("Forecast SKU Fetch Error", e); }
    };
    fetchSkus();
  }, [API_URL]);

  // 2. Fetch Forecast when SKU or Horizon changes
  useEffect(() => {
    if (!selectedSku) return;
    const fetchForecast = async () => {
      setLoading(true);
      try {
        // Fallback mock data structure if your backend endpoint isn't ready yet
        // Replace this with: const res = await fetch(`${API_URL}/api/forecast/${selectedSku}?weeks=${horizon}`);
        setTimeout(() => {
          setForecastData(generateMockForecast(horizon));
          setLoading(false);
        }, 800);
      } catch (e) { console.error("Forecast Analysis Error", e); setLoading(false); }
    };
    fetchForecast();
  }, [selectedSku, horizon]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <Activity size={200} className="text-indigo-600" />
        </div>
        <div className="space-y-2 relative z-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Demand Intelligence</h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Stochastic Lag-Regression Modeling</p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">Target SKU</label>
            <select 
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="pl-6 pr-10 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer shadow-sm hover:bg-slate-100 text-slate-700"
            >
              {skuList.map(id => <option key={id} value={id}>{id}</option>)}
              {skuList.length === 0 && <option>SKU0001</option>}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">Horizon (Weeks)</label>
            <select 
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="pl-6 pr-10 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer shadow-sm hover:bg-slate-100 text-slate-700"
            >
              <option value={4}>4 Weeks</option>
              <option value={8}>8 Weeks</option>
              <option value={12}>12 Weeks</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Model Accuracy (MAPE)" val={forecastData?.mape || "--"} icon={<Crosshair size={16}/>} colorTheme="indigo" />
        <KPICard title="Avg Weekly Demand" val={forecastData?.avg_demand || "--"} icon={<BarChart2 size={16}/>} colorTheme="emerald" />
        <KPICard title="Forecast Bias" val={forecastData?.bias || "--"} icon={<TrendingUp size={16}/>} colorTheme="amber" />
        <KPICard title="Confidence Bounds" val="95%" icon={<ShieldCheck size={16}/>} colorTheme="rose" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- MAIN CHART (STOCHASTIC FORECAST) --- */}
        <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-900/20 border border-slate-700/50 relative group hover:shadow-indigo-500/20 transition-all duration-500">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-black text-white italic flex items-center gap-3 uppercase text-xs tracking-widest">
               <Activity className="text-indigo-400" size={18} /> Projection vs Historical
            </h3>
            <div className="flex gap-4">
               <LegendItem label="Historical" color="#94a3b8" />
               <LegendItem label="Forecast" color="#4f46e5" />
               <LegendItem label="95% Interval" color="#312e81" opacity={0.6} />
            </div>
          </div>

          <div className="h-[350px] w-full relative z-10">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 gap-3">
                <RefreshCw className="animate-spin text-indigo-500" size={24} /> 
                <span className="text-[10px] font-black uppercase tracking-widest">Simulating Future Demand...</span>
              </div>
            ) : forecastData ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData.chart_points} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="week" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} 
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  
                  {/* Confidence Interval Area */}
                  <Area type="monotone" dataKey="ci" stroke="none" fill="#4f46e5" fillOpacity={0.15} activeDot={false} />
                  
                  {/* Historical Line */}
                  <Line type="monotone" dataKey="historical" stroke="#94a3b8" strokeWidth={3} dot={{r: 3, fill: '#94a3b8', strokeWidth: 0}} activeDot={{r: 6}} />
                  
                  {/* Forecast Line */}
                  <Line type="monotone" dataKey="forecast" stroke="#818cf8" strokeWidth={4} strokeDasharray="6 6" dot={{r: 4, fill: '#818cf8', strokeWidth: 0}} activeDot={{r: 7, stroke: '#fff', strokeWidth: 2}} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* --- FORECAST BREAKDOWN LOG --- --- */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
            <div className="flex items-center gap-2 text-indigo-700 font-black uppercase text-[10px] tracking-widest mb-6">
              <Calendar size={14} /> Weekly Breakdown
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="grid grid-cols-3 text-[9px] font-black text-slate-400 uppercase tracking-tighter border-b border-slate-100 pb-3 mb-2">
                <div>Week</div>
                <div className="text-center">Expected</div>
                <div className="text-right">Upper Bound</div>
              </div>
              
              <div className="overflow-y-auto pr-2 space-y-1" style={{ maxHeight: '320px' }}>
                {loading ? (
                  <div className="py-10 text-center text-slate-300 italic text-xs font-bold">Calculating...</div>
                ) : forecastData?.breakdown?.map((row: any, i: number) => (
                  <div key={i} className="grid grid-cols-3 text-xs font-bold text-slate-700 py-3 border-b border-slate-50 last:border-0 hover:bg-indigo-50/50 transition-colors rounded-lg px-2 group cursor-default">
                    <div className="text-slate-500 group-hover:text-indigo-600 transition-colors">{row.week}</div>
                    <div className="text-center font-black text-indigo-600">{row.expected}</div>
                    <div className="text-right text-slate-400 group-hover:text-rose-400 transition-colors">{row.upper}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-auto border-t border-slate-100">
               <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                 Upper bounds represent maximum expected demand before a stockout event occurs under current ROP settings.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function KPICard({ title, val, icon, colorTheme }: any) {
  const themeStyles: any = {
    rose: "text-rose-600 bg-rose-50 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-rose-500/30",
    indigo: "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-indigo-500/30",
    emerald: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-emerald-500/30",
    amber: "text-amber-600 bg-amber-50 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-amber-500/30",
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-lg shadow-slate-200/40 text-left w-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out group cursor-default">
      <div className={`p-3 rounded-2xl w-fit mb-6 shadow-sm transition-all duration-300 ${themeStyles[colorTheme]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{val}</h4>
    </div>
  );
}

function LegendItem({ label, color, opacity = 1 }: { label: string, color: string, opacity?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color, opacity }} />
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// --- MOCK DATA GENERATOR (Temporary until backend is hooked up) ---
function generateMockForecast(weeks: number) {
  const data = [];
  const breakdown = [];
  let currentDemand = 210;
  
  // Generate Historical (past 8 weeks)
  for (let i = -8; i <= 0; i++) {
    const historical = i === 0 ? currentDemand : currentDemand + (Math.random() * 60 - 30);
    data.push({
      week: `Wk ${i === 0 ? 'Current' : i}`,
      historical: Math.round(historical),
      forecast: i === 0 ? Math.round(historical) : null,
      ci: i === 0 ? [Math.round(historical), Math.round(historical)] : null,
    });
  }

  // Generate Forecast
  for (let i = 1; i <= weeks; i++) {
    const trend = i * 2; 
    const volatility = 20 + (i * 3); // Uncertainty grows over time
    const expected = currentDemand + trend + (Math.random() * 20 - 10);
    const lower = expected - volatility;
    const upper = expected + volatility;

    data.push({
      week: `Wk +${i}`,
      historical: null,
      forecast: Math.round(expected),
      ci: [Math.round(lower), Math.round(upper)]
    });

    breakdown.push({
      week: `Week +${i}`,
      expected: Math.round(expected),
      upper: Math.round(upper)
    });
  }

  return {
    mape: "14.2%",
    avg_demand: "218",
    bias: "+2.1%",
    chart_points: data,
    breakdown: breakdown
  };
}