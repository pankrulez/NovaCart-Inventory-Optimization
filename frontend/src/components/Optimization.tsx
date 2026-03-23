"use client";
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, ReferenceLine, Legend 
} from 'recharts';
import { 
  DollarSign, Package, TrendingDown, ShieldAlert, 
  ChevronRight, BarChart3, Info, Scale, RefreshCw, Database, Zap, Download, CheckCircle
} from 'lucide-react';

export default function OptimizationSection() {
  const [skuList, setSkuList] = useState<string[]>([]);
  const [selectedSku, setSelectedSku] = useState("");
  const [eoqData, setEoqData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // New state for notification

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

    // Trigger visual feedback
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* --- SUCCESS NOTIFICATION OVERLAY --- */}
      {showSuccess && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 duration-500">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
            <CheckCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">PO Recommendation Exported</span>
          </div>
        </div>
      )}

      {/* --- HEADER & SKU SELECTOR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Cost Optimization</h2>
          <p className="text-xs font-medium text-slate-400 font-bold uppercase tracking-widest">Economic Order Quantity modeling</p>
        </div>

        <select 
          value={selectedSku}
          onChange={(e) => setSelectedSku(e.target.value)}
          className="pl-6 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer"
        >
          {skuList.map(id => <option key={id} value={id}>{id}</option>)}
        </select>
      </div>

      {/* --- SYSTEM LOGIC BRIEF --- */}
      <div className="bg-indigo-50 border-2 border-indigo-100 p-8 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-black uppercase text-[10px] tracking-widest">
            <Scale size={14} /> EOQ Optimization Logic
          </div>
          <p className="text-[11px] text-indigo-800/70 leading-relaxed font-medium">
            This tab solves for the <strong className="text-indigo-900">Economic Order Quantity</strong>. It identifies the point where <strong className="text-indigo-900">Ordering Costs</strong> and <strong className="text-indigo-900">Holding Costs</strong> reach their mathematical minimum.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-black uppercase text-[10px] tracking-widest">
            <Database size={14} /> Cross-Tab Integration
          </div>
          <p className="text-[11px] text-indigo-800/70 leading-relaxed font-medium">
            Demand inputs are synced from the <strong className="text-indigo-900">Forecast Tab</strong>, while unit costs are pulled from <code className="bg-indigo-100 px-1 rounded text-[10px]">production_baseline.csv</code> to ensure the cost curve reflects real capital constraints.
          </p>
        </div>
      </div>

      {/* --- REAL DATA KPI LEADERBOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EOQMetric label="Optimal Order Qty" val={eoqData?.eoq || "--"} icon={<Package size={16}/>} color="indigo" />
        <EOQMetric label="Annual Orders" val={eoqData?.annual_orders || "--"} icon={<BarChart3 size={16}/>} color="emerald" />
        <EOQMetric label="Efficiency Gain" val={eoqData?.efficiency_gain || "--"} icon={<TrendingDown size={16}/>} color="blue" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 italic flex items-center gap-3 uppercase text-xs">
               <Zap className="text-indigo-600" size={18} /> Total Cost Minimization
            </h3>
            <div className="flex gap-4">
               <LegendItem label="Holding" color="#94a3b8" />
               <LegendItem label="Ordering" color="#818cf8" />
               <LegendItem label="Total" color="#4f46e5" />
            </div>
          </div>

          <div className="h-[350px] w-full bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 gap-3">
                <RefreshCw className="animate-spin" size={24} /> <span className="text-[10px] font-black uppercase tracking-widest">Simulating Cost Curves...</span>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="qty" tick={{fontSize: 10}} label={{ value: 'Order Quantity', position: 'bottom', offset: -5, fontSize: 10 }} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="holding_cost" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="ordering_cost" stroke="#818cf8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="total_cost" stroke="#4f46e5" strokeWidth={4} dot={false} />
                  <ReferenceLine x={eoqData.eoq} stroke="#F43F5E" strokeDasharray="8 8" label={{ position: 'top', value: 'EOQ', fill: '#F43F5E', fontSize: 10, fontWeight: 'bold' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl border border-slate-800 h-full">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8">Executive Summary</p>
            
            <div className="space-y-8">
               <div className="space-y-2">
                  <h4 className="text-xl font-black italic uppercase tracking-tighter">Inventory Sweet Spot</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By ordering <strong className="text-white">{eoqData?.eoq || "--"} units</strong> every <strong className="text-white">{eoqData?.freq_days || "--"} days</strong>, you balance bulk storage costs against shipping fees.
                  </p>
               </div>

               <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                     <ShieldAlert size={14} className="text-amber-400" />
                     <span className="text-[10px] font-black uppercase text-slate-300">Overstock Risk</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Ordering above EOQ will result in <strong className="text-slate-300">${eoqData?.potential_waste || "0"}/yr</strong> in unnecessary holding costs.
                  </p>
               </div>

               <button 
                onClick={exportPO}
                className="w-full bg-white text-slate-900 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
               >
                  Export PO Recommendation <ChevronRight size={14} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function EOQMetric({ label, val, icon, color }: any) {
  const themes: any = {
    indigo: 'text-indigo-600 bg-indigo-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50',
  };
  return (
    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-lg flex items-center gap-6 group hover:border-slate-200 transition-all">
      <div className={`p-4 rounded-2xl transition-all group-hover:bg-slate-900 group-hover:text-white ${themes[color]}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">{val}</h4>
      </div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}