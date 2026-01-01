
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface Settings {
  apiUrl: string;
  apiKey: string;
  instanceName: string;
  autoReply: boolean;
}

export const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    apiUrl: localStorage.getItem('backend_url') || '',
    apiKey: localStorage.getItem('backend_key') || '',
    instanceName: localStorage.getItem('backend_instance') || 'vendedor_01',
    autoReply: localStorage.getItem('backend_autoreply') === 'true'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('backend_url', settings.apiUrl);
    localStorage.setItem('backend_key', settings.apiKey);
    localStorage.setItem('backend_instance', settings.instanceName);
    localStorage.setItem('backend_autoreply', String(settings.autoReply));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in bg-[#0f172a] rounded-[2.5rem]">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Configurações do Motor</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Integração com Servidor de Disparo</p>
      </div>

      <div className="space-y-6">
        <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-[1.5rem]">
          <h4 className="text-[10px] font-black text-[#00b4ff] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            🚀 Dica Techview
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Para máxima estabilidade no <strong>TechLeads</strong>, utilize servidores com suporte a Docker (Render, Oracle ou Railway). Mantenha sua instância ativa para evitar o atraso na primeira mensagem.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">URL da API do Servidor</label>
            <input
              type="url"
              value={settings.apiUrl}
              onChange={(e) => setSettings({...settings, apiUrl: e.target.value})}
              placeholder="https://sua-instancia.techview.com"
              className="w-full text-xs p-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-1 focus:ring-[#00b4ff] focus:bg-white/10 outline-none text-white transition-all placeholder:opacity-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Chave de API</label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                placeholder="Key Secreta"
                className="w-full text-xs p-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-1 focus:ring-[#00b4ff] focus:bg-white/10 outline-none text-white transition-all placeholder:opacity-20"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">ID da Instância</label>
              <input
                type="text"
                value={settings.instanceName}
                onChange={(e) => setSettings({...settings, instanceName: e.target.value})}
                placeholder="Ex: canal_01"
                className="w-full text-xs p-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-1 focus:ring-[#00b4ff] focus:bg-white/10 outline-none text-white transition-all placeholder:opacity-20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[1.5rem] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => setSettings({...settings, autoReply: !settings.autoReply})}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${settings.autoReply ? 'bg-[#00b4ff] shadow-[0_0_15px_#00b4ff]' : 'bg-slate-700'}`}>
              {settings.autoReply && <span className="text-white text-xs font-black">✓</span>}
            </div>
            <div className="flex-1">
              <label className="text-xs font-black text-white cursor-pointer uppercase tracking-tight">
                Simulador Inteligente (IA)
              </label>
              <p className="text-[10px] text-slate-500 mt-0.5">Permite que o lead simule respostas automáticas no modo demo.</p>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        variant={isSaved ? 'whatsapp' : 'neon'} 
        className="w-full !rounded-2xl py-5 font-black uppercase tracking-[0.3em] text-[10px]"
      >
        {isSaved ? 'ALTERAÇÕES SALVAS ✓' : 'SALVAR CONFIGURAÇÃO'}
      </Button>
    </div>
  );
};
