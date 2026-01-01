
import { Message, MessageType, LeadContext } from '../types';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const processVariables = (text: string, context: LeadContext): string => {
  return text
    .replace(/{{nome}}/g, context.name)
    .replace(/{{produto}}/g, context.product)
    .replace(/{{valor}}/g, context.value)
    .replace(/{{atendente}}/g, context.agent);
};

/**
 * Pega as configurações em tempo real do localStorage
 */
const getLiveConfig = () => ({
  baseUrl: localStorage.getItem('backend_url') || '',
  apiKey: localStorage.getItem('backend_key') || '',
  instance: localStorage.getItem('backend_instance') || 'vendedor_01'
});

/**
 * Função principal de disparo. 
 */
export const sendToWhatsApp = async (message: Message, context: LeadContext) => {
  const config = getLiveConfig();
  const processedText = message.type === MessageType.TEXT 
    ? processVariables(message.content, context)
    : message.caption ? processVariables(message.caption, context) : 'Arquivo de Mídia';

  console.log(`[BACKEND] Tentando enviar para: ${config.baseUrl || 'MODO SIMULADOR'}`);

  // Se houver uma URL configurada, faria o fetch real aqui
  if (config.baseUrl && config.baseUrl.startsWith('http')) {
     try {
       /* 
       Exemplo de integração real com Evolution API:
       await fetch(`${config.baseUrl}/message/sendText/${config.instance}`, {
         method: 'POST',
         headers: { 'apikey': config.apiKey, 'Content-Type': 'application/json' },
         body: JSON.stringify({ number: "5511999999999", text: processedText })
       }); 
       */
       console.log("Comando enviado para a API real (Simulado)");
     } catch (e) {
       console.error("Erro ao conectar na API real:", e);
     }
  }
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    sentAt: new Date().toISOString(),
    processedContent: processedText
  };
};

/**
 * IA para simular o comportamento do lead
 */
export const simulateLeadResponse = async (userMessage: string, context: LeadContext): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CONTEXTO: Você é um lead real chamado ${context.name}. 
      O vendedor acabou de te enviar: "${userMessage}".
      Você está interessado em ${context.product}.
      
      TAREFA: Responda como um cliente no WhatsApp. Seja breve, informal. 
      Não use emojis em excesso. Mostre interesse ou faça uma pergunta sobre preço/prazo.`,
    });
    
    return response.text || "Pode me falar mais sobre?";
  } catch (error) {
    return "Legal! Vou ver aqui.";
  }
};
