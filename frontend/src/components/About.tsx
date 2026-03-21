import React from 'react';
import { Linkedin, Github, Mail, MapPin, ExternalLink, Code2, Rocket } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-1000">
      
      <section className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-xl mb-12 relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-44 h-44 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl rotate-2 hover:rotate-0 transition-transform">
            P
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">PUNK</h2>
            <p className="text-xl text-indigo-600 font-bold mb-6 italic tracking-tight uppercase">Full-Stack Data Scientist</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-5 text-slate-500 font-medium">
              <span className="flex items-center gap-2 text-sm"><MapPin size={16} /> India</span>
              <span className="flex items-center gap-2 text-sm"><Mail size={16} /> punk.dev@example.com</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-slate-100">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Technical Mission</h4>
           <p className="text-slate-600 font-medium leading-relaxed italic text-lg max-w-2xl">
             "Bridging the gap between stochastic mathematical models and real-time operational software. My goal is to build 
             intelligent systems that convert uncertainty into actionable logistics strategy."
           </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Toolbox */}
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3 italic">
            <Code2 className="text-indigo-400" /> THE TOOLBOX
          </h3>
          <div className="space-y-4">
            <SkillRow label="DATA SCIENCE" val="Scipy, Numpy, Pandas, Statistics" />
            <SkillRow label="BACKEND" val="FastAPI, Python, Docker" />
            <SkillRow label="FRONTEND" val="Next.js, Tailwind, Recharts" />
          </div>
        </div>

        {/* Links */}
        <div className="bg-white border border-slate-200 p-10 rounded-[3rem] flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-3 uppercase italic">
              <Rocket className="text-indigo-600" /> Let's Connect
            </h3>
            <p className="text-slate-400 font-medium text-sm mb-10 tracking-tight leading-relaxed">
              Open for collaboration on supply chain AI, logistics dashboards, and stochastic modeling projects.
            </p>
          </div>
          
          <div className="space-y-3">
            <SocialLink href="https://linkedin.com" icon={<Linkedin size={18}/>} label="LinkedIn" />
            <SocialLink href="https://github.com" icon={<Github size={18}/>} label="GitHub Repos" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function SkillRow({ label, val }: any) {
  return (
    <div className="border-b border-white/10 pb-2">
      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-300">{val}</p>
    </div>
  );
}

function SocialLink({ href, icon, label }: any) {
  return (
    <a href={href} target="_blank" className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl font-bold text-slate-700 hover:bg-indigo-600 hover:text-white transition-all group">
      <div className="flex items-center gap-3">{icon} {label}</div>
      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}