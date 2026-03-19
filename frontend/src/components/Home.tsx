import { Cpu, Database, ShieldCheck } from 'lucide-react';

export default function HomeSection() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center mb-16">
        <h1 className="text-7xl font-black tracking-tight mb-6 italic text-slate-900">
          Inventory <span className="text-indigo-600">Intelligence.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          NovaCart is a full-stack data science solution designed to solve the "Safety Stock Paradox"—balancing capital liquidity with service reliability.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard icon={<Cpu className="text-indigo-500"/>} title="Stochastic Engine" desc="Uses probability density functions to model lead-time demand variability." />
        <FeatureCard icon={<Database className="text-blue-500"/>} title="Data Pipelines" desc="Structured ETL processes converting raw CSV/ERP data into optimized insights." />
        <FeatureCard icon={<ShieldCheck className="text-emerald-500"/>} title="Risk Mitigation" desc="Dynamically calculates ROP to ensure 95%+ service levels." />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">{icon}</div>
      <h4 className="text-2xl font-black mb-4 tracking-tight">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}