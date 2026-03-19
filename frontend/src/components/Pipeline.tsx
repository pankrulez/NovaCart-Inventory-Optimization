export default function PipelineSection({ pipeline }: { pipeline: any[] }) {
  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-left-8 duration-700">
      <h2 className="text-4xl font-black mb-12 text-center text-slate-900">Architectural Pipeline</h2>
      <div className="relative border-l-2 border-indigo-100 ml-6 space-y-12">
        {pipeline.map((p, i) => (
          <div key={i} className="relative pl-12 group">
            <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white border-4 border-indigo-600 rounded-full group-hover:scale-125 transition-transform"></div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-slate-800">{p.step}</h4>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{p.status}</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}