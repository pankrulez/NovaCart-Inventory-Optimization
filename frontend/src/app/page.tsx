"use client";
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid,
  BarChart, Bar, Legend 
} from 'recharts'; // Fixed: No stray { here
import { 
  Activity, Package, ShieldCheck, AlertTriangle, RefreshCcw, 
  LayoutDashboard, Database, TrendingUp, Settings 
} from 'lucide-react';

export default function NovaCartApp() {
  // --- ALL HOOKS MUST STAY INSIDE THIS FUNCTION ---
  const [activeTab, setActiveTab] = useState('simulation');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  
  const [inputs, setInputs] = useState({
    avg_demand: 120,
    demand_std: 25,
    avg_lead_time: 4,
    lead_time_std: 1,
    service_level: 0.96
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // --- API FETCH FUNCTIONS ---
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

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inventory-data`);
      const result = await res.json();
      setInventoryData(result);
    } catch (e) { console.error(e); }
  };

  const fetchForecast = async () => {
    try {
      const res = await fetch(`${API_URL}/api/forecast-data`);
      const result = await res.json();
      setForecastData(result);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeTab === 'analytics') fetchInventory();
    if (activeTab === 'forecast') fetchForecast();
  }, [activeTab]);

  // --- RENDER LOGIC ---
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Package className="text-white w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">NovaCart</h2>
        </div>
        <nav className="flex-1 space-y-1">
          <NavButton active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} icon={<Activity size={18} />} label="Live Simulation" />
          <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<Database size={18} />} label="Inventory Data" />
          <NavButton active={activeTab === 'forecast'} onClick={() => setActiveTab('forecast')} icon={<TrendingUp size={18} />} label="Demand Forecast" />
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto p-10">
        {activeTab === 'simulation' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Live Optimization</h1>
                <p className="text-slate-500">Adjust parameters to simulate reorder points and risk.</p>
              </div>
              <button onClick={handleSimulate} className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl shadow-indigo-100">
                {loading ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Activity className="w-4 h-4" />}
                Run Optimization
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 glass-card p-6 rounded-2xl space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Parameters</h3>
                {Object.keys(inputs).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">{key.replace(/_/g, ' ')}</label>
                    <input 
                      type="number" 
                      value={(inputs as any)[key]}
                      onChange={(e) => setInputs({...inputs, [key]: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    />
                  </div>
                ))}
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard title="Safety Stock" value={simData?.metrics.safety_stock} icon={<Package className="text-blue-500"/>} />
                  <StatCard title="Reorder Point" value={simData?.metrics.reorder_point} icon={<Activity className="text-indigo-500"/>} />
                  <StatCard title="Service Level" value={simData?.metrics.estimated_service_level} suffix="%" icon={<ShieldCheck className="text-green-500"/>} />
                  <StatCard title="Stockout Risk" value={simData?.metrics.stockout_probability} suffix="%" icon={<AlertTriangle className="text-amber-500"/>} />
                </div>
                <div className="glass-card p-8 rounded-2xl h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simData?.chart_data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="x" type="number" hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="y" stroke="#6366f1" fill="#EEF2FF" strokeWidth={4} />
                      {simData && <ReferenceLine x={simData.metrics.reorder_point} stroke="#EF4444" strokeDasharray="6 6" label="ROP" />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <h1 className="text-3xl font-black text-slate-900">Inventory Analytics</h1>
             <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">SKU ID</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Segment</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Avg Demand</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Lead Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono text-sm text-indigo-600 font-bold">{row.SKU || `SKU-${idx}`}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${row.SKU_segment?.startsWith('A') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {row.SKU_segment || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600 font-medium">{row.avg_weekly_demand?.toFixed(1) || '0.0'}</td>
                        <td className="p-4 text-sm text-slate-600 font-medium">{row.avg_lead_time} wks</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-slate-900">Demand Forecasting</h1>
            <div className="glass-card p-8 rounded-2xl h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="actual" stroke="#64748b" fill="#f1f5f9" name="Historical" />
                  <Area type="monotone" dataKey="forecast" stroke="#6366f1" fill="#eef2ff" name="Predicted" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      {icon} <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, suffix = "" }: any) {
  return (
    <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-800 tracking-tight">{value ?? "--"}{suffix}</p>
      </div>
    </div>
  );
}