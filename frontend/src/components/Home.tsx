import React from 'react';
import { 
  Cpu, Database, ShieldCheck, BarChart3, 
  ArrowRight, Binary, Zap, Globe 
} from 'lucide-react';

export default function HomeSection() {
  return (
    <div className="max-w-6xl mx-auto space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* --- HERO SECTION --- */}
      <section className="text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-600">
          <Zap size={14} className="fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Inventory Modeling</span>
        </div>
        
        <h1 className="text-7xl font-black tracking-tight text-slate-900 leading-[0.9]">
          Optimizing Capital <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Through Uncertainty.
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
          NovaCart is an enterprise-grade stochastic simulation engine. It leverages probability density 
          functions to determine optimal reorder points, effectively balancing high service-level 
          requirements with minimal working capital commitment.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-slate-900 leading-none">Used by 12+ Simulated Warehouses</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Benchmarking</p>
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Cpu className="text-indigo-600" size={28}/>} 
          title="Stochastic Logic" 
          desc="Calculates safety stock using the Normal Distribution of combined demand and lead-time variance." 
        />
        <FeatureCard 
          icon={<Database className="text-blue-600" size={28}/>} 
          title="ETL Pipelines" 
          desc="Automated cleaning and feature engineering of multi-dimensional supply chain datasets." 
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-600" size={28}/>} 
          title="Risk-Adjusted ROP" 
          desc="Dynamic Reorder Points that adapt to target service levels (90% to 99.9%) in real-time." 
        />
      </section>

      {/* --- THE METHODOLOGY (The Data Science "Flex") --- */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Binary size={200} />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl font-black tracking-tight">The Mathematics of <br /> Inventory Resilience</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              Standard inventory models often fail by assuming constant lead times. NovaCart employs 
              the <strong>Square Root Law of Inventory</strong> combined with 
              stochastic demand modeling to predict stockout events before they occur.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold">
                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px]">1</div>
                Combined Standard Deviation of Demand & Lead Time
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px]">2</div>
                Z-Score probability mapping for Service Level targets
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px]">3</div>
                Probabilistic Reorder Point (ROP) generation
              </li>
            </ul>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Live Metric Extraction</span>
              <BarChart3 size={18} className="text-indigo-400" />
            </div>
            <div className="space-y-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[85%]"></div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[60%]"></div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[92%]"></div>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase text-center pt-4 italic">
              "Data-driven decisions reduce holding costs by up to 22%"
            </p>
          </div>
        </div>
      </section>

      {/* --- TECH STACK RIBBON --- */}
      <section className="text-center py-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Integrated Technology Stack</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <StackIcon label="FastAPI" />
          <StackIcon label="Next.js" />
          <StackIcon label="TailwindCSS" />
          <StackIcon label="Recharts" />
          <StackIcon label="Scipy/Numpy" />
          <StackIcon label="Docker" />
        </div>
      </section>
    </div>
  );
}

// --- Helper Components ---
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
      <div className="bg-slate-50 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-indigo-50 transition-colors duration-500">
        {icon}
      </div>
      <h4 className="text-2xl font-black mb-4 tracking-tight text-slate-900">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function StackIcon({ label }: { label: string }) {
  return (
    <span className="text-sm font-black text-slate-800 tracking-tighter uppercase italic">{label}</span>
  );
}