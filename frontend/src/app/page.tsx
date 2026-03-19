"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, 
  CartesianGrid, BarChart, Bar, Line, ComposedChart 
} from 'recharts';
import { 
  Activity, Package, ShieldCheck, AlertTriangle, RefreshCcw, 
  Database, TrendingUp, Layers, ArrowUpRight, ArrowDownRight, Download
} from 'lucide-react';

export default function NovaCartFixed() {
  const [activeTab, setActiveTab] = useState('simulation');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  
  const [inputs, setInputs] = useState({
    avg_demand: 150,
    demand_std: 30,
    avg_lead_time: 3,
    lead_time_std: 0.8,
    service_level: 0.95
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const result = await res.json();
      setSimData(result);
    } catch (e) { console.error("Sim Error:", e); } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <Layers className="text-indigo-500 w-8 h-8" />
          <h2 className="text-xl font-black tracking-tighter">NOVACART</h2>
        </div>
        <nav className="space-y-2 flex-1">
          <NavBtn active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} icon={<Activity size={18}/>} label="Optimizer" />
          <NavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<Database size={18}/>} label="Inventory" />
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Supply Intelligence</h1>
            <p className="text-slate-500">Probabilistic Safety Stock & Economic Analysis</p>
          </div>
          <button onClick={handleSimulate} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
            {loading ? <RefreshCcw className="animate-spin" /> : <Activity size={18} />}
            Run Engine
          </button>
        </header>

        {activeTab === 'simulation' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Row */}
            <div className="grid grid-cols-4 gap-6">
              <StatCard title="Safety Stock" val={simData?.metrics.safety_stock} icon={<Package className="text-indigo-500"/>} />
              <StatCard title="Reorder Point" val={simData?.metrics.reorder_point} icon={<Activity className="text-blue-500"/>} />
              <StatCard title="Service Level" val={simData?.metrics.estimated_service_level} suffix="%" icon={<ShieldCheck className="text-emerald-500"/>} />
              <StatCard title="Stockout Risk" val={simData?.metrics.stockout_probability} suffix="%" icon={<AlertTriangle className="text-rose-500"/>} />
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Sidebar Controls */}
              <div className="col-span-3 bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm space-y-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parameters</h3>
                {Object.keys(inputs).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{key.replace(/_/g, ' ')}</label>
                    <input 
                      type="number" step="0.1" value={(inputs as any)[key]} 
                      onChange={(e) => setInputs({...inputs, [key]: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>

              {/* Charts Area */}
              <div className="col-span-9 space-y-8">
                {/* Distribution Chart */}
                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm h-[350px]">
                   <h4 className="font-bold text-slate-800 mb-4">Lead Time Demand Distribution</h4>
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={simData?.chart_data || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="x" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="y" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                        {simData && <ReferenceLine x={simData.metrics.reorder_point} stroke="#F43F5E" strokeDasharray="5 5" />}
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                {/* Economic Sensitivity Chart */}
                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm h-[350px]">
                   <h4 className="font-bold text-slate-800 mb-4">Economic Sensitivity (Service vs Cost)</h4>
                   <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={simData?.sensitivity || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="service_level" />
                        <YAxis yAxisId="left" hide />
                        <YAxis yAxisId="right" orientation="right" hide />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="safety_stock" fill="#6366f1" radius={[5, 5, 0, 0]} barSize={40} />
                        <Line yAxisId="right" type="monotone" dataKey="carrying_cost" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                      </ComposedChart>
                   </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Minimalist Sub-Components ---
function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
      {icon} <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, val, icon, suffix = "" }: any) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-black text-slate-900">{val !== undefined ? val : "--"}{suffix}</h2>
      </div>
    </div>
  );
}