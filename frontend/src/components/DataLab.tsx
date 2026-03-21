"use client";
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, CartesianGrid, Cell 
} from 'recharts';
import { 
  UploadCloud, CheckCircle2, BarChart3, PieChart, RefreshCcw, 
  Download, AlertTriangle, FileText, Database, FileSpreadsheet 
} from 'lucide-react';

export default function DataLabSection() {
  const [isanalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#f43f5e'];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      setIsAnalyzing(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/datalab/upload`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Inventory Data Lab</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">Upload your product catalog to perform automated batch stochastic modeling.</p>
      </div>

      {!report ? (
        <div className="relative border-4 border-dashed rounded-[3rem] p-20 text-center bg-white border-slate-200">
          <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          {isanalyzing ? (
            <div className="flex flex-col items-center"><RefreshCcw className="animate-spin text-indigo-600 mb-4" size={48} /><p className="font-bold text-indigo-600 uppercase">Analyzing Batch...</p></div>
          ) : (
            <div className="space-y-4">
              <UploadCloud className="mx-auto text-slate-300" size={64} />
              <h3 className="text-2xl font-black text-slate-800">Drop CSV File Here</h3>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Header */}
          <div className="col-span-12 bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="text-emerald-500" />
              <p className="font-bold text-emerald-900 uppercase italic">Analysis Complete: {report.filename}</p>
            </div>
            <button onClick={() => setReport(null)} className="bg-white text-emerald-700 px-6 py-2 rounded-xl font-black text-[10px] uppercase border border-emerald-200">New Upload</button>
          </div>

          {/* Metrics */}
          <ResultCard icon={<BarChart3 />} label="Total SKUs" val={report.skus} />
          <ResultCard icon={<RefreshCcw />} label="Avg Lead Time" val={report.avg_lead} />
          <ResultCard icon={<PieChart />} label="Avg Variance" val={report.variance} />
          <div className="col-span-12 md:col-span-3 bg-rose-50 border border-rose-100 p-8 rounded-[2rem]">
             <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">High Volatility</p>
             <h3 className="text-3xl font-black text-rose-900 tracking-tighter">{report.at_risk} Items</h3>
          </div>

          {/* Charts Row */}
          <div className="col-span-12 lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-[400px]">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Risk Distribution</h4>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={report.risk_chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="level" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                  {report.risk_chart?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-12 lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-[400px]">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">ROP Profile (Scatter)</h4>
            <ResponsiveContainer width="100%" height="80%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" dataKey="demand" name="Demand" tick={{fontSize: 10}} />
                <YAxis type="number" dataKey="lead_time" name="LT" tick={{fontSize: 10}} />
                <ZAxis type="number" dataKey="rop" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Products" data={report.scatter_points} fill="#6366f1" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ icon, label, val }: any) {
  return (
    <div className="col-span-12 md:col-span-3 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
      <div className="text-indigo-500 mb-4">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{val ?? "0"}</h3>
    </div>
  );
}