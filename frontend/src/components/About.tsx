"use client";
import React from 'react';
import { Mail, Linkedin, Github, ExternalLink, Terminal, Cpu, Globe } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      
      {/* --- HERO PROFILE CARD --- */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden relative group">
        
        {/* Decorative Background Gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-100 to-cyan-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-40 group-hover:opacity-80 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rose-50 to-indigo-50 rounded-full -ml-20 -mb-20 blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          
          {/* Avatar / Monogram */}
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-900/30 rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 border-4 border-white shrink-0">
            <span className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-indigo-200">PK</span>
          </div>

          <div className="text-center md:text-left space-y-4">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic group-hover:text-indigo-900 transition-colors duration-300">Pankaj Kapri</h2>
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
          colorTheme="indigo"
        />
        <SkillCard 
          icon={<Terminal className="text-blue-600" />} 
          title="Engineered UI" 
          desc="Next.js & Tailwind designed for high-density data viz."
          colorTheme="blue"
        />
        <SkillCard 
          icon={<Globe className="text-emerald-600" />} 
          title="Deployments" 
          desc="Distributed systems running on Vercel and Render."
          colorTheme="emerald"
        />
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="mt-16 text-center group cursor-default">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] group-hover:text-indigo-500 transition-colors duration-300">
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
      className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl text-slate-600 font-bold text-xs hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 group"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span> {label} <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

function SkillCard({ icon, title, desc, colorTheme }: { icon: any, title: string, desc: string, colorTheme: string }) {
  const bgColors: any = {
    indigo: "bg-indigo-50 group-hover:bg-indigo-100",
    blue: "bg-blue-50 group-hover:bg-blue-100",
    emerald: "bg-emerald-50 group-hover:bg-emerald-100",
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group cursor-default">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-colors duration-300 ${bgColors[colorTheme]}`}>
        <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>
      </div>
      <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-2 italic group-hover:text-indigo-900 transition-colors">{title}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}