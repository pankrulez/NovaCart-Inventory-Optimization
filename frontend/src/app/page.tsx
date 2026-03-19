"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, 
  CartesianGrid, BarChart, Bar, Line, ComposedChart, Legend 
} from 'recharts';
import { 
  Activity, Package, ShieldCheck, AlertTriangle, RefreshCcw, 
  Database, TrendingUp, Layers, ArrowUpRight, ArrowDownRight, Github, ExternalLink
} from 'lucide-react';

export default function NovaCartShowcase() {
  const [activeTab, setActiveTab] = useState('optimizer');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  
  const [inputs, setInputs] = useState({
    avg_demand: 160,
    demand_std: 40,
    avg_lead_time: 4,
    lead_time_std: 1.2,
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
      setSimData(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchData = useCallback(async (endpoint: string, setter: Function) => {
    try {
      const res = await fetch(`${API_URL}/api/${endpoint}`);
      setter(await res.json());
    } catch (e) { console.error(e); }
  }, [API_URL]);

  useEffect(() => {
    if (activeTab === 'inventory') fetchData('inventory-data', setInventoryData);
    if (activeTab === 'forecast') fetchData('forecast-data', setForecastData);
  }, [activeTab, fetchData]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-100">
      {/* --- TOP NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-200">
            <Layers className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800">NovaCart<span className="text-indigo-600">.</span></span>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <TabBtn active={activeTab === 'optimizer'} onClick={() => setActiveTab('optimizer')} label="Live Optimizer" />
          <TabBtn active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} label="Inventory Health" />
          <TabBtn active={activeTab === 'forecast'} onClick={() => setActiveTab('forecast')} label="Demand Forecast" />
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Github size={20}/></a>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
            Documentation <ExternalLink size={14}/>
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="max-w-6xl mx-auto pt-20 pb-12 px-6 text-center">
        <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
          AI-Driven Supply Chain Management
        </span>
        <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          Quantifying Uncertainty in <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Global Logistics.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed">
          NovaCart uses stochastic probability modeling to calculate dynamic safety stock levels, 
          mitigating stockout risks while minimizing unnecessary capital expenditure.
        </p>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        
        {/* OPTIMIZER TAB */}
        {activeTab === 'optimizer' && (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <section className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl shadow-slate-200/40">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Simulation Engine</h3>
                <div className="space-y-5">
                  {Object.keys(inputs).map((key) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-wider">{key.replace(/_/g, ' ')}</label>
                      <input type="number" step="0.1" value={(inputs as any)[key]} onChange={(e) => setInputs({...inputs, [key]: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  ))}
                  <button onClick={handleSimulate} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                    {loading ? <RefreshCcw className="animate-spin" /> : <Activity size={20}/>}
                    Run Optimization
                  </button>
                </div>
              </section>

              {simData && (
                <div className="grid grid-cols-2 gap-4">
                  <SmallStat title="Safety Stock" val={simData.metrics.safety_stock} icon={<Package className="text-indigo-500"/>} />
                  <SmallStat title="Reorder Point" val={simData.metrics.reorder_point} icon={<Activity className="text-blue-500"/>} />
                </div>
              )}
            </div>

            <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 h-[450px]">
                <h4 className="font-bold text-slate-800 mb-8 text-xl tracking-tight">Lead Time Demand Density</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simData?.chart_data || []}>
                    <defs>
                      <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="x" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="y" stroke="#6366f1" fill="url(#colorY)" strokeWidth={4} />
                    {simData && <ReferenceLine x={simData.metrics.reorder_point} stroke="#F43F5E" strokeDasharray="10 10" strokeWidth={3} label={{ value: 'ROP', position: 'top', fill: '#F43F5E', fontSize: 12, fontWeight: '900' }} />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white">
                <h4 className="font-bold text-slate-200 mb-8 text-xl tracking-tight">Economic Trade-off Curve</h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={simData?.sensitivity || []}>
                      <XAxis dataKey="sl" stroke="#475569" fontSize={10} />
                      <Tooltip contentStyle={{ color: '#000' }} />
                      <Bar dataKey="ss" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                      <Line type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="animate-in slide-in-from-bottom-6 duration-700 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">SKU Identifier</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">ABC Class</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Demand/Wk</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Lead Time</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">System Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventoryData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-8 font-black text-indigo-600 font-mono tracking-tighter">{item.sku}</td>
                    <td className="px-10 py-8 font-bold text-slate-700">Segment {item.segment}</td>
                    <td className="px-10 py-8 font-bold text-slate-700">{item.demand} u</td>
                    <td className="px-10 py-8 font-bold text-slate-700">{item.lead} Weeks</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORECAST TAB */}
        {activeTab === 'forecast' && (
          <div className="animate-in fade-in duration-700 bg-white border border-slate-100 p-12 rounded-[2.5rem] shadow-xl h-[600px]">
             <h4 className="font-black text-slate-800 mb-10 text-2xl tracking-tighter">Predictive Demand Intelligence</h4>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="actual" stroke="#94A3B8" fill="#F8FAFC" strokeWidth={2} name="Observed Sales" />
                  <Area type="monotone" dataKey="forecast" stroke="#6366f1" fill="#EEF2FF" strokeWidth={5} name="AI-Projected Forecast" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Internal Components ---
function TabBtn({ active, onClick, label }: any) {
  return (
    <button onClick={onClick} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
      {label}
    </button>
  );
}

function SmallStat({ title, val, icon }: any) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg shadow-slate-200/30 flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
        <p className="text-xl font-black text-slate-900 tracking-tighter">{val || '--'}</p>
      </div>
    </div>
  );
}