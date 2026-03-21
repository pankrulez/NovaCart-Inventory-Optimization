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
    try {
      const res = await fetch(`${API_URL}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("EOQ Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOptimization(); }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Optimal Order Quantity" val={data?.eoq} icon={<ShoppingCart className="text-indigo-600"/>} suffix=" units" />
        <StatCard title="Min. Annual Total Cost" val={data?.min_cost} icon={<DollarSign className="text-emerald-600"/>} prefix="$" />
        <StatCard title="Annual Shipments" val={data?.annual_orders} icon={<RefreshCcw className="text-blue-600"/>} suffix=" orders" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8 italic">Cost Variables</h3>
          <div className="space-y-6">
            <CostInput label="Annual Demand" val={params.annual_demand} fn={(v: number) => setParams({...params, annual_demand: v})} icon={<ShoppingCart size={14}/>} />
            <CostInput label="Order Cost ($)" val={params.ordering_cost} fn={(v: number) => setParams({...params, ordering_cost: v})} icon={<DollarSign size={14}/>} />
            <CostInput label="Unit Price ($)" val={params.unit_cost} fn={(v: number) => setParams({...params, unit_cost: v})} icon={<DollarSign size={14}/>} />
            <button onClick={fetchOptimization} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
              {loading ? <RefreshCcw className="animate-spin" size={18} /> : "UPDATE OPTIMIZATION"}
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px]">
          <h3 className="font-bold text-slate-800 mb-8 italic">Total Cost Curve</h3>
          <div className="h-[300px] w-full">
            {data?.cost_points ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.cost_points}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="qty" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="order_cost" stroke="#94a3b8" strokeWidth={2} dot={false} name="Ordering" />
                  <Line type="monotone" dataKey="hold_cost" stroke="#6366f1" strokeWidth={2} dot={false} name="Holding" />
                  <Line type="monotone" dataKey="total_cost" stroke="#0f172a" strokeWidth={3} dot={false} name="Total" />
                  {data?.eoq && <ReferenceLine x={data.eoq} stroke="#F43F5E" strokeDasharray="8 8" />}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300">Awaiting Simulation...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, val, icon, suffix, prefix }: any) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
      <div className="p-3 bg-slate-50 w-fit rounded-2xl mb-4">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h4 className="text-3xl font-black text-slate-900">{val !== undefined ? `${prefix || ''}${val.toLocaleString()}${suffix || ''}` : "--"}</h4>
    </div>
  );
}

function CostInput({ label, val, fn, icon }: { label: string; val: number; fn: (v: number) => void; icon: any }) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
        <input type="number" value={val} onChange={(e) => fn(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 font-bold text-slate-700 outline-none" />
      </div>
    </div>
  );
}