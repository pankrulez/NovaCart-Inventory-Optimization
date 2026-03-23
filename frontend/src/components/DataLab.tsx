"use client";
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, CartesianGrid, Cell 
} from 'recharts';
import { 
  UploadCloud, CheckCircle2, BarChart3, PieChart, RefreshCcw, 
  Download, AlertTriangle, FileText, Database, FileSpreadsheet,
  FileQuestion, Copy, Crosshair
} from 'lucide-react';

export default function DataLabSection({ report, setReport }: any) {
  const [isanalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novacart-inventory-optimization.onrender.com';
  const COLORS = ['#818cf8', '#6366f1', '#4f46e5', '#f43f5e'];

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
    const headers = "SKU,Average_Demand,Lead_Time,Recommended_ROP\n";
    const rows = report.scatter_points.map((p: any) => 
      `${p.SKU},${p.demand},${p.lead_time},${Math.round(p.rop)}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NovaCart_Analysis_${report.filename || 'export'}.csv`;
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
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      {/* --- HEADER --- */}
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm">Inventory Data Lab</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Upload your product catalog to perform automated batch stochastic modeling and risk segmentation.
        </p>
        <button 
          onClick={downloadSample}
          className="flex items-center gap-2 mx-auto text-[10px] font-black text-indigo-600 bg-indigo-50 px-6 py-3 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 uppercase tracking-widest border border-indigo-100 hover:border-indigo-600 active:scale-95"
        >
          <Download size={14} className="animate-bounce" /> Download Sample Template
        </button>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-bold flex items-center gap-3 shadow-md shadow-rose-100/50">
          <AlertTriangle size={18} className="animate-pulse" /> Error: {error}
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
          <div className={`border-2 border-dashed rounded-[3.5rem] p-24 text-center transition-all duration-300 ${isanalyzing ? 'border-indigo-400 bg-indigo-50/50 shadow-inner' : 'border-slate-300 hover:border-indigo-400 bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1'}`}>
            {isanalyzing ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <RefreshCcw className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
                </div>
                <p className="text-xl font-black text-indigo-600 animate-pulse uppercase tracking-tighter">Crunching Big Data...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm border border-indigo-100/50">
                  <UploadCloud className="text-indigo-600 w-12 h-12 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight group-hover:text-indigo-900 transition-colors">Drop Dataset Here</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">CSV only • Max 50MB</p>
                <div className="flex justify-center gap-4">
                  <Badge icon={<FileSpreadsheet size={14}/>} label="Batch Processing" />
                  <Badge icon={<Database size={14}/>} label="FastAPI Stream" />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* --- REPORT VIEW --- */
        <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom-10 duration-700 ease-out">
          
          <div className="col-span-12 bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-700 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-900/20 gap-4 group">
            <div className="flex items-center gap-5">
              <div className="bg-indigo-500 p-4 rounded-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300"><CheckCircle2 className="text-white w-7 h-7" /></div>
              <div>
                <h4 className="font-black text-white text-xl tracking-tight leading-tight uppercase italic">Analysis Complete</h4>
                <p className="text-sm text-indigo-200/70 font-medium italic">Derived metrics from dataset</p>
              </div>
            </div>
            <button onClick={() => setReport(null)} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-indigo-50 hover:shadow-lg transition-all shadow-sm active:scale-95">New Upload</button>
          </div>

          {/* --- DATA QUALITY DIAGNOSTICS --- */}
          <div className="col-span-12 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 group">
             <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-slate-100 transition-colors"><Database size={20} className="text-slate-600" /></div>
                <div>
                   <h4 className="text-sm font-black uppercase tracking-tighter text-slate-900 group-hover:text-indigo-900 transition-colors">Data Health Report</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pre-processing validation</p>
                </div>
             </div>
             <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <QualityPill 
                  icon={<FileQuestion size={14} />} 
                  label="Missing Values" 
                  val={`${report.data_quality?.missing_pct || 0}%`} 
                  isWarning={(report.data_quality?.missing_pct || 0) > 5} 
                />
                <QualityPill 
                  icon={<Copy size={14} />} 
                  label="Duplicates" 
                  val={report.data_quality?.duplicates || 0} 
                  isWarning={(report.data_quality?.duplicates || 0) > 0} 
                />
                <QualityPill 
                  icon={<Crosshair size={14} />} 
                  label="Demand Outliers" 
                  val={report.data_quality?.outliers || 0} 
                  isWarning={false} 
                />
             </div>
          </div>

          {/* --- KPI CARDS --- */}
          <ResultCard icon={<BarChart3 className="text-indigo-600" />} label="Total SKUs" val={report.skus} colorTheme="indigo" />
          <ResultCard icon={<RefreshCcw className="text-emerald-600" />} label="Average Lead Time" val={report.avg_lead} colorTheme="emerald" />
          <ResultCard icon={<PieChart className="text-amber-600" />} label="Avg. Demand CV" val={report.variance} colorTheme="amber" />
          
          {/* HIGH VOLATILITY ALERT */}
          <div className="col-span-12 md:col-span-3 bg-rose-50 border border-rose-200 p-8 rounded-[2.5rem] shadow-lg shadow-rose-100/50 hover:shadow-xl hover:shadow-rose-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center group cursor-default">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="text-rose-500" size={20} />
                </div>
                <span className="bg-rose-200 text-rose-700 text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest border border-rose-300">Action Required</span>
             </div>
             <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 group-hover:text-rose-500 transition-colors">High Volatility</p>
             <h3 className="text-3xl font-black text-rose-900 tracking-tighter italic">{report.at_risk} <span className="text-xs opacity-50 uppercase tracking-widest not-italic">SKUs</span></h3>
          </div>

          {/* --- CHARTS --- */}
          <div className="col-span-12 lg:col-span-5 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-[400px] group">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-widest italic group-hover:text-slate-500 transition-colors">Volatility Segmentation</h4>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.risk_chart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="level" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold'}} />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={48}>
                    {report.risk_chart?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-[400px] group">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-widest italic group-hover:text-slate-500 transition-colors">Inventory Profile (ROP Scale)</h4>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="demand" name="Demand" tick={{fontSize: 10}} label={{ value: 'Average Demand', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                  <YAxis type="number" dataKey="lead_time" name="LT" tick={{fontSize: 10}} label={{ value: 'Weeks', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                  <ZAxis type="number" dataKey="rop" range={[60, 500]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                  <Scatter name="Products" data={report.scatter_points} fill="#6366f1" fillOpacity={0.6} className="hover:fill-indigo-400 transition-colors cursor-crosshair" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- ACTION FOOTER --- */}
          <div className="col-span-12 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-900/20 border border-slate-700 mt-4 group">
            <div className="flex items-center gap-6">
               <div className="bg-white/5 p-5 rounded-3xl border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-500"><FileText className="text-indigo-400" size={32} /></div>
               <div>
                 <h3 className="text-2xl font-black mb-1 italic tracking-tighter">Executive Planning Strategy</h3>
                 <p className="text-slate-400 font-medium text-sm max-w-sm">The engine has generated optimal safety stock and ROP thresholds for all <strong className="text-indigo-300">{report.skus}</strong> items.</p>
               </div>
            </div>
            <button 
              onClick={exportResults}
              className="mt-8 md:mt-0 bg-indigo-600 hover:bg-indigo-500 px-10 py-5 rounded-2xl font-black transition-all duration-300 uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-600/30 flex items-center gap-3 active:scale-95 hover:shadow-indigo-500/40"
            >
              <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> Export Analyzed Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function ResultCard({ icon, label, val, colorTheme }: { icon: any, label: string, val: any, colorTheme: string }) {
  const bgColors: any = {
    indigo: "bg-indigo-50 group-hover:bg-indigo-100",
    emerald: "bg-emerald-50 group-hover:bg-emerald-100",
    amber: "bg-amber-50 group-hover:bg-amber-100",
  };

  return (
    <div className="col-span-12 md:col-span-3 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-lg shadow-slate-200/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 group cursor-default">
      <div className={`mb-6 w-fit p-3 rounded-2xl shadow-sm transition-colors duration-300 ${bgColors[colorTheme]}`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{val ?? "0"}</h3>
    </div>
  );
}

function Badge({ icon, label }: { icon: any, label: string }) {
  return (
    <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 uppercase tracking-widest shadow-sm">
      {icon} {label}
    </span>
  );
}

function QualityPill({ icon, label, val, isWarning }: any) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-colors duration-300 ${isWarning ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
       <div className={isWarning ? 'text-rose-500' : 'text-slate-500'}>{icon}</div>
       <div>
          <p className={`text-[9px] font-black uppercase tracking-widest ${isWarning ? 'text-rose-400' : 'text-slate-400'}`}>{label}</p>
          <p className="text-sm font-black tracking-tighter">{val}</p>
       </div>
    </div>
  );
}