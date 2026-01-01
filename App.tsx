
import React, { useState, useEffect } from 'react';
import { Funnel, LeadContext, Message, MessageType } from './types';
import { INITIAL_DATA, STORAGE_KEY } from './constants';
import { LeadControl } from './components/LeadControl';
import { MessagePreview } from './components/MessagePreview';
import { Button } from './components/Button';
import { MessageModal } from './components/MessageModal';
import { WhatsAppConnect } from './components/WhatsAppConnect';
import { sendToWhatsApp } from './services/whatsappService';

const App: React.FC = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [activeFunnelId, setActiveFunnelId] = useState<string | null>(null);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [targetStageId, setTargetStageId] = useState<string | null>(null);
  const [predefinedType, setPredefinedType] = useState<MessageType | undefined>(undefined);
  
  const [leadContext, setLeadContext] = useState<LeadContext>({
    name: 'Cliente',
    product: 'Mentoria Vip',
    value: 'R$ 997,00',
    agent: 'Seu Consultor'
  });

  // Load Data
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

    // Load connection status
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
    if (window.confirm('Deseja desconectar sua conta do WhatsApp?')) {
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
    try {
      await sendToWhatsApp(msg, leadContext);
    } catch (err) {
      alert('Erro ao enviar mensagem');
    } finally {
      setIsSending(null);
    }
  };

  const openQuickAdd = (type: MessageType) => {
    if (!activeFunnel) {
      alert('Selecione um funil primeiro para adicionar a mensagem.');
      return;
    }
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
              const newMessage: Message = {
                ...msgData,
                id: `m-${Date.now()}`,
                order: s.messages.length,
                isFavorite: false
              };
              return { ...s, messages: [...s.messages, newMessage] };
            }
            return s;
          })
        };
      }
      return f;
    });

    saveFunnels(updatedFunnels);
    setPredefinedType(undefined);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Navigation */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-bold text-2xl mb-1">
            <span className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/20">Z</span>
            Z-Funnels
          </div>
          
          <div className="mt-4 flex items-center justify-between p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <button 
              onClick={isConnected ? handleDisconnect : () => setIsConnectOpen(true)}
              className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-md bg-indigo-500/10"
            >
              {isConnected ? 'Sair' : 'Conectar'}
            </button>
          </div>
        </div>

        <div className="px-4 pb-4">
          <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Criar Mensagem Rápida</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => openQuickAdd(MessageType.TEXT)} className="flex items-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-colors border border-slate-700">
              <span className="text-blue-400">📄</span> Texto
            </button>
            <button onClick={() => openQuickAdd(MessageType.AUDIO)} className="flex items-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-colors border border-slate-700">
              <span className="text-amber-400">🎧</span> Áudio
            </button>
            <button onClick={() => openQuickAdd(MessageType.IMAGE)} className="flex items-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-colors border border-slate-700">
              <span className="text-emerald-400">🖼️</span> Imagem
            </button>
            <button onClick={() => openQuickAdd(MessageType.VIDEO)} className="flex items-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-colors border border-slate-700">
              <span className="text-red-400">🎥</span> Vídeo
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <section>
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Meus Funis de Venda</h3>
            <div className="space-y-1">
              {funnels.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFunnelId(f.id);
                    setActiveStageId(null);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group ${
                    activeFunnelId === f.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeFunnelId === f.id ? 'bg-white' : 'bg-slate-600'}`}></span>
                    {f.name}
                  </span>
                  <span className="text-[10px] opacity-40 group-hover:opacity-100">{f.stages.length} etp</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Atalhos</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-800 text-slate-400 flex items-center gap-2">
                <span>⭐</span> Favoritos
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-800 text-slate-400 flex items-center gap-2">
                <span>📊</span> Métricas de Envio
              </button>
            </div>
          </section>
        </nav>

        <div className="p-4 bg-slate-900/80 backdrop-blur border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">AD</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Vendedor Senior</p>
              <p className="text-[10px] text-slate-500">Upgrade para Master</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {activeFunnel ? (
          <>
            <LeadControl context={leadContext} setContext={setLeadContext} />

            {/* Stage Selector */}
            <div className="flex border-b border-slate-100 bg-white p-3 gap-2 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveStageId(null)}
                className={`px-5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  activeStageId === null 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
              >
                Todas as Mensagens
              </button>
              {activeFunnel.stages.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setActiveStageId(s.id)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                    activeStageId === s.id 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : 'text-slate-500 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Messages Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
              <div className="max-w-6xl mx-auto space-y-12">
                {(activeStageId 
                  ? activeFunnel.stages.filter(s => s.id === activeStageId)
                  : activeFunnel.stages).map(stage => (
                  <section key={stage.id} className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
                        {stage.name}
                      </h2>
                      <div className="h-px flex-1 bg-slate-100"></div>
                      <button 
                        onClick={() => { setTargetStageId(stage.id); setIsModalOpen(true); }}
                        className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 uppercase p-2"
                      >
                        + Adicionar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {stage.messages.map(msg => (
                        <div key={msg.id} className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 p-1 hover:shadow-xl transition-all hover:-translate-y-1 group">
                          <MessagePreview message={msg} context={leadContext} />
                          <div className="p-2 pt-0">
                            <Button 
                              variant="whatsapp" 
                              className="w-full !rounded-xl" 
                              size="sm"
                              disabled={isSending !== null}
                              onClick={() => handleSendMessage(msg)}
                            >
                              {isSending === msg.id ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Enviando
                                </span>
                              ) : isConnected ? 'Disparar Agora' : 'Conectar p/ Enviar'}
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
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">📁</div>
            <h2 className="text-xl font-bold text-slate-700">Selecione um Funil de Vendas</h2>
            <p className="mt-2 max-w-sm text-slate-400 text-sm">Gerencie suas mensagens prontas e acelere o atendimento escolhendo uma estratégia na lateral.</p>
          </div>
        )}
      </main>

      {/* Modal for creating messages */}
      <MessageModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setPredefinedType(undefined); }} 
        onSave={handleSaveMessage}
        initialType={predefinedType}
      />

      {/* Modal for WhatsApp Connection */}
      <WhatsAppConnect 
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        onConnected={handleConnected}
      />
    </div>
  );
};

export default App;
