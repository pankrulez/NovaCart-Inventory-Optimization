import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Activity, RefreshCcw } from 'lucide-react';

export default function OptimizerSection({ inputs, setInputs, handleSimulate, simData, loading }: any) {
  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8">Simulation Control</h3>
        <div className="space-y-6">
          {Object.keys(inputs).map((key) => (
            <div key={key}>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">{key.replace(/_/g, ' ')}</label>
              <input 
                type="number" step="0.1" value={(inputs as any)[key]} 
                onChange={(e) => setInputs({...inputs, [key]: parseFloat(e.target.value)})}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
          ))}
          <button onClick={handleSimulate} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
            {loading ? <RefreshCcw className="animate-spin" /> : <Activity size={20}/>} RUN ANALYSIS
          </button>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={simData?.chart || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="x" hide />
            <YAxis hide />
            <Tooltip />
            <Area type="monotone" dataKey="y" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} strokeWidth={4} />
            {simData && <ReferenceLine x={simData.metrics.rop} stroke="#F43F5E" strokeDasharray="8 8" strokeWidth={2} />}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}