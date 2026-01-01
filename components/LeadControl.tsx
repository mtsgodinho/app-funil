
import React from 'react';
import { LeadContext } from '../types';

interface LeadControlProps {
  context: LeadContext;
  setContext: (context: LeadContext) => void;
}

export const LeadControl: React.FC<LeadControlProps> = ({ context, setContext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContext({ ...context, [name]: value });
  };

  return (
    <div className="p-6">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <span className="w-1 h-3 bg-[#00b4ff] rounded-full"></span>
        Parâmetros Dinâmicos
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Nome {{nome}}', name: 'name', val: context.name, placeholder: 'João' },
          { label: 'Produto {{produto}}', name: 'product', val: context.product, placeholder: 'Premium' },
          { label: 'Valor {{valor}}', name: 'value', val: context.value, placeholder: 'R$ 49,90' },
          { label: 'Atendente {{atendente}}', name: 'agent', val: context.agent, placeholder: 'Tech Bot' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-[9px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">{field.label}</label>
            <input 
              type="text" 
              name={field.name}
              value={field.val}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full text-xs p-3 bg-white/5 border border-white/5 rounded-xl focus:ring-1 focus:ring-[#00b4ff] focus:bg-white/10 outline-none text-white transition-all placeholder:opacity-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
