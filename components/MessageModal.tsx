
import React, { useState, useEffect, useRef } from 'react';
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
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Arquivo muito pesado! Máximo permitido: 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setContent(base64);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert('Por favor, defina um título e conteúdo.');
    
    onSave({
      type,
      title,
      content,
      caption: (type === MessageType.IMAGE || type === MessageType.VIDEO) ? caption : undefined,
    });
    
    setTitle('');
    setContent('');
    setCaption('');
    setFileName(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="bg-[#0f172a] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,180,255,0.1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/5">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">NOVA MENSAGEM</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Editor TechLeads</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full transition-colors">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Tipo de Mídia</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: MessageType.TEXT, label: 'TEXTO', icon: '📄' },
                { id: MessageType.AUDIO, label: 'ÁUDIO', icon: '🎧' },
                { id: MessageType.IMAGE, label: 'FOTO', icon: '🖼️' },
                { id: MessageType.VIDEO, label: 'VÍDEO', icon: '🎥' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setType(t.id); setContent(''); setFileName(null); }}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                    type === t.id 
                    ? 'bg-[#00b4ff]/10 border-[#00b4ff]/50 text-[#00b4ff] shadow-[0_0_15px_rgba(0,180,255,0.1)]' 
                    : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                >
                  <span className="text-xl mb-1">{t.icon}</span>
                  <span className="text-[9px] font-black">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Título do Card</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pitch de Vendas"
              className="w-full text-xs p-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-1 focus:ring-[#00b4ff] outline-none text-white transition-all placeholder:opacity-20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
              Conteúdo da Transmissão
            </label>
            
            {type === MessageType.TEXT ? (
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Olá {{nome}}, pronto para o Premium+?..."
                className="w-full text-xs p-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-1 focus:ring-[#00b4ff] outline-none resize-none text-white transition-all placeholder:opacity-20"
              />
            ) : (
              <div className="space-y-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept={type === MessageType.AUDIO ? "audio/*" : type === MessageType.IMAGE ? "image/*" : "video/*"}
                  onChange={handleFileChange}
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00b4ff]/50 hover:bg-[#00b4ff]/5 transition-all group"
                >
                  <span className="text-3xl mb-3 opacity-30 group-hover:scale-110 group-hover:opacity-100 transition-all">
                    {type === MessageType.AUDIO ? '🎵' : type === MessageType.IMAGE ? '📸' : '🎞️'}
                  </span>
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-[#00b4ff] uppercase tracking-widest text-center">
                    {fileName || `ESCOLHER ${type}`}
                  </span>
                </div>
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                  <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="bg-[#0f172a] px-3 text-slate-600">Ou use Link Cloud</span></div>
                </div>

                <input
                  type="url"
                  value={content.startsWith('data:') ? '' : content}
                  onChange={(e) => { setContent(e.target.value); setFileName(null); }}
                  placeholder="https://cloud.techview.com/video.mp4"
                  className="w-full text-xs p-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-1 focus:ring-[#00b4ff] outline-none text-white transition-all placeholder:opacity-20"
                />
              </div>
            )}
          </div>

          {(type === MessageType.IMAGE || type === MessageType.VIDEO) && (
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Legenda de Mídia</label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Texto que aparecerá abaixo do arquivo..."
                className="w-full text-xs p-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-1 focus:ring-[#00b4ff] outline-none resize-none text-white transition-all placeholder:opacity-20"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">DESCARTAR</button>
            <Button type="submit" variant="neon" className="flex-2 !rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-[10px] px-8">GRAVAR MENSAGEM</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
