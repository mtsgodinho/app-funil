
import React, { useState, useEffect } from 'react';
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
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">&times;</button>
          
          {step === 'qrcode' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Conectar WhatsApp</h2>
                <p className="text-slate-500 text-sm mt-2">Use o WhatsApp no seu celular para escanear o código</p>
              </div>
              
              <div className="relative mx-auto w-64 h-64 bg-slate-50 border-8 border-slate-100 rounded-2xl flex items-center justify-center group cursor-pointer" onClick={simulateConnection}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Z-Funnels-Connection-Simulator" 
                  alt="WhatsApp QR Code" 
                  className="w-48 h-48 opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">Clique para Simular Scan</span>
                </div>
              </div>

              <div className="text-left bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex gap-3 text-xs text-slate-600">
                  <span className="font-bold text-indigo-600">1.</span>
                  Abra o WhatsApp no seu celular
                </div>
                <div className="flex gap-3 text-xs text-slate-600">
                  <span className="font-bold text-indigo-600">2.</span>
                  Toque em Mais opções ou Configurações e selecione Aparelhos conectados
                </div>
                <div className="flex gap-3 text-xs text-slate-600">
                  <span className="font-bold text-indigo-600">3.</span>
                  Aponte seu celular para esta tela para capturar o código
                </div>
              </div>
            </div>
          )}

          {step === 'loading' && (
            <div className="py-12 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
              <h2 className="text-xl font-bold text-slate-800">Autenticando...</h2>
              <p className="text-slate-500 text-sm mt-2">Sincronizando suas conversas e contatos.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center animate-in zoom-in">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
              <h2 className="text-xl font-bold text-slate-800">Conectado com Sucesso!</h2>
              <p className="text-slate-500 text-sm mt-2">Sua extensão está pronta para disparar funis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
