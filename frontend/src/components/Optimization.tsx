"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { DollarSign, ShoppingCart, Info, RefreshCcw } from 'lucide-react';

export default function OptimizationSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    annual_demand: 8000,
    ordering_cost: 150,
    unit_cost: 50,
    holding_rate: 0.25
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const fetchOptimization = async () => {
    setLoading(true);
    console.log("🚀 Sending EOQ Params:", params);
    try {
      const res = await fetch(`${API_URL}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      if (!res.ok) throw new Error("EOQ API failed");
      
      const result = await res.json();
      console.log("📦 EOQ Result Received:", result);
      setData(result);
    } catch (error) {
      console.error("❌ EOQ Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOptimization();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl border border-slate-800">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Optimal Order Quantity</p>
          <h4 className="text-4xl font-black">{data?.eoq || "--"}</h4>
          <p className="text-[10px] text-slate-500 mt-2">Units per order</p>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Min. Annual Total Cost</p>
          <h4 className="text-3xl font-black text-slate-900">
            {data?.metrics?.min_total_cost ? `$${data.metrics.min_total_cost.toLocaleString()}` : "--"}
          </h4>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Orders Per Year</p>
          <h4 className="text-3xl font-black text-slate-900">{data?.annual_orders || "--"}</h4>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- INPUT PANEL --- */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8 italic">Cost Variables</h3>
          <div className="space-y-6">
            <CostInput label="Annual Demand" val={params.annual_demand} fn={(v) => setParams({...params, annual_demand: v})} icon={<ShoppingCart size={14}/>} />
            <CostInput label="Order Cost ($)" val={params.ordering_cost} fn={(v) => setParams({...params, ordering_cost: v})} icon={<DollarSign size={14}/>} />
            <CostInput label="Unit Price ($)" val={params.unit_cost} fn={(v) => setParams({...params, unit_cost: v})} icon={<DollarSign size={14}/>} />
            
            <button 
              onClick={fetchOptimization} 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <RefreshCcw className="animate-spin" size={18} /> : "UPDATE OPTIMIZATION"}
            </button>
          </div>
        </div>

        {/* --- COST CURVE CHART --- */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px]">
          <h3 className="font-bold text-slate-800 mb-8 italic">Total Cost Optimization Curve</h3>
          <div className="h-[300px]">
            {data?.cost_data ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.cost_data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="q" tick={{fontSize: 10}} label={{ value: 'Quantity', position: 'bottom', fontSize: 10 }} />
                  <YAxis tick={{fontSize: 10}} hide />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="order_cost" stroke="#94a3b8" strokeWidth={2} dot={false} name="Ordering Cost" />
                  <Line type="monotone" dataKey="hold_cost" stroke="#6366f1" strokeWidth={2} dot={false} name="Holding Cost" />
                  <Line type="monotone" dataKey="total_cost" stroke="#0f172a" strokeWidth={3} dot={false} name="Total Cost" />
                  {data?.eoq && <ReferenceLine x={data.eoq} stroke="#F43F5E" strokeDasharray="8 8" label={{ position: 'top', value: 'EOQ', fill: '#F43F5E', fontSize: 10, fontWeight: 'bold' }} />}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl">
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Cost Data...</p>
              </div>
            )}
          </div>
          <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
             <Info className="text-indigo-500 shrink-0" size={20} />
             <p className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong>Optimization Tip:</strong> EOQ identifies the order size that balances the cost of warehouse space (holding) with the cost of shipping/admin (ordering).
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostInput({ label, val, fn, icon }: { label: string; val: number; fn: (v: number) => void; icon: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
        <input 
          type="number" 
          value={val} 
          onChange={(e) => fn(parseFloat(e.target.value) || 0)} 
          className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none" 
        />
      </div>
    </div>
  );
}