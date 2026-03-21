import React from 'react';
import { Database, Cpu, Zap, Layout, CheckCircle2, Server, Code2 } from 'lucide-react';

export default function PipelineSection({ pipeline }: { pipeline: any[] }) {
  const steps = [
    {
      stage: "01. Data Ingestion",
      title: "FastAPI Gateway",
      icon: <Database className="text-indigo-600" />,
      desc: "Raw supply chain parameters are ingested via RESTful endpoints with Pydantic schema validation.",
      tech: ["FastAPI", "Pydantic"]
    },
    {
      stage: "02. Stochastic Modeling",
      title: "Scientific Computing",
      icon: <Cpu className="text-blue-600" />,
      desc: "The engine uses Scipy to model lead-time demand uncertainty using the Normal Distribution.",
      tech: ["Scipy.stats", "Numpy"]
    },
    {
      stage: "03. Optimization",
      title: "Safety Stock Logic",
      icon: <Zap className="text-amber-600" />,
      desc: "Calculates the Reorder Point (ROP) based on target service levels and variance analysis.",
      tech: ["Z-Score Mapping"]
    },
    {
      stage: "04. Visualization",
      title: "React Dashboard",
      icon: <Layout className="text-emerald-600" />,
      desc: "Processed data is visualized using Recharts for real-time executive decision support.",
      tech: ["Next.js", "Recharts"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-10 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">System Pipeline</h2>
        <p className="text-slate-500 font-medium">The architectural flow from raw parameters to optimized intelligence.</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="relative flex gap-8 group">
            {/* Connector Line */}
            {i !== steps.length - 1 && (
              <div className="absolute left-10 top-20 bottom-0 w-0.5 bg-slate-200 z-0"></div>
            )}

            <div className="relative z-10 flex-shrink-0 w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center shadow-sm group-hover:border-indigo-400 transition-colors">
              {step.icon}
            </div>

            <div className="flex-1 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm mb-12 hover:shadow-xl transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{step.stage}</span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{step.title}</h4>
                </div>
                <CheckCircle2 className="text-emerald-500" size={20} />
              </div>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">{step.desc}</p>
              <div className="flex flex-wrap gap-2">
                {step.tech.map((t, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                    <Code2 size={10} /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud Infrastructure Card */}
      <div className="mt-12 bg-slate-900 rounded-[3rem] p-10 text-white flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10"><Server className="text-indigo-400" /></div>
          <div>
            <h4 className="text-xl font-bold italic tracking-tighter uppercase">Cloud Infrastructure</h4>
            <p className="text-slate-400 text-sm font-medium">FastAPI on Render | Next.js on Vercel</p>
          </div>
        </div>
        <div className="text-right hidden md:block border-l border-white/10 pl-6">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">System Latency</p>
          <p className="font-bold tracking-tighter text-2xl">&lt; 150ms</p>
        </div>
      </div>
    </div>
  );
}