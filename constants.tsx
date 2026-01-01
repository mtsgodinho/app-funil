
import React from 'react';
import { Funnel, MessageType } from './types';

export const STORAGE_KEY = 'z_funnels_data';

export const INITIAL_DATA: Funnel[] = [
  {
    id: 'f1',
    name: 'Vendas - Curso de Marketing',
    description: 'Funil focado em conversão de leads frios vindos do Instagram.',
    createdAt: Date.now(),
    stages: [
      {
        id: 's1',
        name: 'Boas-vindas',
        order: 0,
        messages: [
          {
            id: 'm1',
            type: MessageType.TEXT,
            title: 'Primeiro Contato',
            content: 'Olá {{nome}}! Tudo bem? Vi que você se interessou pelo nosso curso de {{produto}}. Sou o {{atendente}} e vou te ajudar.',
            order: 0,
            isFavorite: true
          },
          {
            id: 'm2',
            type: MessageType.AUDIO,
            title: 'Áudio de Apresentação',
            content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            order: 1
          }
        ]
      },
      {
        id: 's2',
        name: 'Qualificação',
        order: 1,
        messages: [
          {
            id: 'm3',
            type: MessageType.TEXT,
            title: 'Pergunta de Nível',
            content: 'Você já trabalha com tráfego pago ou está começando do zero agora?',
            order: 0
          }
        ]
      }
    ]
  }
];
