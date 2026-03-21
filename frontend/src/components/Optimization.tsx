"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { DollarSign, ShoppingCart, RefreshCcw, Target } from 'lucide-react';

export default function OptimizationSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ annual_demand: 8000, ordering_cost: 150, unit_cost: 50, holding_rate: 0.25 });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const fetchOptimization = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/optimize`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
      setData(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchOptimization(); }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Target size={120} className="text-indigo-400" /></div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Optimal Order Quantity</p>
          <h4 className="text-5xl font-black text-white tracking-tighter">{data?.eoq ?? "--"}</h4>
          <p className="text-[10px] text-slate-400 mt-4 font-bold italic">Best Q-Value</p>
        </div>
        <StatCard title="Min. Annual Total Cost" val={data?.min_cost} icon={<DollarSign className="text-white"/>} bgColor="bg-emerald-600" prefix="$" />
        <StatCard title="Annual Shipments" val={data?.annual_orders} icon={<RefreshCcw className="text-white"/>} bgColor="bg-blue-600" suffix=" Orders" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl h-fit">
          <h3 className="font-black text-[10px] uppercase text-slate-800 mb-8 italic flex items-center gap-2"><div className="w-1 h-4 bg-indigo-600 rounded-full" /> Cost Variables</h3>
          <div className="space-y-6">
            <CostInput label="Annual Demand" val={params.annual_demand} fn={(v: number) => setParams({...params, annual_demand: v})} icon={<ShoppingCart size={14}/>} />
            <CostInput label="Order Cost ($)" val={params.ordering_cost} fn={(v: number) => setParams({...params, ordering_cost: v})} icon={<DollarSign size={14}/>} />
            <CostInput label="Unit Price ($)" val={params.unit_cost} fn={(v: number) => setParams({...params, unit_cost: v})} icon={<DollarSign size={14}/>} />
            <button onClick={fetchOptimization} disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
              {loading ? <RefreshCcw className="animate-spin" /> : "CALCULATE EOQ"}
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl min-h-[500px]">
          <h3 className="font-black text-slate-900 mb-8 italic flex items-center gap-3 text-xs uppercase tracking-tighter"><div className="w-2 h-2 rounded-full bg-indigo-600" /> Cost Intersection Curve</h3>
          <div className="h-[300px] w-full bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
            {data?.cost_points ? (
              <ResponsiveContainer width="100%" height="100%"><LineChart data={data.cost_points}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="qty" hide /><YAxis hide /><Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="order_cost" stroke="#94a3b8" strokeWidth={2} dot={false} name="Ordering" />
                  <Line type="monotone" dataKey="hold_cost" stroke="#818cf8" strokeWidth={2} dot={false} name="Holding" />
                  <Line type="monotone" dataKey="total_cost" stroke="#0f172a" strokeWidth={4} dot={false} name="Total Cost" />
                  {data?.eoq && <ReferenceLine x={data.eoq} stroke="#F43F5E" strokeDasharray="8 8" strokeWidth={2} />}
                </LineChart></ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-slate-300">Awaiting Simulation...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, val, icon, suffix, prefix, bgColor }: any) {
  return (
    <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-lg">
      <div className={`p-3 ${bgColor || 'bg-slate-900'} w-fit rounded-2xl mb-4 shadow-md`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{val !== undefined ? `${prefix || ''}${val.toLocaleString()}${suffix || ''}` : "--"}</h4>
    </div>
  );
}

function CostInput({ label, val, fn, icon }: any) {
  return (
    <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-2">{label}</label>
      <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <input type="number" value={val} onChange={(e) => fn(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 font-black text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all" /></div>
    </div>
  );
}