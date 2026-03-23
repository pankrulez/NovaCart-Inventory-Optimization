import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Activity, AlertTriangle, Package, RefreshCw } from 'lucide-react';

export default function InventorySim() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Default Inputs
  const [inputs, setInputs] = useState({
    avg_demand: 120,
    demand_std: 25,
    avg_lead_time: 4,
    lead_time_std: 1,
    service_level: 0.96
  });

  const runSimulation = async () => {
    setLoading(true);
    try {
      // Replace with your actual Render URL later
      const response = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Inventory Simulation</h1>
          <p className="text-slate-500">Model uncertainty and calculate reorder points in real-time.</p>
        </div>
        <button 
          onClick={runSimulation}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Activity className="w-4 h-4" />}
          Run Simulation
        </button>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Safety Stock" value={results?.metrics.safety_stock} icon={<Package className="text-blue-500" />} />
        <KPICard title="Reorder Point" value={results?.metrics.reorder_point} icon={<Activity className="text-indigo-500" />} />
        <KPICard title="Service Level" value={results?.metrics.estimated_service_level} suffix="%" icon={<RefreshCw className="text-green-500" />} />
        <KPICard title="Stockout Risk" value={results?.metrics.stockout_probability} suffix="%" icon={<AlertTriangle className="text-amber-500" />} />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-6 text-slate-800">Demand Distribution During Lead Time</h3>
        <div className="h-[400px] w-full">
          {results ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.chart_data}>
                <defs>
                  <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="y" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorY)" />
                <ReferenceLine x={results.metrics.reorder_point} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'ROP', position: 'top', fill: '#ef4444' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
              Click "Run Simulation" to visualize data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean cards
function KPICard({ title, value, icon, suffix = "" }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value !== undefined ? `${value}${suffix}` : "--"}</p>
      </div>
    </div>
  );
}