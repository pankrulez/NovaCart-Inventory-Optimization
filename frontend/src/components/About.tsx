"use client";
import React from 'react';
import { Mail, Linkedin, Github, ExternalLink, Terminal, Cpu, Globe } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* --- HERO PROFILE CARD --- */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-16 shadow-sm overflow-hidden relative group">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Avatar/Initial Circle */}
          <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white">
            <span className="text-5xl font-black italic tracking-tighter">PK</span>
          </div>

          <div className="text-center md:text-left space-y-4">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Pankaj Kapri</h2>
              <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-xs mt-2">Data Scientist • NovaCart Architect</p>
            </div>
            
            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
              Specializing in stochastic inventory modeling, supply chain optimization, and production-grade data pipelines. Pankaj bridges the gap between complex statistical theory and actionable business intelligence.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
               <ContactLink href="mailto:kapripankaj@proton.me" icon={<Mail size={16}/>} label="Email" />
               <ContactLink href="https://www.linkedin.com/in/pankajkapri" icon={<Linkedin size={16}/>} label="LinkedIn" />
               <ContactLink href="https://github.com/pankrulez" icon={<Github size={16}/>} label="GitHub" />
            </div>
          </div>
        </div>
      </div>

      {/* --- TECH STACK GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <SkillCard 
          icon={<Cpu className="text-indigo-600" />} 
          title="Backend Math" 
          desc="FastAPI, NumPy, SciPy for heavy stochastic processing."
        />
        <SkillCard 
          icon={<Terminal className="text-blue-600" />} 
          title="Engineered UI" 
          desc="Next.js & Tailwind designed for high-density data viz."
        />
        <SkillCard 
          icon={<Globe className="text-emerald-600" />} 
          title="Deployments" 
          desc="Distributed systems running on Vercel and Render."
        />
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          Available for innovative data collaborations
        </p>
      </div>
    </div>
  );
}

// --- Internal Helper Components ---

function ContactLink({ href, icon, label }: { href: string, icon: any, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
    >
      {icon} {label} <ExternalLink size={10} className="opacity-40" />
    </a>
  );
}

function SkillCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">{icon}</div>
      <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-2 italic">{title}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}