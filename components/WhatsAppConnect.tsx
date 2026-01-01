
import React, { useState } from 'react';
import { Button } from './Button';

interface WhatsAppConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export const WhatsAppConnect: React.FC<WhatsAppConnectProps> = ({ isOpen, onClose, onConnected }) => {
  const [step, setStep] = useState<'qrcode' | 'loading' | 'success'>('qrcode');

  if (!isOpen) return null;

  const simulateConnection = () => {
    setStep('loading');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConnected();
        onClose();
        setStep('qrcode');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-[#0f172a] rounded-[3rem] shadow-[0_0_100px_rgba(0,180,255,0.15)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/5">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          <div className="flex-1 p-10 flex flex-col justify-center bg-gradient-to-br from-[#0f172a] to-[#020617]">
            <div className="mb-8">
              <div className="w-16 h-16 bg-[#00b4ff] rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-[0_0_30px_rgba(0,180,255,0.4)] rotate-3">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.435 1.119 3.399l-1.124 4.102 4.102-1.124c.964.714 2.132 1.119 3.399 1.119 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm0 1.049c2.612 0 4.718 2.106 4.718 4.718 0 2.612-2.106 4.718-4.718 4.718-1.049 0-2.022-.345-2.809-.922l-.24-.135-2.052.562.562-2.052-.135-.24c-.577-.787-.922-1.76-.922-2.809 0-2.612 2.106-4.718 4.718-4.718zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.66 1.438 5.168L2 22l4.832-1.438C8.34 21.474 10.109 22 12 2c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter">TECH<span className="text-[#00b4ff]">LEADS</span></h2>
              <p className="text-slate-400 text-sm mt-3 font-medium leading-relaxed">Conecte o motor Techview ao seu WhatsApp para automação de alta performance.</p>
            </div>

            <div className="space-y-4">
               {[
                 {num: 1, text: "Abra o WhatsApp Web no seu celular"},
                 {num: 2, text: "Acesse as configurações de dispositivos"},
                 {num: 3, text: "Escaneie o QR Code ao lado"}
               ].map(i => (
                <div key={i.num} className="flex gap-4 items-center group">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-black text-[#00b4ff] shrink-0 group-hover:scale-110 transition-transform">{i.num}</div>
                  <p className="text-xs font-bold text-slate-300 tracking-wide">{i.text}</p>
                </div>
               ))}
            </div>
          </div>

          <div className="w-full md:w-[320px] bg-white/5 p-10 flex flex-col items-center justify-center relative border-l border-white/5 backdrop-blur-sm">
            <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors text-2xl font-black">&times;</button>
            
            {step === 'qrcode' && (
              <div className="flex flex-col items-center space-y-8 w-full">
                <div className="relative p-6 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(0,180,255,0.2)] group cursor-pointer" onClick={simulateConnection}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TECHLEADS-${Date.now()}`} 
                    alt="Scan TechLeads" 
                    className="w-44 h-44 opacity-90 group-hover:opacity-100 transition-all group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all rounded-[2.5rem]">
                    <span className="bg-[#00b4ff] text-white px-5 py-2.5 rounded-full text-[10px] font-black shadow-xl uppercase tracking-widest">Sincronizar</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#00b4ff] rounded-full animate-ping"></div>
                      <div className="w-1.5 h-1.5 bg-[#00b4ff] rounded-full animate-ping delay-75"></div>
                   </div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Aguardando conexão</p>
                </div>
              </div>
            )}

            {step === 'loading' && (
              <div className="flex flex-col items-center animate-in zoom-in">
                <div className="w-24 h-24 border-[4px] border-white/5 border-t-[#00b4ff] rounded-full animate-spin mb-8 shadow-inner"></div>
                <h3 className="font-black text-white uppercase tracking-widest text-lg">AUTENTICANDO</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-[0.2em]">Criptografia de ponta a ponta...</p>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-[#00b4ff] text-white rounded-[2rem] flex items-center justify-center text-5xl mb-6 shadow-[0_0_40px_rgba(0,180,255,0.5)] rotate-12">✓</div>
                <h3 className="font-black text-white text-2xl tracking-tighter uppercase">CONECTADO!</h3>
                <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Acesso Autorizado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
