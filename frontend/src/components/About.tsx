import React from 'react';
import { 
  Linkedin, Github, Mail, MapPin, 
  ExternalLink, Code2, BrainCircuit, Rocket 
} from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* --- BIO HEADER --- */}
      <section className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-xl shadow-slate-200/50 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            P
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Punk</h2>
            <p className="text-xl text-indigo-600 font-bold mb-4 italic">Full-Stack Data Scientist</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-medium text-sm">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> India</span>
              <span className="flex items-center gap-1.5"><Mail size={14} /> hello@novacart.ai</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-slate-100">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center md:text-left">Technical Philosophy</h4>
           <p className="text-slate-600 font-medium leading-relaxed italic text-lg">
             "I build systems that bridge the gap between abstract mathematical models and real-world industrial operations. NovaCart is the culmination of my interest in stochastic processes and high-performance web architecture."
           </p>
        </div>
      </section>

      {/* --- THE TOOLBOX & CONNECT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Core Expertise */}
        <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <BrainCircuit className="text-indigo-400" /> Technical Toolbox
          </h3>
          <div className="space-y-6">
            <ToolRow label="Modeling" value="Scipy, Numpy, Pandas" />
            <ToolRow label="Backend" value="FastAPI, Docker, Python" />
            <ToolRow label="Frontend" value="Next.js, Tailwind, Recharts" />
            <ToolRow label="Deployment" value="Vercel, Render, CI/CD" />
          </div>
        </div>

        {/* Professional Links */}
        <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <Rocket className="text-indigo-600" /> Let's Build.
            </h3>
            <p className="text-slate-500 font-medium text-sm mb-8">Open for collaborations on logistics AI and fintech projects.</p>
          </div>
          
          <div className="space-y-3">
            <SocialBtn href="https://linkedin.com" icon={<Linkedin size={18}/>} label="Connect on LinkedIn" />
            <SocialBtn href="https://github.com" icon={<Github size={18}/>} label="View GitHub Repos" />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Internal Helper Components ---
function ToolRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-end border-b border-white/10 pb-2">
      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-slate-300">{value}</span>
    </div>
  );
}

function SocialBtn({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl font-bold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group"
    >
      <div className="flex items-center gap-3">{icon} {label}</div>
      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}