
# Arquitetura Z-Funnels

Como Arquiteto Sênior, projetei esta solução focada em **escalabilidade, performance e conformidade (anti-bloqueio)**.

## 1. Stack Tecnológica
- **Core:** React 18+ com TypeScript (Tipagem forte para evitar erros em produção).
- **Style:** Tailwind CSS (UI rápida e consistente).
- **State:** Hooks nativos (useState, useEffect) - para o MVP. Em escala, usaríamos Zustand ou Redux.
- **Persistence:** LocalStorage (Simulando uma extensão onde dados são locais ao navegador).
- **Integração:** Mock de SDK WhatsApp preparado para injeção via Content Script em extensão de navegador.

## 2. Modelo de Dados
- **Funnel:** Agregador principal (Nome, Descrição, ID).
- **Stage:** Organiza a jornada (Ex: Frio -> Morno -> Quente).
- **Message:** Unidade básica com suporte polimórfico (Texto, Áudio, Imagem, Vídeo).

## 3. Fluxo de Trabalho do Usuário
1. **Configuração:** O usuário define as variáveis do lead (Nome, Produto) no painel superior.
2. **Navegação:** Seleciona a etapa do funil correspondente ao momento do chat.
3. **Disparo:** Com 1 clique, a mensagem é processada (substituição de variáveis) e enviada para o buffer do WhatsApp.

## 4. Boas Práticas WhatsApp (Anti-Bloqueio)
- **Atrasos Randômicos:** O serviço de envio deve simular um "humano digitando" (delay de 200-800ms por caractere no caso de automação total).
- **Conteúdo Dinâmico:** Use as variáveis `{{nome}}` para que cada mensagem seja tecnicamente diferente para o algoritmo da Meta.
- **Acionamento Manual:** Esta ferramenta brilha porque o acionamento é **humano**, reduzindo drasticamente o risco de banimento em comparação com bots 100% automáticos.

## 5. Estrutura de Pastas Sugerida
- `components/`: UI Atômica e componentes de negócio.
- `services/`: Lógica de envio, processamento de variáveis e APIs.
- `types.ts`: Definições de interfaces do domínio.
- `constants.ts`: Dados fixos e configurações globais.
