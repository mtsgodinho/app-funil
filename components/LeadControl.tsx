
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
    <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dados do Lead (Variáveis)</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          {/* Use string literal for variable placeholders to avoid JSX shorthand property errors */}
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Nome {'{{nome}}'}</label>
          <input 
            type="text" 
            name="name"
            value={context.name}
            onChange={handleChange}
            placeholder="Ex: João"
            className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          {/* Use string literal for variable placeholders to avoid JSX shorthand property errors */}
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Produto {'{{produto}}'}</label>
          <input 
            type="text" 
            name="product"
            value={context.product}
            onChange={handleChange}
            placeholder="Ex: Mentoria"
            className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          {/* Use string literal for variable placeholders to avoid JSX shorthand property errors */}
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Valor {'{{valor}}'}</label>
          <input 
            type="text" 
            name="value"
            value={context.value}
            onChange={handleChange}
            placeholder="Ex: R$ 497,00"
            className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          {/* Use string literal for variable placeholders to avoid JSX shorthand property errors */}
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Atendente {'{{atendente}}'}</label>
          <input 
            type="text" 
            name="agent"
            value={context.agent}
            onChange={handleChange}
            placeholder="Ex: Maria"
            className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
