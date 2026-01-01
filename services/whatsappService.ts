
import { Message, MessageType, LeadContext } from '../types';

export const processVariables = (text: string, context: LeadContext): string => {
  return text
    .replace(/{{nome}}/g, context.name)
    .replace(/{{produto}}/g, context.product)
    .replace(/{{valor}}/g, context.value)
    .replace(/{{atendente}}/g, context.agent);
};

export const sendToWhatsApp = async (message: Message, context: LeadContext) => {
  const processedText = message.type === MessageType.TEXT 
    ? processVariables(message.content, context)
    : message.caption ? processVariables(message.caption, context) : '';

  console.log(`[WhatsApp SDK MOCK] Sending ${message.type}:`, {
    content: message.content,
    processedText,
    to: 'active_chat_window'
  });

  // Emulate success delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return true;
};
