"use client";
import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Database, CheckCircle2, BarChart3, PieChart, RefreshCcw, Download, AlertTriangle, FileText } from 'lucide-react';

export default function DataLabSection() {
  const [file, setFile] = useState<File | null>(null);
  const [isanalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const downloadSample = () => {
    const csvContent = "SKU,demand,demand_std,lead_time,lead_time_std,cost,order_cost\nSKU-001,160,40,4,1.2,50,150\nSKU-002,200,20,2,0.5,100,150\nSKU-003,450,120,5,2.1,15,150";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'novacart_template.csv';
    a.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      
      // Automatic trigger upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      setIsAnalyzing(true);

      try {
        const res = await fetch(`${API_URL}/api/datalab/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.detail || "Upload failed");
        }
        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message);
        setFile(null);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Inventory Data Lab</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Upload your product catalog to perform automated batch stochastic modeling and risk segmentation.
        </p>
        <button 
          onClick={downloadSample}
          className="flex items-center gap-2 mx-auto text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all uppercase tracking-widest border border-indigo-100"
        >
          <Download size={14} /> Download Sample Template
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
          <AlertTriangle size={18} /> Error: {error}
        </div>
      )}

      {!report ? (
        <div className="relative group">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            disabled={isanalyzing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />
          <div className={`border-4 border-dashed rounded-[3rem] p-20 text-center transition-all ${isanalyzing ? 'border-indigo-400 bg-indigo-50/30 shadow-inner' : 'border-slate-200 hover:border-indigo-300 bg-white shadow-sm'}`}>
            {isanalyzing ? (
              <div className="flex flex-col items-center">
                <RefreshCcw className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
                <p className="text-xl font-black text-indigo-600 animate-pulse uppercase tracking-tighter">Analyzing Dataset...</p>
              </div>
            ) : (
              <>
                <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-indigo-600 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-800">Drop Dataset Here</h3>
                <p className="text-slate-400 font-medium mb-8 uppercase text-xs tracking-widest font-bold">CSV only • Max 50MB</p>
                <div className="flex justify-center gap-4">
                  <Badge icon={<FileSpreadsheet size={14}/>} label="Pandas Parser" />
                  <Badge icon={<Database size={14}/>} label="FastAPI Stream" />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom-10 duration-700">
          <div className="col-span-12 bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-5">
              <div className="bg-white p-4 rounded-2xl shadow-sm"><CheckCircle2 className="text-emerald-500 w-7 h-7" /></div>
              <div>
                <h4 className="font-black text-emerald-900 text-xl tracking-tight leading-tight">Batch Analysis Complete</h4>
                <p className="text-sm text-emerald-700 font-medium italic">Successfully modeled {report.filename}</p>
              </div>
            </div>
            <button onClick={() => setReport(null)} className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-black text-[10px] uppercase border border-emerald-200 hover:bg-emerald-100 transition-all">New Upload</button>
          </div>

          <ResultCard icon={<BarChart3 className="text-indigo-500" />} label="Total SKUs" val={report.skus} />
          <ResultCard icon={<RefreshCcw className="text-blue-500" />} label="Average Lead Time" val={report.avg_lead} />
          <ResultCard icon={<PieChart className="text-emerald-500" />} label="Avg. Demand Variance" val={report.variance} />
          
          {/* Risk Card */}
          <div className="col-span-12 md:col-span-4 bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] shadow-sm">
            <AlertTriangle className="text-rose-500 mb-6" size={32} />
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">High Volatility SKUs</p>
            <h3 className="text-3xl font-black text-rose-900 tracking-tighter">{report.at_risk} <span className="text-sm opacity-60">Items</span></h3>
          </div>

          <div className="col-span-12 md:col-span-8 bg-slate-900 text-white p-10 rounded-[3rem] flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6">
               <div className="bg-white/10 p-4 rounded-2xl border border-white/10"><FileText className="text-indigo-400" /></div>
               <div>
                 <h3 className="text-2xl font-black mb-1 italic tracking-tighter">Executive Inventory Plan</h3>
                 <p className="text-slate-400 font-medium text-sm">Automated safety stock and EOQ thresholds for all items.</p>
               </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-black transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/30">
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ icon, label, val }: any) {
  return (
    <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
      <div className="p-1 mb-6">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{val}</h3>
    </div>
  );
}

function Badge({ icon, label }: any) {
  return (
    <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
      {icon} {label}
    </span>
  );
}