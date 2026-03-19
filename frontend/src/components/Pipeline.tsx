import React from 'react';
import { 
  Database, Cpu, Globe, Layout, 
  ArrowDown, CheckCircle2, Zap, Server, Code2 
} from 'lucide-react';

export default function PipelineSection() {
  const steps = [
    {
      stage: "01. Data Ingestion & Validation",
      title: "FastAPI Gateway",
      icon: <Database className="text-indigo-600" />,
      desc: "Raw supply chain parameters are ingested via a RESTful API. The system performs Pydantic-based schema validation to ensure data integrity before computation.",
      tech: ["FastAPI", "Pydantic", "CORS Middleware"]
    },
    {
      stage: "02. Stochastic Modeling",
      title: "Scientific Computing Core",
      icon: <Cpu className="text-blue-600" />,
      desc: "The backend leverages Scipy and Numpy to model the 'Combined Standard Deviation'. This accounts for both demand volatility and lead-time uncertainty simultaneously.",
      tech: ["Scipy.stats", "Numpy", "Normal Distribution"]
    },
    {
      stage: "03. Optimization Engine",
      title: "Safety Stock Logic",
      icon: <Zap className="text-amber-600" />,
      desc: "Using the target Service Level (Z-Score), the engine calculates the Reorder Point (ROP). It converts mathematical probability into actionable logistics instructions.",
      tech: ["Z-Score Mapping", "Inventory Theory"]
    },
    {
      stage: "04. Client-Side Rendering",
      title: "Next.js Dashboard",
      icon: <Layout className="text-emerald-600" />,
      desc: "The processed JSON payload is rendered using Recharts. Next.js 15 provides a high-performance, responsive interface with real-time state management via React Hooks.",
      tech: ["Next.js", "Tailwind CSS", "Recharts"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-10 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">System Architecture</h2>
        <p className="text-slate-500 font-medium">The end-to-end flow from raw data to optimized decision intelligence.</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            {/* The Connecting Line */}
            {i !== steps.length - 1 && (
              <div className="absolute left-10 top-20 bottom-0 w-0.5 bg-slate-200 z-0"></div>
            )}

            <div className="relative z-10 flex gap-8 group">
              {/* Icon / Number Circle */}
              <div className="flex-shrink-0 w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center shadow-sm group-hover:border-indigo-400 transition-colors duration-500">
                {step.icon}
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm mb-12 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{step.stage}</span>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{step.title}</h4>
                  </div>
                  <CheckCircle2 className="text-emerald-500" size={20} />
                </div>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  {step.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {step.tech.map((t, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-100">
                      <Code2 size={10} /> {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CLOUD INFRASTRUCTURE MINI-CARD --- */}
      <div className="mt-12 bg-slate-900 rounded-[3rem] p-10 text-white flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
            <Server className="text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xl font-bold">Cloud Deployment</h4>
            <p className="text-slate-400 text-sm font-medium">Dockerized Backend on Render & Next.js on Vercel</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Latency</p>
              <p className="font-bold tracking-tighter">&lt; 120ms</p>
           </div>
           <div className="text-right border-l border-white/10 pl-4">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Uptime</p>
              <p className="font-bold tracking-tighter">99.9%</p>
           </div>
        </div>
      </div>
    </div>
  );
}