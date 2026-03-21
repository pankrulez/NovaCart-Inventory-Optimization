"use client";
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, CartesianGrid, Cell } from 'recharts';
import { UploadCloud, CheckCircle2, BarChart3, PieChart, RefreshCcw, Download, AlertTriangle, FileText } from 'lucide-react';

export default function DataLabSection() {
  const [isanalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#f43f5e'];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      setIsAnalyzing(true);
      try {
        const res = await fetch(`${API_URL}/api/datalab/upload`, { method: 'POST', body: formData });
        setReport(await res.json());
      } catch (err) { console.error(err); } finally { setIsAnalyzing(false); }
    }
  };

  const exportResults = () => {
    if (!report) return;
    const headers = "SKU,Demand,LeadTime,Recommended_ROP\n";
    const rows = report.scatter_points.map((p: any) => `${p.SKU},${p.demand},${p.lead_time},${Math.round(p.rop)}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `NovaCart_Analysis.csv`; a.click();
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 space-y-10">
      {!report ? (
        <div className="relative group border-4 border-dashed rounded-[3.5rem] p-24 text-center bg-white border-slate-200 shadow-xl">
          <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          {isanalyzing ? <div className="flex flex-col items-center"><RefreshCcw className="w-16 h-16 text-indigo-600 animate-spin mb-6" /><p className="text-xl font-black text-indigo-600 animate-pulse uppercase">Processing Batch...</p></div>
          : <div className="space-y-6"><div className="bg-indigo-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"><UploadCloud className="text-indigo-600 w-12 h-12" /></div><h3 className="text-3xl font-black text-slate-800">Drop CSV Catalog</h3><p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Scalable Analytics Engine</p></div>}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 bg-slate-900 border border-slate-800 p-8 rounded-[3rem] flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6"><div className="bg-indigo-500 p-4 rounded-2xl shadow-lg"><CheckCircle2 className="text-white" /></div><div><h4 className="font-black text-white text-xl tracking-tight uppercase italic">Analysis Complete</h4><p className="text-sm text-slate-400 font-medium">Successfully modeled {report.filename}</p></div></div>
            <button onClick={() => setReport(null)} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase">New Upload</button>
          </div>
          <ResultCard icon={<BarChart3 />} label="Total SKUs" val={report.skus} />
          <ResultCard icon={<RefreshCcw />} label="Avg Lead Time" val={report.avg_lead} />
          <div className="col-span-12 md:col-span-6 bg-rose-50 border-2 border-rose-100 p-8 rounded-[2.5rem] shadow-lg flex items-center justify-between"><div><p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Critical Risk Items</p><h3 className="text-5xl font-black text-rose-900 tracking-tighter">{report.at_risk}</h3></div><AlertTriangle size={64} className="text-rose-200" /></div>
          
          <div className="col-span-12 lg:col-span-5 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl h-[400px]">
             <h4 className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-widest italic font-bold">Segmentation</h4>
             <ResponsiveContainer width="100%" height="80%"><BarChart data={report.risk_chart}><XAxis dataKey="level" tick={{fontSize: 10}} axisLine={false} tickLine={false} /><Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>{report.risk_chart?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % 4]} />)}</Bar></BarChart></ResponsiveContainer>
          </div>
          <div className="col-span-12 lg:col-span-7 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl h-[400px]">
             <h4 className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-widest italic font-bold">Inventory Profile</h4>
             <ResponsiveContainer width="100%" height="80%"><ScatterChart><XAxis type="number" dataKey="demand" hide /><YAxis type="number" dataKey="lead_time" hide /><ZAxis type="number" dataKey="rop" range={[50, 400]} /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><Scatter data={report.scatter_points} fill="#6366f1" fillOpacity={0.6} /></ScatterChart></ResponsiveContainer>
          </div>

          <div className="col-span-12 bg-slate-900 text-white p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between shadow-2xl mt-4">
            <div className="flex items-center gap-6"><div className="bg-white/10 p-5 rounded-3xl border border-white/10"><FileText className="text-indigo-400" size={32} /></div><div><h3 className="text-2xl font-black mb-1 italic tracking-tighter">Executive Planning Strategy</h3><p className="text-slate-400 font-medium text-sm max-w-sm">Deploy thresholds for all {report.skus} items into production.</p></div></div>
            <button onClick={exportResults} className="mt-8 md:mt-0 bg-indigo-600 hover:bg-indigo-700 px-10 py-5 rounded-2xl font-black transition-all uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-600/30 flex items-center gap-3"><Download size={18} /> Export Analysis</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ icon, label, val }: any) {
  return (
    <div className="col-span-12 md:col-span-3 bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-lg">
      <div className="text-indigo-600 mb-6">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{val ?? "0"}</h3>
    </div>
  );
}