"use client";
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, ReferenceLine
} from 'recharts';
import { 
  Package, TrendingDown, ShieldAlert, 
  ChevronRight, BarChart3, Scale, RefreshCw, Database, Zap, CheckCircle
} from 'lucide-react';

export default function OptimizationSection() {
  const [skuList, setSkuList] = useState<string[]>([]);
  const [selectedSku, setSelectedSku] = useState("");
  const [eoqData, setEoqData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';

  const exportPO = () => {
    if (!eoqData || !selectedSku) return;

    const headers = "SKU,Optimal_Order_Quantity,Order_Frequency_Days,Annual_Order_Cycles,Efficiency_Gain\n";
    const row = `${selectedSku},${eoqData.eoq},${eoqData.freq_days},${eoqData.annual_orders},${eoqData.efficiency_gain}`;
    
    const blob = new Blob([headers + row], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NovaCart_PO_Rec_${selectedSku}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

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
      } catch (e) { console.error("EOQ SKU Fetch Error", e); }
    };
    fetchSkus();
  }, [API_URL]);

  useEffect(() => {
    if (!selectedSku) return;
    const fetchEOQ = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/eoq/${selectedSku}`);
        const data = await res.json();
        setEoqData(data);
      } catch (e) { console.error("EOQ Analysis Error", e); }
      finally { setLoading(false); }
    };
    fetchEOQ();
  }, [selectedSku, API_URL]);

  const chartData = eoqData?.chart_points || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out relative">
      
      {/* --- SUCCESS NOTIFICATION OVERLAY --- */}
      {showSuccess && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 duration-500">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-3 border border-emerald-400">
            <CheckCircle size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">PO Recommendation Exported</span>
          </div>
        </div>
      )}

      {/* --- HEADER & SKU SELECTOR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic group-hover:text-indigo-900 transition-colors">Cost Optimization</h2>
          <p className="text-xs font-medium text-slate-400 font-bold uppercase tracking-widest">Economic Order Quantity modeling</p>
        </div>

        <select 
          value={selectedSku}
          onChange={(e) => setSelectedSku(e.target.value)}
          className="pl-6 pr-10 py-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100 text-slate-700 shadow-sm"
        >
          {skuList.map(id => <option key={id} value={id}>{id}</option>)}
        </select>
      </div>

      {/* --- SYSTEM LOGIC BRIEF --- */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/60 p-8 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-8 shadow-lg shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-800 font-black uppercase text-[10px] tracking-widest italic">
            <Scale size={14} className="text-indigo-600 animate-pulse" /> EOQ Optimization Logic
          </div>
          <p className="text-[11px] text-indigo-900/70 leading-relaxed font-medium">
            This tab solves for the <strong className="text-indigo-900 font-black">Economic Order Quantity</strong>. It identifies the point where <strong className="text-indigo-900 font-black">Ordering Costs</strong> and <strong className="text-indigo-900 font-black">Holding Costs</strong> reach their mathematical minimum.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-800 font-black uppercase text-[10px] tracking-widest italic">
            <Database size={14} className="text-indigo-600" /> Cross-Tab Integration
          </div>
          <p className="text-[11px] text-indigo-900/70 leading-relaxed font-medium">
            Demand inputs are synced from the <strong className="text-indigo-900 font-black">Forecast Tab</strong>, while unit costs are pulled from <code className="bg-white px-1.5 py-0.5 rounded text-[10px] text-indigo-800 border border-indigo-200 shadow-sm">production_baseline.csv</code> to ensure the cost curve reflects real capital constraints.
          </p>
        </div>
      </div>

      {/* --- REAL DATA KPI LEADERBOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EOQMetric label="Optimal Order Qty" val={eoqData?.eoq || "--"} icon={<Package size={16}/>} colorTheme="indigo" />
        <EOQMetric label="Annual Orders" val={eoqData?.annual_orders || "--"} icon={<BarChart3 size={16}/>} colorTheme="emerald" />
        <EOQMetric label="Efficiency Gain" val={eoqData?.efficiency_gain || "--"} icon={<TrendingDown size={16}/>} colorTheme="blue" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 italic flex items-center gap-3 uppercase text-xs group-hover:text-indigo-900 transition-colors">
               <Zap className="text-indigo-500" size={18} /> Total Cost Minimization
            </h3>
            <div className="flex gap-4">
               <LegendItem label="Holding" color="#94a3b8" />
               <LegendItem label="Ordering" color="#818cf8" />
               <LegendItem label="Total" color="#4f46e5" />
            </div>
          </div>

          <div className="h-[350px] w-full bg-slate-50/30 rounded-[2.5rem] p-8 border border-slate-100 group-hover:bg-white transition-colors duration-500">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <RefreshCw className="animate-spin text-indigo-500" size={28} /> 
                <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Simulating Cost Curves...</span>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="qty" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} label={{ value: 'Order Quantity', position: 'bottom', offset: -5, fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff', fontSize: '11px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} itemStyle={{ fontWeight: 'bold' }} />
                  
                  {/* Lines with slight active dots for interaction */}
                  <Line type="monotone" dataKey="holding_cost" stroke="#cbd5e1" strokeWidth={3} dot={false} strokeDasharray="5 5" activeDot={{r: 6, fill: '#cbd5e1', strokeWidth: 0}} />
                  <Line type="monotone" dataKey="ordering_cost" stroke="#a5b4fc" strokeWidth={3} dot={false} strokeDasharray="5 5" activeDot={{r: 6, fill: '#a5b4fc', strokeWidth: 0}} />
                  <Line type="monotone" dataKey="total_cost" stroke="#4f46e5" strokeWidth={5} dot={false} activeDot={{r: 8, stroke: '#fff', strokeWidth: 2}} />
                  
                  <ReferenceLine x={eoqData.eoq} stroke="#F43F5E" strokeDasharray="6 6" label={{ position: 'top', value: 'EOQ', fill: '#F43F5E', fontSize: 10, fontWeight: 'black' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-900/20 border border-slate-700 h-full flex flex-col group hover:shadow-indigo-500/20 transition-all duration-500">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 group-hover:text-indigo-300 transition-colors">Executive Summary</p>
            
            <div className="space-y-8 flex-1">
               <div className="space-y-2">
                  <h4 className="text-xl font-black italic uppercase tracking-tighter">Inventory Sweet Spot</h4>
                  <p className="text-xs text-indigo-200/70 leading-relaxed font-medium">
                    By ordering <strong className="text-white font-black">{eoqData?.eoq || "--"} units</strong> every <strong className="text-white font-black">{eoqData?.freq_days || "--"} days</strong>, you balance bulk storage costs against shipping fees.
                  </p>
               </div>

               <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-inner group-hover:bg-white/10 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                     <ShieldAlert size={14} className="text-amber-400" />
                     <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Overstock Risk</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Ordering above EOQ will result in <strong className="text-rose-400">${eoqData?.potential_waste || "0"}/yr</strong> in unnecessary holding costs.
                  </p>
               </div>
            </div>

            <button 
             onClick={exportPO}
             className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-95 group/btn"
            >
               Export PO Recommendation <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function EOQMetric({ label, val, icon, colorTheme }: any) {
  const themeStyles: any = {
    indigo: "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-indigo-500/30",
    emerald: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-emerald-500/30",
    blue: "text-blue-600 bg-blue-50 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-blue-500/30",
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-lg shadow-slate-200/40 flex items-center gap-6 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out cursor-default">
      <div className={`p-4 rounded-2xl transition-all duration-300 shadow-sm ${themeStyles[colorTheme]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">{val}</h4>
      </div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}