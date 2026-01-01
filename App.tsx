
import React, { useState, useEffect } from 'react';
import { Funnel, LeadContext, Message, MessageType } from './types';
import { INITIAL_DATA, STORAGE_KEY } from './constants';
import { LeadControl } from './components/LeadControl';
import { MessagePreview } from './components/MessagePreview';
import { Button } from './components/Button';
import { MessageModal } from './components/MessageModal';
import { WhatsAppConnect } from './components/WhatsAppConnect';
import { SettingsPanel } from './components/SettingsPanel';
import { processVariables, sendToWhatsApp, simulateLeadResponse } from './services/whatsappService';

// URL DO MASCOTE REAL DA TECHVIEW
const MASCOT_URL = "https://i.imgur.com/iaWw1mr.jpeg";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'funnels' | 'settings'>('funnels');
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [activeFunnelId, setActiveFunnelId] = useState<string | null>(null);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [targetStageId, setTargetStageId] = useState<string | null>(null);
  const [predefinedType, setPredefinedType] = useState<MessageType | undefined>(undefined);
  const [isClientTyping, setIsClientTyping] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, type: MessageType, sender: 'me' | 'client', timestamp: string, media?: string}>>([
    { id: '1', text: 'Olá! Como faço para assinar a Techview?', type: MessageType.TEXT, sender: 'client', timestamp: '10:30' }
  ]);

  const [leadContext, setLeadContext] = useState<LeadContext>({
    name: 'João Silva',
    product: 'Techview Premium+',
    value: 'R$ 49,90',
    agent: 'TechBot'
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFunnels(parsed);
        if (parsed.length > 0) setActiveFunnelId(parsed[0].id);
      } catch (e) {
        setFunnels(INITIAL_DATA);
        setActiveFunnelId(INITIAL_DATA[0].id);
      }
    } else {
      setFunnels(INITIAL_DATA);
      setActiveFunnelId(INITIAL_DATA[0].id);
    }
    const conn = localStorage.getItem('whatsapp_connected') === 'true';
    setIsConnected(conn);
  }, []);

  const saveFunnels = (updatedFunnels: Funnel[]) => {
    setFunnels(updatedFunnels);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFunnels));
  };

  const handleConnected = () => {
    setIsConnected(true);
    localStorage.setItem('whatsapp_connected', 'true');
  };

  const handleDisconnect = () => {
    if (window.confirm('Deseja desconectar sua conta TechLeads?')) {
      setIsConnected(false);
      localStorage.setItem('whatsapp_connected', 'false');
    }
  };

  const activeFunnel = funnels.find(f => f.id === activeFunnelId);
  
  const handleSendMessage = async (msg: Message) => {
    if (!isConnected) {
      setIsConnectOpen(true);
      return;
    }

    setIsSending(msg.id);
    const result = await sendToWhatsApp(msg, leadContext);
    
    const newChatMsg = {
      id: `m-${Date.now()}`,
      text: result.processedContent,
      type: msg.type,
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      media: msg.type !== MessageType.TEXT ? msg.content : undefined
    };

    setChatMessages(prev => [...prev, newChatMsg]);
    setIsSending(null);

    const shouldReply = localStorage.getItem('backend_autoreply') !== 'false';
    if (shouldReply) {
      setTimeout(async () => {
        setIsClientTyping(true);
        const leadReply = await simulateLeadResponse(result.processedContent, leadContext);
        setIsClientTyping(false);
        setChatMessages(prev => [...prev, {
          id: `c-${Date.now()}`,
          text: leadReply,
          type: MessageType.TEXT,
          sender: 'client',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 2000);
    }
  };

  const openQuickAdd = (type: MessageType) => {
    if (!activeFunnel) return alert('Selecione um funil primeiro na barra lateral.');
    const stageId = activeStageId || activeFunnel.stages[0]?.id;
    if (!stageId) return;
    setTargetStageId(stageId);
    setPredefinedType(type);
    setIsModalOpen(true);
  };

  const handleSaveMessage = (msgData: Omit<Message, 'id' | 'order'>) => {
    if (!activeFunnelId || !targetStageId) return;
    const updatedFunnels = funnels.map(f => {
      if (f.id === activeFunnelId) {
        return {
          ...f,
          stages: f.stages.map(s => {
            if (s.id === targetStageId) {
              const newMessage: Message = { ...msgData, id: `m-${Date.now()}`, order: s.messages.length, isFavorite: false };
              return { ...s, messages: [...s.messages, newMessage] };
            }
            return s;
          })
        };
      }
      return f;
    });
    saveFunnels(updatedFunnels);
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden font-sans text-slate-100">
      
      {/* 1. Sidebar - Focada no Astronauta Techview */}
      <aside className="w-80 bg-[#0f172a] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer">
              {/* Círculo de Brilho Neon Azul */}
              <div className="absolute -inset-2 bg-[#00b4ff] rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-700"></div>
              <div className="relative w-36 h-36 rounded-full border-4 border-[#00b4ff]/40 overflow-hidden bg-black flex items-center justify-center shadow-[0_0_30px_rgba(0,180,255,0.3)]">
                <img 
                  src={MASCOT_URL} 
                  alt="Mascote Techview Oficial" 
                  className="w-full h-full object-cover scale-105"
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">👨‍🚀</span>';
                  }}
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <h1 className="text-2xl font-black tracking-tighter text-white">TECH<span className="text-[#00b4ff]">LEADS</span></h1>
              <p className="text-[10px] font-bold text-[#00b4ff] uppercase tracking-[0.4em] opacity-80">BY TECHVIEW</p>
            </div>
          </div>
          
          <div className={`mt-2 flex items-center justify-between p-3 rounded-2xl border transition-all ${isConnected ? 'bg-[#00b4ff]/10 border-[#00b4ff]/30 shadow-[0_0_15px_rgba(0,180,255,0.05)]' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00b4ff] shadow-[0_0_8px_#00b4ff]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isConnected ? 'text-[#00b4ff]' : 'text-red-400'}`}>
                {isConnected ? 'SISTEMA ONLINE' : 'DESCONECTADO'}
              </span>
            </div>
            <button 
              onClick={isConnected ? handleDisconnect : () => setIsConnectOpen(true)}
              className="text-[10px] font-black uppercase bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-all border border-white/10"
            >
              {isConnected ? 'SAIR' : 'CONECTAR'}
            </button>
          </div>
        </div>

        <nav className="px-4 flex gap-2 mb-4">
          <button 
            onClick={() => setActiveTab('funnels')}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'funnels' ? 'bg-[#00b4ff] text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            MEUS FUNIS
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'settings' ? 'bg-[#00b4ff] text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            PAINEL
          </button>
        </nav>

        {activeTab === 'funnels' ? (
          <div className="px-4 pb-4 space-y-4 flex-1 overflow-y-auto">
            <section className="bg-white/5 p-4 rounded-3xl border border-white/5 shadow-inner">
              <h3 className="px-1 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1 h-3 bg-[#00b4ff] rounded-full"></span>
                Disparo Manual
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: MessageType.TEXT, label: 'Texto', icon: '📄' },
                  { type: MessageType.AUDIO, label: 'Áudio', icon: '🎧' },
                  { type: MessageType.IMAGE, label: 'Foto', icon: '🖼️' },
                  { type: MessageType.VIDEO, label: 'Vídeo', icon: '🎥' }
                ].map(item => (
                  <button 
                    key={item.type}
                    onClick={() => openQuickAdd(item.type)} 
                    className="flex flex-col items-center justify-center gap-1.5 p-3 bg-slate-800/50 hover:bg-[#00b4ff]/20 hover:border-[#00b4ff]/30 rounded-xl text-[10px] font-bold text-slate-300 transition-all border border-white/5"
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Estratégias</h3>
              <div className="space-y-1">
                {funnels.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setActiveFunnelId(f.id); setActiveStageId(null); }}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group ${
                      activeFunnelId === f.id ? 'bg-slate-800 text-white border border-[#00b4ff]/30 shadow-[inset_0_0_15px_rgba(0,180,255,0.1)]' : 'hover:bg-slate-800/50 text-slate-500'
                    }`}
                  >
                    <span className="truncate uppercase tracking-tight">{f.name}</span>
                    {activeFunnelId === f.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00b4ff] shadow-[0_0_8px_#00b4ff]"></span>}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
             <div className="bg-slate-800/30 rounded-3xl border border-white/5">
                <SettingsPanel />
             </div>
          </div>
        )}

        <div className="p-4 mt-auto border-t border-white/5 text-center flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-[#00b4ff]/30">
            <img 
              src={MASCOT_URL} 
              className="w-full h-full object-cover" 
              alt="footer-mascot"
            />
          </div>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">TECHVIEW PREMIUM+</p>
        </div>
      </aside>

      {/* 2. Middle Panel */}
      <main className="flex-1 flex flex-col bg-[#020617] overflow-hidden">
        {activeFunnel && activeTab === 'funnels' ? (
          <>
            <div className="p-1">
               <div className="bg-[#0f172a] mx-4 mt-4 rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <LeadControl context={leadContext} setContext={setLeadContext} />
               </div>
            </div>
            
            <div className="flex p-4 gap-2 overflow-x-auto scrollbar-hide px-6 mt-2">
              <button onClick={() => setActiveStageId(null)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${activeStageId === null ? 'bg-[#00b4ff] text-white shadow-xl shadow-blue-500/30 border border-cyan-400/20' : 'text-slate-500 hover:bg-white/5'}`}>Fluxo Completo</button>
              {activeFunnel.stages.map(s => (
                <button key={s.id} onClick={() => setActiveStageId(s.id)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${activeStageId === s.id ? 'bg-[#00b4ff] text-white shadow-xl shadow-blue-500/30 border border-cyan-400/20' : 'text-slate-500 hover:bg-white/5'}`}>{s.name}</button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-12">
                {(activeStageId ? activeFunnel.stages.filter(s => s.id === activeStageId) : activeFunnel.stages).map(stage => (
                  <section key={stage.id} className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-[10px] font-black text-[#00b4ff] uppercase tracking-[0.4em] whitespace-nowrap">{stage.name}</h2>
                      <div className="h-px w-full bg-gradient-to-r from-[#00b4ff]/20 via-[#00b4ff]/5 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {stage.messages.map(msg => (
                        <div key={msg.id} className="bg-[#0f172a] rounded-[2rem] border border-white/5 p-6 shadow-lg hover:border-[#00b4ff]/40 transition-all hover:-translate-y-1 flex flex-col justify-between group">
                          <MessagePreview message={msg} context={leadContext} />
                          <div className="mt-6">
                            <Button 
                              variant="neon" 
                              className="w-full !rounded-2xl font-black py-4 uppercase tracking-[0.2em] text-[10px]"
                              size="sm"
                              disabled={isSending !== null}
                              onClick={() => handleSendMessage(msg)}
                            >
                              {isSending === msg.id ? 'TRANSOMITINDO...' : 'ENVIAR VIA TECHVIEW'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </>
        ) : activeTab === 'funnels' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
             <div className="relative mb-10">
                <div className="absolute -inset-10 bg-[#00b4ff] rounded-full blur-[60px] opacity-10"></div>
                <div className="relative w-64 h-64 rounded-full border-4 border-[#00b4ff]/30 p-2 shadow-[0_0_50px_rgba(0,180,255,0.2)] bg-black overflow-hidden">
                  <img 
                    src={MASCOT_URL} 
                    className="w-full h-full object-cover rounded-full drop-shadow-2xl grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 hover:scale-110" 
                    alt="empty-mascot"
                  />
                </div>
             </div>
             <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-4">Astronauta em Espera</h2>
             <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">Sua branding está pronta. Selecione um funil para decolar nas conversões.</p>
           </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
             <div className="relative w-48 h-48 rounded-full border-2 border-[#00b4ff]/20 mb-10 p-2 flex items-center justify-center group hover:rotate-6 transition-all bg-black shadow-2xl overflow-hidden">
                <img 
                  src={MASCOT_URL} 
                  className="w-full h-full object-cover rounded-full shadow-[0_0_15px_#00b4ff]" 
                  alt="config-mascot"
                />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Central de Comando</h2>
             <p className="text-slate-400 max-w-sm text-sm font-medium leading-relaxed">Ajuste as frequências de transmissão e as credenciais do motor TechLeads aqui.</p>
          </div>
        )}
      </main>

      {/* 3. Live Simulator */}
      <aside className="w-[440px] bg-[#0b141a] border-l border-white/5 flex flex-col shrink-0 relative">
        <div className="p-4 bg-[#202c33] flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-full bg-black border border-[#00b4ff]/30 flex items-center justify-center overflow-hidden">
             <img src={MASCOT_URL} className="w-full h-full object-cover" alt="mini-mascot" />
          </div>
          <div className="flex-1">
            <h4 className="text-[#e9edef] text-sm font-bold tracking-tight">{leadContext.name}</h4>
            <div className="flex items-center gap-1.5">
               <span className={`w-2 h-2 rounded-full ${isClientTyping ? 'bg-[#00b4ff] animate-pulse shadow-[0_0_8px_#00b4ff]' : 'bg-emerald-500'}`}></span>
               <p className="text-[#aebac1] text-[10px] uppercase font-bold tracking-widest">{isClientTyping ? 'conectando...' : 'terminal ativo'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-blend-multiply bg-slate-900 opacity-90">
          {chatMessages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-xl relative animate-in fade-in slide-in-from-bottom-2 ${
                m.sender === 'me' ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-white/5'
              }`}>
                {m.media && (
                   <div className="mb-2 rounded-xl overflow-hidden border border-black/20">
                     {m.type === MessageType.IMAGE && <img src={m.media} className="w-full max-h-64 object-cover" />}
                     {m.type === MessageType.AUDIO && <div className="p-4 bg-black/40 rounded-xl flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#00b4ff] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,180,255,0.3)]">▶</div>
                        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-[#00b4ff]"></div></div>
                     </div>}
                   </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                <div className="text-[10px] text-right mt-1.5 opacity-40 flex items-center justify-end gap-1 font-bold">
                  {m.timestamp}
                  {m.sender === 'me' && <span className="text-[#53bdeb] text-xs">✓✓</span>}
                </div>
              </div>
            </div>
          ))}
          {isClientTyping && (
             <div className="flex justify-start">
               <div className="bg-[#202c33] p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                 <div className="w-1.5 h-1.5 bg-[#00b4ff] rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-[#00b4ff] rounded-full animate-bounce delay-75"></div>
                 <div className="w-1.5 h-1.5 bg-[#00b4ff] rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
          )}
        </div>

        <div className="p-4 bg-[#202c33] flex items-center gap-3">
          <div className="flex-1 bg-[#2a3942] rounded-[1.5rem] px-5 py-3 text-sm text-slate-500 font-medium italic">
            Monitorando frequência de vendas...
          </div>
        </div>
      </aside>

      <MessageModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setPredefinedType(undefined); }} onSave={handleSaveMessage} initialType={predefinedType} />
      <WhatsAppConnect isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} onConnected={handleConnected} />
    </div>
  );
};

export default App;
