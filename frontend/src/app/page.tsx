"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, 
  CartesianGrid, BarChart, Bar, Legend, Line 
} from 'recharts';
import { 
  Activity, Package, ShieldCheck, AlertTriangle, RefreshCcw, 
  Database, TrendingUp, Layers, ArrowUpRight, ArrowDownRight, Download, Server
} from 'lucide-react';

export default function NovaCartFullUpgrade() {
  const [activeTab, setActiveTab] = useState('simulation');
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  
  const [inputs, setInputs] = useState({
    avg_demand: 180,
    demand_std: 45,
    avg_lead_time: 4,
    lead_time_std: 1.5,
    service_level: 0.95
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // --- Actions ---
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

  const exportToCSV = () => {
    if (!simData) return;
    const headers = "Service Level,Safety Stock,Carrying Cost\n";
    const rows = simData.sensitivity.map((s: any) => `${s.service_level},${s.safety_stock},${s.carrying_cost}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_optimization_report.csv`;
    a.click();
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/40">
            <Layers className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight italic">NOVACART</h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Supply Intelligence</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavButton active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} icon={<Activity size={18}/>} label="Risk Optimizer" />
          <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<Database size={18}/>} label="Inventory Health" />
          <NavButton active={activeTab === 'forecast'} onClick={() => setActiveTab('forecast')} icon={<TrendingUp size={18}/>} label="Demand Forecast" />
        </nav>

        <div className="mt-auto p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Engine Status</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
          </div>
          <p className="text-xs text-slate-300 font-medium truncate italic">{API_URL.replace('https://', '')}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-500 font-medium">Stochastic lead-time demand simulation & financial impact.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={exportToCSV} className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                <Download size={18} /> Export CSV
             </button>
             <button onClick={handleSimulate} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                {loading ? <RefreshCcw className="animate-spin" /> : <Activity size={18} />}
                Run Optimization
             </button>
          </div>
        </header>

        {activeTab === 'simulation' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* KPI Section */}
            <div className="grid grid-cols-4 gap-6">
              <KPICard title="Safety Stock" value={simData?.metrics.safety_stock} icon={<Package className="text-indigo-500" />} trend="+4.2%" up={false} />
              <KPICard title="Reorder Point" value={simData?.metrics.reorder_point} icon={<Activity className="text-blue-500" />} trend="+1.1%" up={true} />
              <KPICard title="Target Service" value={simData?.metrics.estimated_service_level} suffix="%" icon={<ShieldCheck className="text-emerald-500" />} trend="Stable" up={true} />
              <KPICard title="Stockout Risk" value={simData?.metrics.stockout_probability} suffix="%" icon={<AlertTriangle className="text-rose-500" />} trend="-0.5%" up={true} />
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Inputs */}
              <div className="col-span-12 lg:col-span-3 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Model Settings</h3>
                {Object.keys(inputs).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-wider">{key.replace(/_/g, ' ')}</label>
                    <input 
                      type="number" 
                      value={(inputs as any)[key]} 
                      onChange={(e) => setInputs({...inputs, [key]: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                ))}
              </div>

              {/* Main Chart */}
              <div className="col-span-12 lg:col-span-9 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                <div className="flex justify-between mb-8">
                   <h3 className="font-bold text-slate-800 text-lg">Demand Probability Density</h3>
                   <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div> Model Curve</span>
                      <span className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 bg-rose-500"></div> Reorder Point</span>
                   </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simData?.chart_data || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="x" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="y" stroke="#6366f1" strokeWidth={4} fill="#6366f1" fillOpacity={0.05} />
                      {simData && <ReferenceLine x={simData.metrics.reorder_point} stroke="#F43F5E" strokeDasharray="6 6" strokeWidth={2} />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sensitivity Chart */}
              <div className="col-span-12 bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-slate-900">Economic Sensitivity Analysis</h3>
                  <p className="text-sm text-slate-500 font-medium">How target service levels drive safety stock holding costs.</p>
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={simData?.sensitivity || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="service_level" />
                      <YAxis yAxisId="left" hide />
                      <YAxis yAxisId="right" orientation="right" hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar yAxisId="left" dataKey="safety_stock" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={50} />
                      <Line yAxisId="right" type="monotone" dataKey="carrying_cost" stroke="#10B981" strokeWidth={4} dot={{ r: 6, fill: '#10B981' }} />
                    </BarChart>
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

// --- Internal Components ---
function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      {icon} <span className="text-[13px] tracking-tight">{label}</span>
    </button>
  );
}

function KPICard({ title, value, icon, trend, up, suffix = "" }: any) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{value !== undefined ? value : "--"}{suffix}</h2>
      </div>
    </div>
  );
}