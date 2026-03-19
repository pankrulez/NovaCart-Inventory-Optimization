"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, 
  CartesianGrid, BarChart, Bar, Line, ComposedChart, Legend 
} from 'recharts';
import { 
  Activity, Package, ShieldCheck, AlertTriangle, RefreshCcw, 
  Database, TrendingUp, Layers, ArrowUpRight, ArrowDownRight, Download
} from 'lucide-react';

export default function NovaCartFullRestored() {
  const [activeTab, setActiveTab] = useState('simulation');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  
  const [inputs, setInputs] = useState({
    avg_demand: 150,
    demand_std: 35,
    avg_lead_time: 4,
    lead_time_std: 1.2,
    service_level: 0.98
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // --- API Handlers ---
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
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchData = useCallback(async (endpoint: string, setter: Function) => {
    try {
      const res = await fetch(`${API_URL}/api/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (e) { console.error(e); }
  }, [API_URL]);

  useEffect(() => {
    if (activeTab === 'analytics') fetchData('inventory-data', setInventoryData);
    if (activeTab === 'forecast') fetchData('forecast-data', setForecastData);
  }, [activeTab, fetchData]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Professional Sidebar */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col shadow-2xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
            <Layers className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight">NOVACART</h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavBtn active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} icon={<Activity size={18}/>} label="Risk Optimizer" />
          <NavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<Database size={18}/>} label="Inventory Data" />
          <NavBtn active={activeTab === 'forecast'} onClick={() => setActiveTab('forecast')} icon={<TrendingUp size={18}/>} label="Demand Forecast" />
        </nav>

        <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-200">ENGINE ACTIVE</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">{API_URL}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* TAB 1: SIMULATION */}
        {activeTab === 'simulation' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-end mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Risk & Strategy</h1>
                <p className="text-slate-500">Stochastic lead-time demand simulation engine.</p>
              </div>
              <button onClick={handleSimulate} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
                {loading ? <RefreshCcw className="animate-spin" /> : <Activity size={18} />} Run Engine
              </button>
            </header>

            <div className="grid grid-cols-4 gap-6">
              <StatCard title="Safety Stock" val={simData?.metrics.safety_stock} icon={<Package className="text-indigo-500"/>} trend="+2.4%" up={false} />
              <StatCard title="Reorder Point" val={simData?.metrics.reorder_point} icon={<Activity className="text-blue-500"/>} trend="+0.8%" up={true} />
              <StatCard title="Service Level" val={simData?.metrics.estimated_service_level} suffix="%" icon={<ShieldCheck className="text-emerald-500"/>} trend="Target" up={true} />
              <StatCard title="Stockout Risk" val={simData?.metrics.stockout_probability} suffix="%" icon={<AlertTriangle className="text-rose-500"/>} trend="-1.2%" up={true} />
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Params</h3>
                {Object.keys(inputs).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">{key.replace(/_/g, ' ')}</label>
                    <input type="number" step="0.1" value={(inputs as any)[key]} onChange={(e) => setInputs({...inputs, [key]: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
                  </div>
                ))}
              </div>

              <div className="col-span-9 space-y-8">
                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm h-[380px]">
                   <h4 className="font-bold text-slate-800 mb-6 flex justify-between">Probability Density <span className="text-[10px] text-slate-400">Normal Dist.</span></h4>
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={simData?.chart_data || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="x" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="y" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} strokeWidth={4} />
                        {simData && <ReferenceLine x={simData.metrics.reorder_point} stroke="#F43F5E" strokeDasharray="8 8" strokeWidth={2} />}
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                   <h4 className="font-bold text-slate-800 mb-6">Economic Sensitivity (Inventory Investment vs Service)</h4>
                   <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={simData?.sensitivity || []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="service_level" />
                          <YAxis yAxisId="left" hide />
                          <YAxis yAxisId="right" orientation="right" hide />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="safety_stock" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={45} />
                          <Line yAxisId="right" type="monotone" dataKey="carrying_cost" stroke="#10B981" strokeWidth={4} dot={{ r: 6, fill: '#10B981' }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Inventory Health</h1>
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">SKU ID</th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">Classification</th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">Avg Demand</th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">Lead Time</th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">Optimization Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-indigo-600 font-mono text-sm">{row.SKU}</td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black">{row.SKU_segment}</span>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-700">{row.avg_weekly_demand} units</td>
                      <td className="p-6 text-sm font-bold text-slate-700">{row.avg_lead_time} Weeks</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${row.status === 'Optimized' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FORECASTING */}
        {activeTab === 'forecast' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Demand Forecast</h1>
             <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" dataKey="actual" stroke="#94A3B8" fill="#F1F5F9" name="Actual Sales" strokeWidth={2} />
                    <Area type="monotone" dataKey="forecast" stroke="#6366f1" fill="#EEF2FF" name="AI Prediction" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
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
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      {icon} <span className="text-sm tracking-tight">{label}</span>
    </button>
  );
}

function StatCard({ title, val, icon, trend, up, suffix = "" }: any) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{val !== undefined ? val : "--"}{suffix}</h2>
      </div>
    </div>
  );
}