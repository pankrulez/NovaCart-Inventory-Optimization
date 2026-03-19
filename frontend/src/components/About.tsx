import { Linkedin, Github } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="max-w-2xl mx-auto text-center animate-in fade-in duration-700">
      <div className="w-32 h-32 bg-indigo-600 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
        P
      </div>
      <h2 className="text-4xl font-black mb-2 text-slate-900">Punk</h2>
      <p className="text-slate-500 font-medium mb-10 italic">Data Scientist | Supply Chain Enthusiast</p>
      <div className="flex justify-center gap-6">
        <a href="https://linkedin.com/in/yourprofile" target="_blank" className="flex items-center gap-2 bg-white border border-slate-200 px-8 py-3 rounded-2xl font-bold text-slate-700 hover:border-indigo-300 transition-all shadow-sm">
          <Linkedin size={20}/> LinkedIn
        </a>
        <a href="https://github.com/yourprofile" target="_blank" className="flex items-center gap-2 bg-white border border-slate-200 px-8 py-3 rounded-2xl font-bold text-slate-700 hover:border-indigo-300 transition-all shadow-sm">
          <Github size={20}/> GitHub
        </a>
      </div>
    </div>
  );
}