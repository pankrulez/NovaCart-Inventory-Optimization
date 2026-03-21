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

  const downloadSample = () => {
    const csvContent = "SKU,demand,demand_std,lead_time,lead_time_std,cost,order_cost\nSKU-001,160,40,4,1.2,50,150\nSKU-002,200,20,2,0.5,100,150\nSKU-003,450,120,5,2.1,15,150";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'novacart_template.csv';
    a.click();
  };

  const exportResults = () => {
    if (!report || !report.scatter_points) return;
    
    // Construct CSV content from the analyzed scatter_points
    const headers = "SKU,Average_Demand,Lead_Time,Recommended_ROP\n";
    const rows = report.scatter_points.map((p: any) => 
      `${p.SKU},${p.demand},${p.lead_time},${Math.round(p.rop)}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NovaCart_Analysis_${report.filename}`;
    a.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const formData = new FormData();
      formData.append('file', selectedFile);
      setIsAnalyzing(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/datalab/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error("Processing failed. Check CSV format.");
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
      {/* --- HEADER --- */}
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Inventory Data Lab</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Upload your product catalog to perform automated batch stochastic modeling and risk segmentation.
        </p>
        <button 
          onClick={downloadSample}
          className="flex items-center gap-2 mx-auto text-[10px] font-black text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-100 transition-all uppercase tracking-widest border border-indigo-100"
        >
          <Download size={14} /> Download Sample Template
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
          <AlertTriangle size={18} /> Error: {error}
        </div>
      )}

      {/* --- UPLOAD BOX --- */}
      {!report ? (
        <div className="relative group">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            disabled={isanalyzing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />
          <div className={`border-4 border-dashed rounded-[3rem] p-20 text-center transition-all ${isanalyzing ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 bg-white shadow-sm'}`}>
            {isanalyzing ? (
              <div className="flex flex-col items-center">
                <RefreshCcw className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
                <p className="text-xl font-black text-indigo-600 animate-pulse uppercase tracking-tighter">Crunching Big Data...</p>
              </div>
            ) : (
              <>
                <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-indigo-600 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-800 tracking-tight">Drop Dataset Here</h3>
                <p className="text-slate-400 font-medium mb-8 uppercase text-[10px] tracking-[0.2em] font-bold">CSV only • Max 50MB</p>
                <div className="flex justify-center gap-4">
                  <Badge icon={<FileSpreadsheet size={14}/>} label="Batch Processing" />
                  <Badge icon={<Database size={14}/>} label="FastAPI Stream" />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom-10 duration-700">
          {/* --- SUCCESS HEADER --- */}
          <div className="col-span-12 bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between shadow-sm gap-4">
            <div className="flex items-center gap-5">
              <div className="bg-white p-4 rounded-2xl shadow-sm"><CheckCircle2 className="text-emerald-500 w-7 h-7" /></div>
              <div>
                <h4 className="font-black text-emerald-900 text-xl tracking-tight leading-tight uppercase italic">Analysis Complete</h4>
                <p className="text-sm text-emerald-700 font-medium italic">Derived metrics from {report.filename}</p>
              </div>
            </div>
            <button onClick={() => setReport(null)} className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-black text-[10px] uppercase border border-emerald-200 hover:bg-emerald-100 transition-all shadow-sm">New Upload</button>
          </div>

          {/* --- METRICS --- */}
          <ResultCard icon={<BarChart3 className="text-indigo-500" />} label="Total SKUs" val={report.skus} />
          <ResultCard icon={<RefreshCcw className="text-blue-500" />} label="Avg. Lead Time" val={report.avg_lead} />
          <ResultCard icon={<PieChart className="text-emerald-500" />} label="Avg. Demand CV" val={report.variance} />
          <div className="col-span-12 md:col-span-3 bg-rose-50 border border-rose-100 p-8 rounded-[2rem] shadow-sm">
             <AlertTriangle className="text-rose-500 mb-4" size={24} />
             <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">High Volatility</p>
             <h3 className="text-3xl font-black text-rose-900 tracking-tighter">{report.at_risk} <span className="text-xs opacity-50 uppercase tracking-widest">SKUs</span></h3>
          </div>

          {/* --- CHARTS ROW --- */}
          <div className="col-span-12 lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-[400px]">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-widest italic font-bold">Volatility Segmentation</h4>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.risk_chart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="level" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                    {report.risk_chart?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-[400px]">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-widest italic font-bold">Inventory Profile (ROP Scale)</h4>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="demand" name="Demand" tick={{fontSize: 10}} label={{ value: 'Demand', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis type="number" dataKey="lead_time" name="LT" tick={{fontSize: 10}} label={{ value: 'Weeks', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                  <ZAxis type="number" dataKey="rop" range={[50, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Products" data={report.scatter_points} fill="#6366f1" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- ACTION FOOTER (Download Results) --- */}
          <div className="col-span-12 bg-slate-900 text-white p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between shadow-2xl mt-4">
            <div className="flex items-center gap-6">
               <div className="bg-white/10 p-5 rounded-3xl border border-white/10 shadow-inner"><FileText className="text-indigo-400" size={32} /></div>
               <div>
                 <h3 className="text-2xl font-black mb-1 italic tracking-tighter">Executive Planning Strategy</h3>
                 <p className="text-slate-400 font-medium text-sm max-w-sm">The engine has generated optimal safety stock and ROP thresholds for all {report.skus} items.</p>
               </div>
            </div>
            <button 
              onClick={exportResults}
              className="mt-8 md:mt-0 bg-indigo-600 hover:bg-indigo-700 px-10 py-5 rounded-2xl font-black transition-all uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-600/30 flex items-center gap-3 active:scale-95"
            >
              <Download size={18} /> Export Analyzed Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Internal Helper Components ---
function ResultCard({ icon, label, val }: { icon: any, label: string, val: any }) {
  return (
    <div className="col-span-12 md:col-span-3 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{val ?? "0"}</h3>
    </div>
  );
}

function Badge({ icon, label }: { icon: any, label: string }) {
  return (
    <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
      {icon} {label}
    </span>
  );
}