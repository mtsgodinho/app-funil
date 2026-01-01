
import { Funnel, MessageType } from './types';

export const STORAGE_KEY = 'techleads_data_v1';

export const INITIAL_DATA: Funnel[] = [
  {
    id: 'f1',
    name: 'Vendas - Techview Premium+',
    description: 'Funil focado em conversão de leads para assinatura de TV e Streaming.',
    createdAt: Date.now(),
    stages: [
      {
        id: 's1',
        name: 'Apresentação',
        order: 0,
        messages: [
          {
            id: 'm1',
            type: MessageType.TEXT,
            title: 'Boas-vindas Inicial',
            content: 'Olá {{nome}}! Que prazer ter você aqui na Techview. 🚀 Vi seu interesse no {{produto}}. Sou o {{atendente}} e vou liberar seu acesso agora!',
            order: 0,
            isFavorite: true
          },
          {
            id: 'm2',
            type: MessageType.IMAGE,
            title: 'Banner da Oferta',
            content: 'https://images.unsplash.com/photo-1593784991095-a205039475fe?q=80&w=1000',
            caption: 'Confira nossos planos promocionais para o {{produto}}!',
            order: 1
          }
        ]
      },
      {
        id: 's2',
        name: 'Fechamento',
        order: 1,
        messages: [
          {
            id: 'm3',
            type: MessageType.TEXT,
            title: 'Link de Pagamento',
            content: 'Perfeito {{nome}}! O valor promocional é de {{valor}}. Segue seu link de ativação imediata: [LINK]',
            order: 0
          }
        ]
      }
    ]
  }
];
