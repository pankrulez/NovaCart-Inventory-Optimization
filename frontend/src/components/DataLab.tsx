"use client";
import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Database, CheckCircle2, BarChart3, PieChart, RefreshCcw, FileText } from 'lucide-react';

export default function DataLabSection() {
  const [file, setFile] = useState<File | null>(null);
  const [isanalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      await processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${API_URL}/api/datalab/upload`, {
        method: 'POST',
        body: formData, // Note: No headers needed for FormData, browser sets them
      });

      if (!res.ok) throw new Error("Failed to process CSV structure.");

      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message);
      setFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Inventory Data Lab</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Upload your global inventory datasets to perform automated batch stochastic modeling and risk segmentation.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
          <RefreshCcw size={16} /> {error}
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
          <div className={`border-4 border-dashed rounded-[3rem] p-20 text-center transition-all ${isanalyzing ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 bg-white shadow-sm'}`}>
            {isanalyzing ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-xl font-bold text-indigo-600 animate-pulse">Parsing Dataset & Modeling Risk...</p>
              </div>
            ) : (
              <>
                <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-indigo-600 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-800">Drop Catalog Here</h3>
                <p className="text-slate-400 font-medium mb-8">Supports .CSV (Required columns: demand, demand_std, lead_time)</p>
                <div className="flex justify-center gap-4">
                  <Badge icon={<FileSpreadsheet size={14}/>} label="CSV Processing" />
                  <Badge icon={<Database size={14}/>} label="FastAPI Stream" />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-bottom-10 duration-700">
          {/* Success Summary */}
          <div className="col-span-12 bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm"><CheckCircle2 className="text-emerald-500 w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-emerald-900">Computation Complete</h4>
                <p className="text-sm text-emerald-700 font-medium italic">{report.filename} analyzed using Stochastic engine.</p>
              </div>
            </div>
            <button onClick={() => setReport(null)} className="bg-white border border-emerald-200 text-emerald-700 px-5 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-50 transition-all">New Upload</button>
          </div>

          {/* Analysis Results Cards */}
          <ResultCard icon={<BarChart3 className="text-indigo-500" />} label="SKUs Analyzed" val={report.skus} />
          <ResultCard icon={<RefreshCcw className="text-blue-500" />} label="Avg. Lead Time" val={report.avg_lead} />
          <ResultCard icon={<PieChart className="text-emerald-500" />} label="Avg. Demand CV" val={report.variance} />

          {/* Action Section */}
          <div className="col-span-12 bg-slate-900 text-white p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6">
               <div className="bg-white/10 p-4 rounded-2xl border border-white/10"><FileText className="text-indigo-400" /></div>
               <div>
                 <h3 className="text-2xl font-black mb-1 italic tracking-tighter">Model Summary Available</h3>
                 <p className="text-slate-400 font-medium text-sm">Download the optimized inventory policy for all {report.skus} SKUs.</p>
               </div>
            </div>
            <button className="mt-6 md:mt-0 bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-widest">
              Export Plan (.PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Internal Components ---
function ResultCard({ icon, label, val }: any) {
  return (
    <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 bg-slate-50 w-fit rounded-2xl mb-6">{icon}</div>
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