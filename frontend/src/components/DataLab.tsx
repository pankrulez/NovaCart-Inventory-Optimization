import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Database, CheckCircle2, BarChart3, PieChart, RefreshCcw } from 'lucide-react';

export default function DataLabSection() {
  const [file, setFile] = useState<File | null>(null);
  const [isanalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      simulateAnalysis();
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate a backend processing delay
    setTimeout(() => {
      setReport({
        skus: 1242,
        avg_lead: "4.2 Weeks",
        variance: "18.5%",
        health: "Good"
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Inventory Data Lab</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Upload your global inventory datasets to perform automated batch stochastic modeling and risk segmentation.
        </p>
      </div>

      {!report ? (
        <div className="relative group">
          <input 
            type="file" 
            accept=".csv, .xlsx" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`border-4 border-dashed rounded-[3rem] p-20 text-center transition-all ${isanalyzing ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 bg-white'}`}>
            {isanalyzing ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-xl font-bold text-indigo-600 animate-pulse">Running Stochastic Engine...</p>
              </div>
            ) : (
              <>
                <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-indigo-600 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black mb-3">Drop Dataset Here</h3>
                <p className="text-slate-400 font-medium mb-8">Supports .CSV, .XLSX (Max 50MB)</p>
                <div className="flex justify-center gap-4">
                  <Badge icon={<FileSpreadsheet size={14}/>} label="CSV" />
                  <Badge icon={<Database size={14}/>} label="Excel" />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-bottom-10 duration-700">
          {/* Success Summary */}
          <div className="col-span-12 bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="text-emerald-500 w-8 h-8" />
              <div>
                <h4 className="font-bold text-emerald-900">Analysis Complete</h4>
                <p className="text-sm text-emerald-700 font-medium">Processed {file?.name} successfully.</p>
              </div>
            </div>
            <button onClick={() => setReport(null)} className="text-emerald-700 font-black text-xs uppercase hover:underline">Upload New File</button>
          </div>

          {/* Analysis Results Cards */}
          <div className="col-span-4 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
             <BarChart3 className="text-indigo-500 mb-6" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SKUs Analyzed</p>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{report.skus}</h3>
          </div>
          <div className="col-span-4 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
             <RefreshCcw className="text-blue-500 mb-6" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Lead Time</p>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{report.avg_lead}</h3>
          </div>
          <div className="col-span-4 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
             <PieChart className="text-emerald-500 mb-6" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Demand Variance</p>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{report.variance}</h3>
          </div>

          {/* Mock Action Section */}
          <div className="col-span-12 bg-slate-900 text-white p-10 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black mb-2">Generate Executive Report</h3>
              <p className="text-slate-400 font-medium text-sm">Download the full stochastic optimization plan based on this dataset.</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20">
              DOWNLOAD PDF
            </button>
          </div>
        </div>
      )}
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