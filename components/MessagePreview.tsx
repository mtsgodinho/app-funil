
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
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          {getIcon()} {message.type}
        </span>
        {message.isFavorite && (
          <span className="text-amber-400 text-xs">★</span>
        )}
      </div>
      
      <h4 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-1">{message.title}</h4>
      
      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 min-h-[40px]">
        {message.type === MessageType.TEXT ? (
          <p className="whitespace-pre-wrap">{processVariables(message.content, context)}</p>
        ) : (
          <div className="flex items-center gap-2">
            <span className="opacity-60 italic">Arquivo: {message.content.substring(0, 20)}...</span>
          </div>
        )}
        {message.caption && (
          <p className="mt-2 pt-2 border-t border-slate-200 italic">
            Legenda: {processVariables(message.caption, context)}
          </p>
        )}
      </div>
    </div>
  );
};
