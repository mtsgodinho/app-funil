
import React, { useState, useEffect } from 'react';
import { MessageType, Message } from '../types';
import { Button } from './Button';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: Omit<Message, 'id' | 'order'>) => void;
  initialType?: MessageType;
}

export const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, onSave, initialType }) => {
  const [type, setType] = useState<MessageType>(initialType || MessageType.TEXT);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [caption, setCaption] = useState('');

  // Sincroniza o tipo se for aberto via botões rápidos
  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert('Preencha os campos obrigatórios');
    
    onSave({
      type,
      title,
      content,
      caption: (type === MessageType.IMAGE || type === MessageType.VIDEO) ? caption : undefined,
    });
    
    // Reset fields
    setTitle('');
    setContent('');
    setCaption('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Nova Mensagem Pronta</h2>
            <p className="text-xs text-slate-400">Personalize seu conteúdo para envio rápido.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Formato da Mídia</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: MessageType.TEXT, label: 'Texto', icon: '📄' },
                { id: MessageType.AUDIO, label: 'Áudio', icon: '🎧' },
                { id: MessageType.IMAGE, label: 'Imagem', icon: '🖼️' },
                { id: MessageType.VIDEO, label: 'Vídeo', icon: '🎥' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    type === t.id 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xl mb-1">{t.icon}</span>
                  <span className="text-[10px] font-bold">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nome do Card (Título)</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Qualificação de Lead"
              className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              {type === MessageType.TEXT ? 'Corpo da Mensagem' : 'URL do Arquivo (Link Direto)'}
            </label>
            {type === MessageType.TEXT ? (
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Olá {{nome}}, tudo bem?..."
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none transition-all"
              />
            ) : (
              <input
                type="url"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://exemplo.com/audio.mp3"
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
            )}
            <p className="mt-1.5 text-[10px] text-slate-400">Dica: Use {'{{nome}}'}, {'{{produto}}'} ou {'{{valor}}'} para personalizar.</p>
          </div>

          {(type === MessageType.IMAGE || type === MessageType.VIDEO) && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Legenda da Mídia</label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Texto que acompanha a imagem/vídeo..."
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none transition-all"
              />
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1 !rounded-xl" onClick={onClose}>Descartar</Button>
            <Button type="submit" variant="primary" className="flex-1 !rounded-xl">Confirmar e Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
