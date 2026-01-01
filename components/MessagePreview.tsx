
import React from 'react';
import { Message, MessageType, LeadContext } from '../types';
import { processVariables } from '../services/whatsappService';

interface MessagePreviewProps {
  message: Message;
  context: LeadContext;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({ message, context }) => {
  const getIcon = () => {
    switch (message.type) {
      case MessageType.TEXT: return '📄';
      case MessageType.AUDIO: return '🎧';
      case MessageType.IMAGE: return '🖼️';
      case MessageType.VIDEO: return '🎥';
      default: return '✉️';
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00b4ff] bg-[#00b4ff]/10 px-2 py-1 rounded-md border border-[#00b4ff]/20">
          {message.type}
        </span>
        {message.isFavorite && (
          <span className="text-amber-400 text-sm drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">★</span>
        )}
      </div>
      
      <h4 className="text-sm font-black text-white mb-2 line-clamp-1 group-hover:text-[#00b4ff] transition-colors">{message.title}</h4>
      
      <div className="text-[11px] text-slate-400 bg-black/20 p-3 rounded-2xl border border-white/5 min-h-[50px] leading-relaxed">
        {message.type === MessageType.TEXT ? (
          <p className="whitespace-pre-wrap">{processVariables(message.content, context)}</p>
        ) : (
          <div className="flex items-center gap-2">
            <span className="opacity-40 italic font-mono uppercase tracking-widest text-[9px]">Mídia_Anexada.sys</span>
          </div>
        )}
        {message.caption && (
          <p className="mt-2 pt-2 border-t border-white/5 italic opacity-60">
            {processVariables(message.caption, context)}
          </p>
        )}
      </div>
    </div>
  );
};
